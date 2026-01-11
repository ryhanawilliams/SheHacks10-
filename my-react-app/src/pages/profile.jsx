import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";
import { supabase } from "../lib/supabaseClient";
import ProfilePictureUpload from "../components/ProfilePictureUpload";
import LikeButton from "../components/LikeButton";
import { ITEMS } from "../data/items.jsx";

export default function Profile() {
  const { profile, loading, refetch, userId } = useUserProfile();
  const [email, setEmail] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [likedTutorials, setLikedTutorials] = React.useState([]);
  const [loadingLikes, setLoadingLikes] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const getEmail = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setEmail(data.user.email);
      }
    };
    getEmail();
  }, []);

  React.useEffect(() => {
    if (profile?.name) {
      setNewName(profile.name);
    }
  }, [profile]);

  React.useEffect(() => {
    const loadLikedTutorials = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) {
        setLoadingLikes(false);
        return;
      }

      try {
        // Get all liked tutorial IDs for this user
        const { data, error } = await supabase
          .from("likes")
          .select("tutorial_id")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching likes:", error);
          setLoadingLikes(false);
          return;
        }

        const likedIds = (data ?? []).map((like) => like.tutorial_id);

        if (likedIds.length === 0) {
          setLikedTutorials([]);
          setLoadingLikes(false);
          return;
        }

        const allTutorials = [];

        // 1. Get hardcoded tutorials that are liked
        const hardcodedLiked = ITEMS.filter((item) =>
          likedIds.includes(item.id)
        );
        allTutorials.push(...hardcodedLiked);

        // 2. Get generated tutorials from database
        const hardcodedIds = ITEMS.map((item) => item.id);
        const generatedIds = likedIds.filter(
          (id) => !hardcodedIds.includes(id)
        );

        if (generatedIds.length > 0) {
          const { data: dbTutorials, error: tutError } = await supabase
            .from("tutorials")
            .select("*")
            .in("id", generatedIds);

          if (tutError) {
            console.error("Error fetching generated tutorials:", tutError);
          } else if (dbTutorials) {
            const formattedDbTutorials = dbTutorials.map((tut) => ({
              id: tut.id,
              title: tut.title,
              src: tut.image_url,
              category: "Generated",
              liked: true,
              tutorial: tut.tutorial,
            }));
            allTutorials.push(...formattedDbTutorials);
          }
        }

        setLikedTutorials(allTutorials);
      } catch (err) {
        console.error("Unexpected error loading liked tutorials:", err);
      } finally {
        setLoadingLikes(false);
      }
    };

    loadLikedTutorials();
  }, []);

  const handleEditClick = () => {
    setNewName(profile?.name || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!newName.trim()) {
      alert("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) {
        alert("User not found");
        setSaving(false);
        return;
      }

      // Use upsert to insert or update
      const { error } = await supabase.from("profiles").upsert(
        {
          id: userId,
          name: newName.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("Profile save error:", error);
        if (
          error.message.includes("does not exist") ||
          error.message.includes("Could not find")
        ) {
          alert(
            "⚠️ Profiles table doesn't exist yet!\n\n" +
              "Please run the SQL in your Supabase dashboard:\n" +
              "1. Go to SQL Editor\n" +
              "2. Run the CREATE TABLE profiles SQL\n\n" +
              "For now, your name won't be saved."
          );
        } else {
          alert("Error saving name: " + error.message);
        }
      } else {
        setIsEditing(false);
        refetch(); // Refresh the profile data
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setNewName(profile?.name || "");
    setIsEditing(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert("Error logging out: " + error.message);
        setLoggingOut(false);
      } else {
        // Redirect to login page after successful logout
        navigate("/login");
      }
    } catch (err) {
      alert("Error: " + err.message);
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-row w-full h-full">
      <div className="w-[5%] h-full border-r-2 border-gray-300 flex flex-col items-center justify-start py-12 gap-12">
        <img src="/circl.png" alt="logo" className="w-8 h-8" />
        <Link to="/">
          <img
            src="/Icon.png"
            alt="Home"
            className="w-8 h-8 hover:cursor-pointer hover:opacity-90 duration-500"
          />
        </Link>
      </div>
      <div className="w-[95%] h-full flex flex-col items-center overflow-y-auto bg-[#f5f5f5]">
        <div className="flex flex-col items-center justify-center pt-16 mt-16">
          <div className="mb-6">
            <ProfilePictureUpload
              currentAvatarUrl={profile?.avatar_url}
              userId={userId}
              onUploadComplete={refetch}
            />
          </div>
          {loading ? (
            <h1 className="text-3xl font-bold text-black mb-1">Loading...</h1>
          ) : (
            <>
              {isEditing ? (
                <div className="flex flex-col items-center gap-4 mb-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-3xl font-bold text-black text-center px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-300"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-[#EF6589] text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold text-black">
                    {profile?.name || "Anonymous User"}
                  </h1>
                  <button
                    onClick={handleEditClick}
                    className="text-black hover:text-black transition-colors duration-300"
                    title="Edit name"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-gray-500 text-xl mb-6">
                {email || "@username"}
              </p>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-4 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>

        {/* Liked Tutorials Section */}
        <div className="w-full max-w-6xl px-8 pb-16 mt-12">
          <div className="w-full mb-6">
            <div className="flex items-center justify-start px-1 pb-2 pt-1">
              <div className="relative whitespace-nowrap text-lg font-bold text-zinc-900">
                Liked
                <span className="absolute -bottom-2 left-0 right-0 h-[2px] w-full rounded-full bg-zinc-900" />
              </div>
            </div>
          </div>
          {loadingLikes ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : likedTutorials.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-md">
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                No liked tutorials yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start exploring and like your favorite tutorials!
              </p>
              <Link
                to="/"
                className="inline-block px-8 py-3 bg-[#EF6589] text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300"
              >
                Browse Tutorials
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedTutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col relative"
                >
                  <Link
                    to={`/tutorial/${tutorial.id}`}
                    className="flex flex-col flex-1"
                  >
                    {/* Image */}
                    <div className="relative w-full h-56 overflow-hidden">
                      <img
                        src={tutorial.src}
                        alt={tutorial.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-[#EF6589] text-white px-3 py-1 rounded-lg text-sm font-semibold">
                        {tutorial.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {tutorial.title}
                      </h3>
                      {tutorial.tutorial?.meta?.readTime && (
                        <p className="text-sm text-gray-600">
                          ⏱️ {tutorial.tutorial.meta.readTime}
                        </p>
                      )}
                    </div>
                  </Link>

                  {/* Like Button */}
                  <div
                    className="absolute top-3 right-3 p-2 hover:cursor-pointer z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        // Reload liked tutorials after unlike
                        setTimeout(() => loadLikedTutorials(), 500);
                      }}
                    >
                      <LikeButton tutorialId={tutorial.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
