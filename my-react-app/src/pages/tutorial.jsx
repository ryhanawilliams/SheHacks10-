// TutorialPage.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ITEMS } from "../data/items";
import TutorialLayout from "../layouts/tutorial";

export default function TutorialPage() {
  const { id } = useParams();
  const item = ITEMS.find((x) => x.id === id);
  const [liked, setLiked] = useState(false);

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

  // Sample tutorial data structure
  const tutorialData = {
    title: item.title,
    liked: liked,
    hero: { src: item.src, alt: item.title },
    meta: {
      badgeLeft: "AI Generated Tutorial",
      readTime: "5-minute craft",
    },
    materials: {
      heading: "Preparation & Materials",
      sections: [
        {
          title: "Getting Started",
          body: "Before you begin, gather all your materials and set up a clean workspace. This project is perfect for upcycling and sustainability!",
        },
        {
          title: "Materials Needed",
          bullets: [
            "Your recycled item or fabric scraps",
            "Scissors or cutting tools",
            "Glue or needle and thread",
            "Decorative elements (optional)",
            "Measuring tape or ruler",
          ],
        },
      ],
      image: { src: item.src, alt: "Materials setup" },
    },
    steps: [
      {
        title: "Prepare Your Materials",
        intro:
          "Start by cleaning and preparing all your materials for the project.",
        bullets: [
          "Clean the item thoroughly",
          "Measure and mark cutting lines",
          "Gather all tools within reach",
        ],
        notes: ["Take your time with measurements for best results"],
        // No image for odd step (Step 1)
      },
      {
        title: "Cut and Shape",
        intro: "Carefully cut your materials according to your design.",
        bullets: [
          "Follow your marked lines carefully",
          "Use sharp scissors for clean edges",
          "Save scraps for future projects",
        ],
        image: { src: item.src, alt: "Step 2" }, // Image on left
      },
      {
        title: "Assemble the Pieces",
        intro: "Bring all your pieces together to create the final form.",
        bullets: [
          "Align all pieces before gluing or sewing",
          "Apply adhesive evenly or use small stitches",
          "Press firmly and allow to dry completely",
        ],
        notes: ["If using glue, let it dry for at least 30 minutes"],
        // No image for odd step (Step 3)
      },
      {
        title: "Add Finishing Touches",
        intro: "Personalize your creation with decorative elements.",
        bullets: [
          "Add any embellishments or decorations",
          "Trim any excess material",
          "Give it a final inspection",
        ],
        image: { src: item.src, alt: "Step 4" }, // Image on right
      },
    ],
  };

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-4">
        <Link
          to="/"
          className="text-sm font-semibold text-zinc-700 hover:text-zinc-900"
        >
          ← Back
        </Link>
      </div>

      <TutorialLayout
        title={tutorialData.title}
        hero={tutorialData.hero}
        meta={tutorialData.meta}
        liked={tutorialData.liked}
        onToggleLike={() => setLiked((v) => !v)}
        materials={tutorialData.materials}
        steps={tutorialData.steps}
      />
    </div>
  );
}
