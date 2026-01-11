const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export async function analyzeTrashImage(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // data:image/...;base64,...
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
