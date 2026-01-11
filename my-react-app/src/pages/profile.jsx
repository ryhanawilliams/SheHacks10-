import React from "react";
import { Link, useNavigate } from "react-router-dom";
import pfpImage from "/avatar.jpeg";
import { useUserProfile } from "../hooks/useUserProfile";
import { supabase } from "../lib/supabaseClient";

export default function Profile() {
  const { profile, loading, refetch } = useUserProfile();
  const [email, setEmail] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
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
        alert("✅ Name saved successfully!");
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
        <Link to="/likes">
          <img
            src="/Heart4.png"
            alt="likes"
            className="w-8 h-8 hover:cursor-pointer hover:opacity-90 duration-500"
          />
        </Link>
      </div>
      <div className="w-[95%] h-full flex flex-col items-center overflow-y-auto bg-[#f5f5f5]">
        <div className="flex flex-col items-center justify-center pt-16 mt-16">
          <img
            src={pfpImage}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover mb-6"
          />
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
                    className="text-3xl font-bold text-black text-center px-4 py-2 border-2 border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Enter your name"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="text-purple-600 hover:text-purple-800 transition-colors duration-300"
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
      </div>
    </div>
  );
}
