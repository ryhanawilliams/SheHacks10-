import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";

// dataURL -> File helper
async function dataUrlToFile(dataUrl, filename = "phone-photo.jpg") {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

export default function QrUploadModal({ isOpen, onClose, onFileReady }) {
  const PUBLIC_BASE =
    import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;

  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState("Creating session…");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState("");

  const pollRef = useRef(null);

  const captureUrl = useMemo(() => {
    if (!sessionId) return "";
    return `${PUBLIC_BASE}/capture?session=${sessionId}`;
  }, [PUBLIC_BASE, sessionId]);

  // 1️⃣ Create session
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    (async () => {
      try {
        setError("");
        setStatus("Creating session…");
        setSessionId(null);
        setQrDataUrl("");

        const res = await fetch("/api/sessions", { method: "POST" });
        
        if (!res.ok) {
          const errorText = await res.text().catch(() => "");
          throw new Error(`Failed to create session: ${res.status} ${errorText || res.statusText}`);
        }
        
        const data = await res.json();

        if (!data.sessionId) {
          throw new Error("Invalid response from server");
        }

        if (cancelled) return;

        setSessionId(data.sessionId);
        setStatus("Scan the QR code with your phone");
      } catch (e) {
        if (cancelled) return;
        setStatus("Couldn't create session");
        const errorMsg = e.message || "Unknown error";
        if (errorMsg.includes("fetch") || errorMsg.includes("Failed to fetch")) {
          setError("Cannot connect to server. Make sure the backend is running on port 4000.");
        } else {
          setError(errorMsg);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [isOpen]);

  // 2️⃣ Generate QR
  useEffect(() => {
    if (!isOpen || !captureUrl) return;

    (async () => {
      try {
        const url = await QRCode.toDataURL(captureUrl, {
          margin: 1,
          width: 240,
        });
        setQrDataUrl(url);
      } catch {
        setError("Failed to generate QR");
      }
    })();
  }, [isOpen, captureUrl]);

  // 3️⃣ Poll for upload
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setStatus("Session expired");
            setError("The upload session has expired. Please try again.");
            return;
          }
          return;
        }
        
        const data = await res.json();

        if (data?.latest) {
          clearInterval(pollRef.current);
          pollRef.current = null;

          setStatus("Got an upload ✅");

          const file = await dataUrlToFile(data.latest);
          onFileReady?.(file);
          onClose?.();
        }
      } catch (err) {
        // ignore polling errors, but log them
        console.error("Polling error:", err);
      }
    }, 800);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [isOpen, sessionId, onClose, onFileReady]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] grid place-items-center bg-black/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[520px] rounded-3xl bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Take a photo (phone)</h3>
          <button onClick={onClose} className="rounded-xl px-3 py-2 hover:bg-zinc-100">
            ✕
          </button>
        </div>

        <p className="mt-2 text-sm text-zinc-600">{status}</p>

        {error && (
          <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        )}

        {!sessionId ? (
          <div className="mt-4">Loading…</div>
        ) : (
          <div className="mt-4">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR code" width={240} height={240} />
            ) : (
              <div>Generating QR…</div>
            )}

            <p className="mt-3 text-xs break-all text-zinc-500">{captureUrl}</p>

            <p className="mt-2 text-xs text-zinc-500">
              Make sure your phone is on the same Wi-Fi network.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
