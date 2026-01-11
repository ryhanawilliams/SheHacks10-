import React, { useMemo, useRef, useState } from "react";

export default function Upload({
  multiple = false, // for your flow: single image is simpler
  accept = "image/*",
  maxFiles = 1,
  maxSizeMB = 10,
  onFilesChange,
  onTakePhoto, // (files: File[]) => void
  onContinue, // async (file: File) => void
}) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]); // File[]
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxBytes = maxSizeMB * 1024 * 1024;

  const firstFile = files[0] || null;

  const previewUrl = useMemo(() => {
    if (!firstFile) return "";
    return URL.createObjectURL(firstFile);
  }, [firstFile]);

  function openPicker() {
    setError("");
    inputRef.current?.click();
  }

  function validateAndAdd(newFiles) {
    setError("");

    const incoming = Array.from(newFiles || []);
    if (incoming.length === 0) return;

    const tooMany =
      (multiple ? files.length + incoming.length : incoming.length) > maxFiles;
    if (tooMany) {
      setError(`You can upload up to ${maxFiles} file(s).`);
      return;
    }

    const oversize = incoming.find((f) => f.size > maxBytes);
    if (oversize) {
      setError(`"${oversize.name}" is larger than ${maxSizeMB}MB.`);
      return;
    }

    // If image-only flow, ensure it is an image
    const nonImage = incoming.find((f) => !f.type?.startsWith("image/"));
    if (nonImage) {
      setError(`"${nonImage.name}" is not an image. Please upload a photo.`);
      return;
    }

    const next = multiple ? [...files, ...incoming] : [incoming[0]];
    setFiles(next);
    onFilesChange?.(next);

    if (inputRef.current) inputRef.current.value = "";
  }

  function onInputChange(e) {
    validateAndAdd(e.target.files);
  }

  function removeAt(index) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onFilesChange?.(next);
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }

  async function handleContinue() {
    if (!firstFile) return;
    setError("");
    setIsSubmitting(true);
    try {
      await onContinue?.(firstFile);
    } catch (err) {
      const errorMsg =
        err?.message || "Something went wrong analyzing the image.";
      if (errorMsg.includes("fetch") || errorMsg.includes("Failed to fetch")) {
        setError(
          "Cannot connect to server. Make sure the backend is running on port 4000."
        );
      } else {
        setError(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-[94%] h-[80%] flex flex-col py-6 my-4 gap-4">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={accept}
        onChange={onInputChange}
      />

      {error ? (
        <div className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      {files.length > 0 ? (
        <div
          className="flex-1 rounded-2xl bg-white p-4 overflow-auto hover:bg-[#F5F5F5] transition-colors duration-300"
          style={{
            borderStyle: "dashed",
            borderWidth: "2px",
            borderColor: "#E5E5E5",
          }}
        >
          {previewUrl ? (
            <div className="mb-4 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-64 object-cover"
              />
            </div>
          ) : null}

          <ul className="space-y-2">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${f.size}-${i}`}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-zinc-900">
                    {f.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {formatBytes(f.size)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="ml-3 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex-1 rounded-2xl border-2 border-dashed border-[#CFCFCF] bg-white p-6 flex flex-col items-center justify-center text-center hover:bg-[#F5F5F5] transition-colors duration-500">
          <svg
            className="w-12 h-12 text-zinc-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <div className="text-sm text-zinc-500 mb-4">
            Choose a file or take a photo
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={openPicker}
              className="rounded-2xl px-4 py-2 text-sm font-semibold bg-black text-white hover:bg-zinc-800"
            >
              Choose file
            </button>

            <button
              type="button"
              onClick={() => onTakePhoto?.()}
              className="rounded-2xl px-4 py-2 text-sm font-semibold bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            >
              Take a photo
            </button>
          </div>
        </div>
      )}

      {/* Continue button */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={!firstFile || isSubmitting}
        className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition
          ${
            !firstFile || isSubmitting
              ? "bg-zinc-200 text-zinc-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-zinc-800"
          }`}
      >
        {isSubmitting ? "Analyzing..." : "Continue"}
      </button>
    </div>
  );
}
