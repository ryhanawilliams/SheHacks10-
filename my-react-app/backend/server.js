import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();

app.use((req, _res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json({ limit: "15mb" })); // ✅ needed for POST /generate-idea

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ---- QR session store (in memory) ----
const sessions = new Map();
function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

app.get("/health", (req, res) => {
  res.json({ ok: true, port: 4000, time: Date.now() });
});

app.post("/api/sessions", (req, res) => {
  const sessionId = makeId();
  sessions.set(sessionId, { latest: null });
  console.log("SESSION CREATED:", sessionId);
  res.json({ sessionId });
});

app.get("/api/sessions/:sessionId", (req, res) => {
  const s = sessions.get(req.params.sessionId);
  if (!s) return res.status(404).json({ error: "Session not found" });
  res.json({ latest: s.latest });
});

app.post("/api/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("MULTER ERROR:", err);
      return res
        .status(400)
        .json({ error: "Upload failed", details: err.message });
    }

    const sessionId = req.query.session;
    console.log("UPLOAD HIT:", {
      session: sessionId,
      hasFile: !!req.file,
      size: req.file?.size,
      mime: req.file?.mimetype,
    });

    if (!sessionId)
      return res.status(400).json({ error: "Missing session query" });

    const s = sessions.get(sessionId);
    if (!s) return res.status(404).json({ error: "Session not found" });

    if (!req.file)
      return res
        .status(400)
        .json({ error: "Missing file (field name must be 'file')" });

    const mime = req.file.mimetype || "image/jpeg";
    const base64 = req.file.buffer.toString("base64");
    s.latest = `data:${mime};base64,${base64}`;

    return res.json({ ok: true });
  });
});

// ---------------- OpenRouter helpers ----------------
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function stripJsonFence(s = "") {
  return s.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
}

async function openRouter(body) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const r = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.PUBLIC_BASE_URL || "http://localhost:5173",
      "X-Title": "Hackathon Upcycler",
    },
    body: JSON.stringify(body),
  });

  const text = await r.text();
  if (!r.ok) throw new Error(text || `OpenRouter error ${r.status}`);

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`OpenRouter returned non-JSON:\n${text.slice(0, 200)}`);
  }
}

function pickImageDataUrl(orJson) {
  // OpenRouter image generation: message.images[0].image_url.url is the normalized form
  const url =
    orJson?.choices?.[0]?.message?.images?.[0]?.image_url?.url ||
    orJson?.choices?.[0]?.message?.images?.[0]?.imageUrl?.url ||
    "";
  return url;
}

// -------------------- /analyze --------------------
app.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Missing file" });

    const mime = req.file.mimetype || "image/jpeg";
    const base64 = req.file.buffer.toString("base64");
    const dataUrl = `data:${mime};base64,${base64}`;

    const prompt = `
Return STRICT JSON only.
Schema:
{
  "item_name": string,
  "category": string,
  "materials": string[],
  "confidence": number,
  "notes": string
}
Identify what this trash item is for upcycling.
`.trim();

    const json = await openRouter({
      model: "openai/gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    });

    let content = json?.choices?.[0]?.message?.content || "";
    content = stripJsonFence(content);

    try {
      return res.json(JSON.parse(content));
    } catch (e) {
      console.error("JSON parse error:", e.message, "Raw content:", content);
      return res
        .status(500)
        .json({ error: "Failed to parse analysis response", raw: content });
    }
  } catch (e) {
    console.error("Analyze endpoint error:", e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

// -------------------- /generate-idea --------------------
// Uses:
// - Tutorial text: google/gemini-3-flash-preview :contentReference[oaicite:5]{index=5}
// - Image: google/gemini-3-pro-image-preview (Nano Banana Pro) :contentReference[oaicite:6]{index=6}
app.post("/generate-idea", async (req, res) => {
  try {
    const { analysis, previousTitles } = req.body || {};
    if (!analysis?.item_name) {
      return res.status(400).json({ error: "Missing analysis.item_name" });
    }

    const prev = Array.isArray(previousTitles) ? previousTitles : [];
    const avoidLine = prev.length
      ? `Avoid repeating these titles: ${prev.map((t) => `"${t}"`).join(", ")}.`
      : "";

    // 1) Generate tutorial JSON + an image prompt (Gemini 3 Flash Preview)
    const prompt = `
You are generating ONE upcycling idea for a hackathon app.

TRASH ITEM (from image analysis):
- item_name: ${analysis.item_name}
- category: ${analysis.category || "Unknown"}
- materials: ${(analysis.materials || []).join(", ") || "Unknown"}
- notes: ${analysis.notes || "None"}

Rules:
- beginner-friendly, safe, realistic
- do NOT mention brand names
- output STRICT JSON only (no markdown)
${avoidLine}

Return JSON with this schema:
{
  "title": string,
  "image_prompt": string,
  "tutorial": {
    "title": string,
    "hero": { "alt": string },
    "meta": { "badgeLeft": string, "readTime": string },
    "materials": {
      "heading": string,
      "sections": [
        { "title": string, "bullets": string[] }
      ]
    },
    "steps": [
      { "title": string, "intro": string, "bullets": string[], "notes": string[] }
    ]
  }
}

Notes:
- meta.badgeLeft should be "AI Generated Tutorial"
- steps should be 4–6 items
- image_prompt should describe a clean product-style photo of the finished craft on a neutral background
`.trim();

    const ideaJson = await openRouter({
      model: "google/gemini-3-flash-preview",
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    const ideaText = stripJsonFence(ideaJson?.choices?.[0]?.message?.content || "");
    let idea;
    try {
      idea = JSON.parse(ideaText);
    } catch {
      return res.status(200).json({
        error: "Bad JSON from tutorial model",
        raw: ideaText.slice(0, 2000),
      });
    }

    const title = idea?.title || idea?.tutorial?.title;
    const imagePrompt =
      idea?.image_prompt ||
      `A realistic product photo of a finished upcycled craft made from ${analysis.item_name}, neutral background, good lighting, no text.`;

    if (!title || !idea?.tutorial) {
      return res.status(200).json({
        error: "Tutorial model returned invalid structure",
        raw: idea,
      });
    }

    // 2) Generate the image (Nano Banana Pro / Gemini 3 Pro Image Preview)
    // IMPORTANT: modalities must include "image" so OpenRouter returns an image data URL :contentReference[oaicite:7]{index=7}
    const imgJson = await openRouter({
      model: "google/gemini-3-pro-image-preview",
      modalities: ["image", "text"],
      temperature: 0.7,
      messages: [{ role: "user", content: imagePrompt }],
    });

    const imageDataUrl = pickImageDataUrl(imgJson);

    // 3) Fill TutorialLayout-required image fields using the generated image
    const id = makeId();
    const tutorial = {
      ...idea.tutorial,
      title: title,
      hero: { src: imageDataUrl || "", alt: idea.tutorial?.hero?.alt || title },
      materials: {
        ...idea.tutorial.materials,
        image: { src: imageDataUrl || "", alt: "Finished craft" },
      },
      steps: (idea.tutorial.steps || []).map((s, idx) => ({
        ...s,
        // Optional: show the same image on even steps so the alternating layout displays images
        image: idx % 2 === 1 ? { src: imageDataUrl || "", alt: s.title } : undefined,
      })),
    };

    return res.json({
      id,
      title,
      imageDataUrl: imageDataUrl || "",
      tutorial,
    });
  } catch (e) {
    console.error("Generate-idea error:", e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

// Error handling middleware (keep at the end)
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(4000, "0.0.0.0", () => console.log("Backend on 0.0.0.0:4000"));
