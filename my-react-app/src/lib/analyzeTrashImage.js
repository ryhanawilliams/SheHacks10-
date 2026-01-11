const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function analyzeTrashImage(file) {
  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(errorText || `Server error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    if (error.message.includes("fetch")) {
      throw new Error("Failed to connect to server. Make sure the backend is running on port 4000.");
    }
    throw error;
  }
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
