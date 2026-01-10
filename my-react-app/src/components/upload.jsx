import React, { useRef, useState } from "react";

export default function Upload({
  multiple = true,
  accept = "image/*,.pdf,.doc,.docx",
  maxFiles = 10,
  maxSizeMB = 10, // per file
  onFilesChange, // (files: File[]) => void
}) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]); // File[]
  const [error, setError] = useState("");

  const maxBytes = maxSizeMB * 1024 * 1024;

  function openPicker() {
    setError("");
    inputRef.current?.click();
  }

  function validateAndAdd(newFiles) {
    setError("");

    const incoming = Array.from(newFiles || []);
    if (incoming.length === 0) return;

    // Basic validations
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

    const next = multiple ? [...files, ...incoming] : [incoming[0]];
    setFiles(next);
    onFilesChange?.(next);

    // allow re-selecting the same file later
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

  return (
    <div className="w-full h-full flex flex-col p-6">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={accept}
        onChange={onInputChange}
      />

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      {/* File list or drop zone - takes up remaining space */}
      {files.length > 0 ? (
        <div
          className="flex-1 rounded-2xl bg-white p-6 overflow-auto hover:bg-[#F5F5F5] transition-colors duration-300"
          style={{
            borderStyle: "dashed",
            borderWidth: "2px",
            borderColor: "#E5E5E5",
          }}
        >
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
        <div
          onClick={openPicker}
          className="flex-1 rounded-2xl border-2 border-dashed border-[#CFCFCF] bg-white p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#F5F5F5] transition-colors duration-500"
        >
          {/* Upload Icon */}
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

          <div className="text-sm text-zinc-500">
            Choose a file or drag it here
          </div>
        </div>
      )}
    </div>
  );
}
