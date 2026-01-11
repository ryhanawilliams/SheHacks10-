// tutorial.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import TutorialLayout from "../layouts/tutorial";
import { ITEMS } from "../data/items.jsx";
import { supabase } from "../lib/supabaseClient";

const IDEAS_KEY = "upcycling_ideas";

export default function TutorialPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch tutorial data
  useEffect(() => {
    const fetchTutorial = async () => {
      setLoading(true);

      // 1. Check navigation state
      const fromState = location.state?.idea;
      if (fromState?.id === id) {
        setIdea(fromState);
        setLoading(false);
        return;
      }

      // 2. Check hardcoded items
      const item = ITEMS.find((x) => x.id === id);
      if (item && item.tutorial) {
        setIdea({
          id: item.id,
          tutorial: item.tutorial,
          liked: item.liked || false,
        });
        setLoading(false);
        return;
      }

      // 3. Check sessionStorage
      try {
        const raw = sessionStorage.getItem(IDEAS_KEY);
        const ideas = raw ? JSON.parse(raw) : [];
        const sessionIdea = ideas.find((x) => x.id === id);
        if (sessionIdea) {
          setIdea(sessionIdea);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("SessionStorage check failed:", err);
      }

      // 4. Fetch from database (for generated tutorials)
      try {
        console.log("Fetching tutorial from database:", id);
        const { data, error } = await supabase
          .from("tutorials")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          console.error("Database fetch error:", error);
          setIdea(null);
        } else if (data) {
          setIdea({
            id: data.id,
            title: data.title,
            imageUrl: data.image_url,
            tutorial: data.tutorial,
          });
        } else {
          setIdea(null);
        }
      } catch (err) {
        console.error("Error fetching tutorial:", err);
        setIdea(null);
      }

      setLoading(false);
    };

    fetchTutorial();
  }, [id, location.state]);

  // Check if tutorial is liked in Supabase
  useEffect(() => {
    const checkLikedStatus = async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return setLiked(false);

      const { data } = await supabase
        .from("likes")
        .select("tutorial_id")
        .eq("user_id", user.id)
        .eq("tutorial_id", id)
        .maybeSingle();

      setLiked(!!data);
    };

    checkLikedStatus();
  }, [id]);

  // Handle like/unlike with Supabase integration
  const handleToggleLike = async () => {
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) return alert("Please log in first.");

    if (!liked) {
      // Like the tutorial
      const { error } = await supabase.from("likes").insert({
        user_id: user.id,
        tutorial_id: id,
      });
      if (error) return alert(error.message);
      setLiked(true);
    } else {
      // Unlike the tutorial
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("tutorial_id", id);
      if (error) return alert(error.message);
      setLiked(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading tutorial...</div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="p-6">
        <p className="text-sm text-zinc-700">Tutorial not found.</p>
        <Link className="text-sm font-semibold text-zinc-900 underline" to="/">
          Back to Home
        </Link>
      </div>
    );
  }

  const tutorialData = idea.tutorial;

  if (!tutorialData) {
    return (
      <div className="p-6">
        <p className="text-sm text-zinc-700">
          Tutorial data is missing or malformed.
        </p>
        <Link className="text-sm font-semibold text-zinc-900 underline" to="/">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto mt-4 max-w-4xl px-4 py-4">
        <Link
          to="/"
          className="text-sm font-semibold text-zinc-600 hover:text-zinc-900"
        >
          ← Back to Home
        </Link>
      </div>

      <TutorialLayout
        title={tutorialData.title}
        hero={tutorialData.hero}
        meta={tutorialData.meta}
        liked={liked}
        onToggleLike={handleToggleLike}
        materials={tutorialData.materials}
        steps={tutorialData.steps}
      />
    </div>
  );
}
