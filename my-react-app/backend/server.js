import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "15mb" })); // IMPORTANT for JSON request bodies

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function stripJsonFence(s = "") {
  return s
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();
}

async function openRouter(body) {
  const r = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "Hackathon Upcycler",
    },
    body: JSON.stringify(body),
  });

  const text = await r.text();
  if (!r.ok) {
    throw new Error(text || `OpenRouter error ${r.status}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`OpenRouter returned non-JSON:\n${text.slice(0, 200)}`);
  }
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

// -------------------- /analyze --------------------
app.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("Missing file");

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
    } catch {
      return res.status(200).json({ error: "Bad JSON", raw: content });
    }
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

// -------------------- /generate-idea (NEW) --------------------
app.post("/generate-idea", async (req, res) => {
  try {
    const {
      analysis,
      trashImageDataUrl, // currently optional (you can use it later to ground ideas)
      previousTitles = [],
    } = req.body || {};

    if (!analysis?.item_name) {
      return res.status(400).json({ error: "Missing analysis.item_name" });
    }

    const avoid =
      Array.isArray(previousTitles) && previousTitles.length
        ? `Avoid repeating these titles: ${previousTitles
            .slice(0, 10)
            .map((t) => `"${t}"`)
            .join(", ")}.`
        : "";

    // 1) Generate ONE idea + tutorial JSON (text model)
    const ideaPrompt = `
Generate ONE upcycling idea for: ${analysis.item_name}
Category: ${analysis.category || "Unknown"}
Materials: ${(analysis.materials || []).join(", ") || "Unknown"}
Notes: ${analysis.notes || "None"}

${avoid}

Return STRICT JSON only:
{
  "title": string,
  "image_prompt": string,
  "materials_sections": [
    { "title": string, "bullets": string[] }
  ],
  "steps": [
    { "title": string, "intro": string, "bullets": string[] }
  ],
  "meta": { "readTime": string }
}

Guidelines:
- Beginner friendly and realistic.
- 4–6 steps.
- image_prompt should describe a clean product photo of the FINAL upcycled result.
`.trim();

    const ideaJson = await openRouter({
      model: "google/gemini-2.5-pro",
      temperature: 0.7,
      messages: [{ role: "user", content: ideaPrompt }],
    });

    let ideaContent = ideaJson?.choices?.[0]?.message?.content || "";
    ideaContent = stripJsonFence(ideaContent);

    let idea;
    try {
      idea = JSON.parse(ideaContent);
    } catch {
      return res.status(200).json({ error: "Bad idea JSON", raw: ideaContent });
    }

    // 2) Generate image with Nano Banana Pro (Gemini 3 Pro Image Preview)
    const imagePrompt =
      idea.image_prompt ||
      `A clean product photo of a finished upcycled craft made from ${analysis.item_name}. Neutral background, good lighting.`;

    const imgJson = await openRouter({
      model: "google/gemini-3-pro-image-preview", // ✅ Nano Banana Pro
      modalities: ["image", "text"], // ✅ required for image output
      temperature: 0.7,
      messages: [{ role: "user", content: imagePrompt }],
    });

    const imageDataUrl =
      imgJson?.choices?.[0]?.message?.images?.[0]?.image_url?.url || "";

    const id = makeId();

    // Package into the shape your TutorialLayout can use
    const tutorial = {
      title: idea.title,
      hero: { src: imageDataUrl, alt: idea.title },
      meta: {
        badgeLeft: "AI Generated Tutorial",
        readTime: idea?.meta?.readTime || "5-minute craft",
      },
      materials: {
        heading: "Preparation & Materials",
        sections: (idea.materials_sections || []).map((s) => ({
          title: s.title,
          bullets: s.bullets || [],
        })),
        image: { src: imageDataUrl, alt: "Finished result" },
      },
      steps: (idea.steps || []).map((s) => ({
        title: s.title,
        intro: s.intro,
        bullets: s.bullets || [],
      })),
    };

    return res.json({
      id,
      title: idea.title,
      imageDataUrl,
      tutorial,
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.listen(3001, () => console.log("Backend: http://localhost:3001"));
