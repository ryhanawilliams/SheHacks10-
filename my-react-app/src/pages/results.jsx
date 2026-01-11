import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Results() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("trash_analysis");
    const img = sessionStorage.getItem("trash_preview");
    console.log("Raw analysis from sessionStorage:", raw);
    if (raw) {
      const parsed = JSON.parse(raw);
      console.log("Parsed analysis:", parsed);
      setAnalysis(parsed);
    }
    if (img) setPreview(img);
  }, []);

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

  const confidence = (analysis.confidence ?? 0) * 100;
  const isLowConfidence = confidence < 80;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          className="mb-4 rounded-xl bg-black text-white px-4 py-2 hover:bg-zinc-800"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <h1 className="text-2xl font-bold mb-4">
          {isLowConfidence
            ? "Image Cannot Be Recognized"
            : "We identified your item"}
        </h1>

        {/* Image and Results side by side */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Section */}
          {preview ? (
            <div className="flex-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <img
                src={preview}
                alt="Uploaded"
                className="w-full h-full object-cover max-h-[500px]"
              />
            </div>
          ) : null}

          {/* Results Section */}
          <div className="flex-1">
            {isLowConfidence ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">❓</div>
                  <h2 className="text-xl font-semibold mb-2">
                    Cannot Recognize Image
                  </h2>
                  <p className="text-zinc-600 mb-4">
                    The image could not be identified with sufficient
                    confidence.
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
                <div className="text-lg font-semibold">
                  {analysis.item_name || "N/A"}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-zinc-500">Category</div>
                    <div className="font-medium">
                      {analysis.category || "N/A"}
                    </div>
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
                  <div className="mt-3 text-sm text-zinc-600">
                    {analysis.notes}
                  </div>
                ) : null}

                {/* DEBUG: Show raw data */}
                <details className="mt-4">
                  <summary className="text-xs text-zinc-400 cursor-pointer">
                    Debug: Show raw data
                  </summary>
                  <pre className="mt-2 text-xs bg-zinc-100 p-2 rounded overflow-auto">
                    {JSON.stringify(analysis, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>

        {/* Generate Button - only show if confidence is high enough */}
        {!isLowConfidence && (
          <button
            className="mt-6 w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            onClick={() => alert("Next: generate upcycling ideas + images")}
          >
            Generate upcycling ideas
          </button>
        )}
      </div>
    </div>
  );
}
