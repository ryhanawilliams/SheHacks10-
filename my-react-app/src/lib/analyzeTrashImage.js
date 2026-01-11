const BACKEND = "http://localhost:3001";

export async function analyzeTrashImage(file) {
  const fd = new FormData();
  fd.append("file", file);

  const r = await fetch(`${BACKEND}/analyze`, {
    method: "POST",
    body: fd,
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(txt || "Analyze failed");
  }

  const data = await r.json();
  if (data?.error) throw new Error(data.error);
  return data;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
