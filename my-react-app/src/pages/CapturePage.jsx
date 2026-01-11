import { useMemo, useState } from "react";

export default function CapturePage() {
  const [status, setStatus] = useState("");

  const sessionId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("session");
  }, []);

  async function handleChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!sessionId) {
      setStatus("Missing session id.");
      return;
    }

    setStatus("Uploading…");

    const form = new FormData();
    form.append("file", file); // MUST be "file"

    const uploadUrl = `/api/upload?session=${encodeURIComponent(sessionId)}`;
    console.log("UPLOAD URL =", uploadUrl);

    try {
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: form,
      });

      const text = await res.text().catch(() => "");
      setStatus(
        res.ok
          ? "Uploaded ✅ You can go back to your desktop."
          : `Upload failed ❌ (${res.status}) ${text.slice(0, 120)}`
      );
    } catch (err) {
      console.error("UPLOAD fetch error:", err);
      const errorMsg = err?.message || String(err);
      if (errorMsg.includes("fetch") || errorMsg.includes("Failed to fetch")) {
        setStatus("Failed to connect ❌ Make sure the backend server is running on port 4000.");
      } else {
        setStatus(`Failed to fetch ❌ ${errorMsg}`);
      }
    }
  }

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-lg font-semibold">Take a photo</h2>
      <p className="text-sm text-zinc-600 mt-1">Session: {sessionId || "(none)"}</p>

      <input
        className="mt-6"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
      />

      <p className="mt-4 text-sm">{status}</p>
    </div>
  );
}
