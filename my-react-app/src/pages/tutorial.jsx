// tutorial.jsx
import React, { useMemo, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import TutorialLayout from "../layouts/tutorial";

const IDEAS_KEY = "upcycling_ideas";

export default function TutorialPage() {
  const { id } = useParams();
  const location = useLocation();
  const [liked, setLiked] = useState(false);

  const idea = useMemo(() => {
    // ✅ Best path: use navigation state
    const fromState = location.state?.idea;
    if (fromState?.id === id) return fromState;

    // Fallback: sessionStorage (only useful if you decide to store small data later)
    try {
      const raw = sessionStorage.getItem(IDEAS_KEY);
      const ideas = raw ? JSON.parse(raw) : [];
      return ideas.find((x) => x.id === id) || null;
    } catch {
      return null;
    }
  }, [id, location.state]);

  if (!idea) {
    return (
      <div className="p-6">
        <p className="text-sm text-zinc-700">
          Tutorial not found. (If you refreshed the page, this is expected.)
        </p>
        <Link className="text-sm font-semibold text-zinc-900 underline" to="/results">
          Back to Results
        </Link>
      </div>
    );
  }

  const tutorialData = idea.tutorial;

  if (!tutorialData) {
    return (
      <div className="p-6">
        <p className="text-sm text-zinc-700">
          Tutorial data is missing or malformed. Please try generating a new idea.
        </p>
        <Link className="text-sm font-semibold text-zinc-900 underline" to="/results">
          Back to Results
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-4">
        <Link
          to="/results"
          className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
        >
          ← Back
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
