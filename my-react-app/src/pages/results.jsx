// results.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND = "http://localhost:3001";
const IDEAS_KEY = "upcycling_ideas"; // we will NOT write big base64 ideas here anymore

export default function Results() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [preview, setPreview] = useState("");
  const [ideas, setIdeas] = useState([]); // keep in memory
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("trash_analysis");
    const img = sessionStorage.getItem("trash_preview");

    console.log("📦 Loading from sessionStorage:");
    console.log("  - trash_analysis:", raw ? "✓ Found" : "✗ Missing");
    console.log("  - trash_preview:", img ? "✓ Found" : "✗ Missing");

    if (raw) setAnalysis(JSON.parse(raw));
    if (img) setPreview(img);

    // Optional: If you previously stored huge ideas, clear them so they don't cause issues.
    // sessionStorage.removeItem(IDEAS_KEY);
  }, []);

  const confidence = useMemo(() => (analysis?.confidence ?? 0) * 100, [analysis]);
  const isLowConfidence = confidence < 80;

  async function generateOneIdea() {
    if (!analysis) return;
    setIdeaError("");
    setIdeaLoading(true);

    try {
      console.log("🚀 Sending request to /generate-idea...");
      const r = await fetch(`${BACKEND}/generate-idea`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis,
          trashImageDataUrl: preview,
          previousTitles: ideas.map((x) => x.title),
        }),
      });

      const text = await r.text();
      console.log("📥 Response status:", r.status);
      console.log("📥 Response text (first 500 chars):", text.slice(0, 500));

      let data;
      try {
        data = JSON.parse(text);
        console.log("✅ Parsed JSON successfully:", data);
      } catch (parseError) {
        console.error("❌ Failed to parse JSON:", parseError);
        throw new Error(
          `Server did not return JSON.\nStatus: ${r.status}\nFirst chars:\n${text.slice(0, 120)}`
        );
      }

      if (!r.ok) throw new Error(data?.error || "Failed to generate idea");
      if (data?.error) throw new Error(data.error);

      if (!data.id || !data.title || !data.tutorial) {
        console.error("❌ Invalid data structure:", data);
        throw new Error("Invalid response structure from server");
      }

      console.log("✅ Adding idea to list:", data.id, data.title);
      setIdeas((prev) => [data, ...prev]);
    } catch (e) {
      console.error("❌ Error in generateOneIdea:", e);
      setIdeaError(e?.message || "Failed to generate idea");
    } finally {
      setIdeaLoading(false);
    }
  }

  if (!analysis) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Results</h1>
        <p className="text-zinc-600 mt-2">
          No analysis found. Upload an image and press Continue.
        </p>
        <button
          className="mt-4 rounded-xl bg-black text-white px-4 py-2"
          onClick={() => navigate("/")}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <button
          className="mb-4 rounded-xl bg-black text-white px-4 py-2 hover:bg-zinc-800"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <h1 className="text-2xl font-bold mb-4">
          {isLowConfidence ? "Image Cannot Be Recognized" : "We identified your item"}
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {preview ? (
            <div className="flex-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <img
                src={preview}
                alt="Uploaded"
                className="w-full h-full object-cover max-h-[500px]"
              />
            </div>
          ) : null}

          <div className="flex-1">
            {isLowConfidence ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">❓</div>
                  <h2 className="text-xl font-semibold mb-2">Cannot Recognize Image</h2>
                  <p className="text-zinc-600 mb-4">
                    The image could not be identified with sufficient confidence.
                  </p>
                  <p className="text-zinc-600 mb-4">
                    Please try again with a more clear image.
                  </p>
                  <div className="mt-4 text-sm text-zinc-500">
                    Confidence: {Math.round(confidence)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="text-sm text-zinc-500">Item</div>
                <div className="text-lg font-semibold">{analysis.item_name || "N/A"}</div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-zinc-500">Category</div>
                    <div className="font-medium">{analysis.category || "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Confidence</div>
                    <div className="font-medium">{Math.round(confidence)}%</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-sm text-zinc-500">Materials</div>
                  <div className="font-medium">
                    {(analysis.materials || []).join(", ") || "—"}
                  </div>
                </div>

                {analysis.notes ? (
                  <div className="mt-3 text-sm text-zinc-600">{analysis.notes}</div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {!isLowConfidence && (
          <div className="mt-6">
            {ideaError ? (
              <div className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
                {ideaError}
              </div>
            ) : null}

            <button
              className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-500"
              onClick={generateOneIdea}
              disabled={ideaLoading}
            >
              {ideaLoading ? "Generating..." : "Generate upcycling idea"}
            </button>

            {ideas.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ideas.map((idea) => (
                  <button
                    key={idea.id}
                    onClick={() => {
                      console.log("🔗 Navigating to tutorial:", idea.id);
                      // ✅ pass full idea through navigation state (no sessionStorage needed)
                      navigate(`/tutorial/${idea.id}`, { state: { idea } });
                    }}
                    className="text-left rounded-2xl border border-zinc-200 bg-white overflow-hidden hover:bg-zinc-50"
                    type="button"
                  >
                    <div className="aspect-[4/3] bg-zinc-100">
                      {idea.imageDataUrl ? (
                        <img
                          src={idea.imageDataUrl}
                          alt={idea.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            console.warn("⚠️ Image failed to load:", idea.title);
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-xs font-semibold text-zinc-500">
                          IMAGE NOT AVAILABLE
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <div className="text-sm font-semibold text-zinc-900">{idea.title}</div>
                      <div className="mt-1 text-xs text-zinc-500">Tap to view tutorial</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
