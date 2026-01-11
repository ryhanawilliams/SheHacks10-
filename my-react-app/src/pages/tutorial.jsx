// tutorial.jsx
import React, { useMemo, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import TutorialLayout from "../layouts/tutorial";
import { ITEMS } from "../data/items.jsx";

const IDEAS_KEY = "upcycling_ideas";

export default function TutorialPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const idea = useMemo(() => {
    // ✅ Best path: use navigation state
    const fromState = location.state?.idea;
    if (fromState?.id === id) return fromState;

    // ✅ Check hardcoded items from homepage
    const item = ITEMS.find((x) => x.id === id);
    if (item && item.tutorial) {
      return {
        id: item.id,
        tutorial: item.tutorial,
        liked: item.liked || false,
      };
    }

    // Fallback: sessionStorage (only useful if you decide to store small data later)
    try {
      const raw = sessionStorage.getItem(IDEAS_KEY);
      const ideas = raw ? JSON.parse(raw) : [];
      return ideas.find((x) => x.id === id) || null;
    } catch {
      return null;
    }
  }, [id, location.state]);

  // Sync liked state with item's liked state
  React.useEffect(() => {
    if (idea?.liked !== undefined) {
      setLiked(idea.liked);
    }
  }, [idea?.liked]);

  if (!idea) {
    return (
      <div className="p-6">
        <p className="text-sm text-zinc-700">
          Tutorial not found.
        </p>
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
      <div className="mx-auto max-w-4xl px-4 py-4">
        <Link
          to="/"
          className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
        >
          ← Back to Home
        </Link>
      </div>

      <TutorialLayout
        title={tutorialData.title}
        hero={tutorialData.hero}
        meta={tutorialData.meta}
        liked={liked}
        onToggleLike={() => setLiked((v) => !v)}
        materials={tutorialData.materials}
        steps={tutorialData.steps}
      />
    </div>
  );
}
