// results.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import backChevron from "../assets/backchevron.png";

const BACKEND = import.meta.env.VITE_API_BASE || "http://localhost:4000";

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

    if (raw) setAnalysis(JSON.parse(raw));
    if (img) setPreview(img);
  }, []);

  const confidence = useMemo(
    () => (analysis?.confidence ?? 0) * 100,
    [analysis]
  );
  const isLowConfidence = confidence < 80;

  async function generateOneIdea() {
    if (!analysis) return;

    setIdeaError("");
    setIdeaLoading(true);

    try {
      const r = await fetch(`${BACKEND}/generate-idea`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis,
          previousTitles: ideas.map((x) => x.title).filter(Boolean),
        }),
      });

      const text = await r.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("❌ Server did not return JSON:", text);
        throw new Error(
          `Server did not return JSON.\nStatus: ${
            r.status
          }\nFirst chars:\n${text.slice(0, 200)}`
        );
      }

      if (!r.ok) throw new Error(data?.error || "Failed to generate idea");
      if (data?.error) throw new Error(data.error);

      // Expect: { id, title, imageDataUrl, tutorial }
      if (!data.id || !data.title || !data.tutorial) {
        console.error("❌ Invalid response structure:", data);
        throw new Error("Invalid response structure from server");
      }

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
          className="mt-4 flex items-center gap-2 rounded-xl bg-white border border-zinc-200 text-black px-4 py-2 hover:bg-zinc-50 text-lg"
          onClick={() => navigate("/")}
        >
          <img src={backChevron} alt="back" className="w-3 h-4" />
          <span>Back</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <button
          className="mb-6 flex items-center gap-2 rounded-xl text-black px-4 py-2 hover:bg-zinc-50 text-lg"
          onClick={() => navigate("/")}
        >
          <img src={backChevron} alt="back" className="w-3 h-4" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold mb-6">
          {isLowConfidence
            ? "Image Cannot Be Recognized"
            : "We identified your item"}
        </h1>

        {isLowConfidence ? (
          <div className="rounded-2xl p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">❓</div>
              <h2 className="text-xl font-semibold mb-2">
                Cannot Recognize Image
              </h2>
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
          <div className="rounded-2xl w-[90%] border border-zinc-200 bg-white overflow-hidden flex flex-col md:flex-row">
            {preview && (
              <div className="w-full rounded-2xl md:w-auto md:aspect-square md:h-[500px] flex-shrink-0 p-6">
                <img
                  src={preview}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 p-8 flex ml-24 flex-col gap-4">
              <div>
                <div className="text-sm text-zinc-500">Item</div>
                <div className="text-lg font-semibold">
                  {analysis.item_name || "N/A"}
                </div>
              </div>

              <div>
                <div className="text-sm text-zinc-500">Category</div>
                <div className="font-medium">{analysis.category || "N/A"}</div>
              </div>

              <div>
                <div className="text-sm text-zinc-500">Confidence</div>
                <div className="font-medium">{Math.round(confidence)}%</div>
              </div>

              <div>
                <div className="text-sm text-zinc-500">Materials</div>
                <div className="font-medium">
                  {(analysis.materials || []).join(", ") || "—"}
                </div>
              </div>

              {analysis.notes ? (
                <div>
                  <div className="text-sm text-zinc-500">Notes</div>
                  <div className="text-sm text-zinc-600">{analysis.notes}</div>
                </div>
              ) : null}

              <div className="mt-6 pt-4 flex flex-col items-start justify-center">
                {ideaError ? (
                  <div className="mb-3 rounded-xl bg-red-50 px-3 py-3 text-xs text-red-700">
                    {ideaError}
                  </div>
                ) : null}

                <button
                  className="w-[95%] rounded-2xl bg-[#EF6589] px-4 py-4 text-md font-semibold text-white hover:opacity-90 disabled:bg-zinc-200 disabled:text-zinc-500"
                  onClick={generateOneIdea}
                  disabled={ideaLoading}
                >
                  {ideaLoading ? "Generating..." : "Generate upcycling idea"}
                </button>

                <div className="mt-3 text-center text-xs text-zinc-500">
                  Not the right item?{" "}
                  <button
                    onClick={() => navigate("/")}
                    className="underline hover:text-zinc-700"
                  >
                    Re-try identification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ideas appear below the main box */}
        {!isLowConfidence && ideas.length > 0 && (
          <div className="mt-6">
            {
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
                {ideas.map((idea) => (
                  <button
                    key={idea.id}
                    onClick={() =>
                      navigate(`/tutorial/${idea.id}`, { state: { idea } })
                    }
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
                            console.warn(
                              "⚠️ Image failed to load:",
                              idea.title
                            );
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
                      <div className="text-sm font-semibold text-zinc-900">
                        {idea.title}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        Tap to view tutorial
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
}
