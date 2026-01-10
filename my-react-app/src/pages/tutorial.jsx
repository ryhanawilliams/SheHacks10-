// TutorialPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { ITEMS } from "../data/items";

export default function TutorialPage() {
  const { id } = useParams();
  const item = ITEMS.find((x) => x.id === id);

  if (!item) {
    return (
      <div className="p-6">
        <p className="text-sm text-zinc-700">Not found.</p>
        <Link className="text-sm font-semibold text-zinc-900 underline" to="/">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Link
        to="/"
        className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
      >
        ← Back
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">
        {item.title}
      </h1>

      <div className="mt-4 overflow-hidden rounded-2xl bg-zinc-200">
        <img src={item.src} alt={item.title} className="w-full object-cover" />
      </div>
    </div>
  );
}
