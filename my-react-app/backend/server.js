// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();

// ---- basics ----
app.use((req, _res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json({ limit: "20mb" })); // base64 image data URLs can be big

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ---- QR session store (in memory) ----
const sessions = new Map();
function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

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
    throw new Error(`OpenRouter returned non-JSON:\n${text.slice(0, 400)}`);
  }
}

function pickImageDataUrl(orJson) {
  // Normalized OpenRouter image output:
  // choices[0].message.images[0].image_url.url
  return (
    orJson?.choices?.[0]?.message?.images?.[0]?.image_url?.url ||
    orJson?.choices?.[0]?.message?.images?.[0]?.imageUrl?.url ||
    ""
  );
}

// ---------------- Prompt builders ----------------

function buildStepImagePrompt({ craftTitle, itemName, stepNumber, step, globalStyleSeed }) {
  const stepTitle = step?.title || "";
  const intro = (step?.intro || "").trim();
  const bullets = Array.isArray(step?.bullets) ? step.bullets : [];
  const notes = Array.isArray(step?.notes) ? step.notes : [];

  const bulletsBlock = bullets.length
    ? bullets.map((b, i) => `- ${i + 1}. ${b}`).join("\n")
    : `- Depict the key action implied by the title/intro in a beginner-friendly way.`;

  const notesBlock = notes.length
    ? notes.map((n) => `- ${n}`).join("\n")
    : `- Keep tools minimal and only what is necessary for the action.`;

  return `
Create ONE photorealistic instructional step image for an upcycling tutorial.

Overall craft (final project): "${craftTitle}"
Primary starting item (must visually match): "${itemName}"

You are illustrating Step ${stepNumber}. The image MUST show the in-progress state of this step (not a finished glamour shot unless the step is explicitly finishing).

Step ${stepNumber} title: "${stepTitle}"
Step ${stepNumber} description: "${intro}"

Exact actions to visually depict (must match these instructions precisely):
${bulletsBlock}

Safety + realism:
- Beginner-friendly tools only (scissors, craft knife + cutting mat, glue, tape, ruler, marker, small brush, sandpaper).
- No dangerous/industrial tools, no fire/flames, no harsh chemicals.
- If cutting is implied: show a cutting mat and safe hand placement.

Composition + clarity:
- Photorealistic, natural indoor daylight.
- Clean neutral workspace: light wood or white tabletop.
- Close-up / medium close-up focusing on hands + item + relevant tools.
- Hands in frame demonstrating the action; no face visible.
- No text, no labels, no watermarks, no logos, no UI overlays.
- Single image, sharp focus on the key action, minimal clutter.

Consistency across all step images:
- Maintain a consistent camera angle and tabletop style across steps.
- Keep the object recognizable and consistent in shape/color.
- Keep lighting consistent.
${globalStyleSeed ? `- Global style seed: ${globalStyleSeed}` : ""}

Extra constraints / tips (include if relevant):
${notesBlock}

Return only the generated image.
`.trim();
}

function buildMaterialsImagePrompt({ itemName, materialHints = [], globalStyleSeed }) {
  const cleanHints = [...new Set(materialHints.map((s) => String(s).trim()).filter(Boolean))].slice(
    0,
    10
  );

  const hintLine = cleanHints.length
    ? `Include these materials/tools if they make sense: ${cleanHints.join(", ")}.`
    : `Include a few basic craft tools: scissors, ruler, glue, tape.`;

  return `
Create ONE photorealistic "materials flat-lay" image for an upcycling tutorial.

Main item (must be central and clearly visible): "${itemName}"

Scene:
- Overhead flat-lay on a clean neutral white or light wood tabletop.
- The main item is placed in the center.
- Surround it neatly with the primary materials and beginner craft tools needed (organized, minimal clutter).
- No hands necessary.

Requirements:
- Photorealistic, natural indoor daylight.
- No text, no labels, no watermarks, no logos, no UI overlays.
- Crisp focus, clean composition, realistic textures.

Consistency:
- Match the same tabletop + lighting style used for the step images.
${globalStyleSeed ? `- Global style seed: ${globalStyleSeed}` : ""}

${hintLine}

Return only the generated image.
`.trim();
}

// -------------------- health + QR session routes --------------------
const PORT = Number(process.env.PORT || 4000);

app.get("/health", (_req, res) => {
  res.json({ ok: true, port: PORT, time: Date.now() });
});

app.post("/api/sessions", (_req, res) => {
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
      return res.status(400).json({ error: "Upload failed", details: err.message });
    }

    const sessionId = req.query.session;
    console.log("UPLOAD HIT:", {
      session: sessionId,
      hasFile: !!req.file,
      size: req.file?.size,
      mime: req.file?.mimetype,
    });

    if (!sessionId) return res.status(400).json({ error: "Missing session query" });

    const s = sessions.get(sessionId);
    if (!s) return res.status(404).json({ error: "Session not found" });

    if (!req.file)
      return res.status(400).json({ error: "Missing file (field name must be 'file')" });

    const mime = req.file.mimetype || "image/jpeg";
    const base64 = req.file.buffer.toString("base64");
    s.latest = `data:${mime};base64,${base64}`;

    return res.json({ ok: true });
  });
});

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
      return res.status(500).json({ error: "Failed to parse analysis response", raw: content });
    }
  } catch (e) {
    console.error("Analyze endpoint error:", e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

// -------------------- /generate-idea --------------------
app.post("/generate-idea", async (req, res) => {
  try {
    const { analysis, previousTitles, trashImageDataUrl } = req.body || {};
    if (!analysis?.item_name) {
      return res.status(400).json({ error: "Missing analysis.item_name" });
    }

    const prev = Array.isArray(previousTitles) ? previousTitles : [];
    const avoidLine = prev.length
      ? `Avoid repeating these titles: ${prev.map((t) => `"${t}"`).join(", ")}.`
      : "";

    // A tiny seed to encourage consistent style across materials + steps
    const globalStyleSeed = `same tabletop + lighting; consistent camera angle; clean neutral background; realistic craft photography`;

    // 1) Generate tutorial JSON + image_prompt (text model)
    const prompt = `
You are generating ONE upcycling tutorial for a hackathon app.

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

    // 2) Generate HERO image (Nano Banana / Gemini 3 Pro Image Preview)
    const heroImgJson = await openRouter({
      model: "google/gemini-3-pro-image-preview",
      modalities: ["image", "text"],
      temperature: 0.7,
      messages: [{ role: "user", content: imagePrompt }],
    });
    const heroImageDataUrl = pickImageDataUrl(heroImgJson);

    // 3) Generate MATERIALS/PREP image (flat-lay of main materials/tools)
    const tutorialMaterialBullets =
      idea?.tutorial?.materials?.sections?.flatMap((s) => s?.bullets || []) || [];

    const materialHints = [
      analysis.item_name,
      ...(Array.isArray(analysis.materials) ? analysis.materials : []),
      ...tutorialMaterialBullets,
    ];

    let materialsImageDataUrl = "";
    try {
      const materialsPrompt = buildMaterialsImagePrompt({
        itemName: analysis.item_name,
        materialHints,
        globalStyleSeed,
      });

      const materialsImgJson = await openRouter({
        model: "google/gemini-3-pro-image-preview",
        modalities: ["image", "text"],
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: trashImageDataUrl
              ? [
                  { type: "text", text: materialsPrompt },
                  // Reference the uploaded item so the main item matches
                  { type: "image_url", image_url: { url: trashImageDataUrl } },
                ]
              : materialsPrompt,
          },
        ],
      });

      materialsImageDataUrl = pickImageDataUrl(materialsImgJson) || "";
    } catch (e) {
      console.error("Materials image generation failed:", e?.message || String(e));
    }

    // 4) Generate STEP images for EVERY step
    const baseSteps = Array.isArray(idea.tutorial.steps) ? idea.tutorial.steps : [];
    const stepImagesByIndex = new Map();

    for (let idx = 0; idx < baseSteps.length; idx++) {
      const stepNumber = idx + 1;
      const step = baseSteps[idx];

      const stepPrompt = buildStepImagePrompt({
        craftTitle: title,
        itemName: analysis.item_name,
        stepNumber,
        step,
        globalStyleSeed,
      });

      try {
        const stepImgJson = await openRouter({
          model: "google/gemini-3-pro-image-preview",
          modalities: ["image", "text"],
          temperature: 0.7,
          messages: [
            {
              role: "user",
              content: trashImageDataUrl
                ? [
                    { type: "text", text: stepPrompt },
                    // Reference the uploaded item so the object stays consistent across steps
                    { type: "image_url", image_url: { url: trashImageDataUrl } },
                  ]
                : stepPrompt,
            },
          ],
        });

        const stepImageDataUrl = pickImageDataUrl(stepImgJson);
        if (stepImageDataUrl) stepImagesByIndex.set(idx, stepImageDataUrl);
      } catch (e) {
        console.error("Step image generation failed:", {
          stepNumber,
          err: e?.message || String(e),
        });
      }
    }

    // 5) Build final tutorial payload
    const id = makeId();

    const tutorial = {
      ...idea.tutorial,
      title,
      hero: { src: heroImageDataUrl || "", alt: idea.tutorial?.hero?.alt || title },
      meta: {
        ...(idea.tutorial?.meta || {}),
        badgeLeft: "AI Generated Tutorial",
        readTime: idea.tutorial?.meta?.readTime || "5-minute craft",
      },
      materials: {
        ...(idea.tutorial?.materials || {}),
        // IMPORTANT: first image beside materials/prep must be main materials used (flat-lay)
        image: {
          src: materialsImageDataUrl || trashImageDataUrl || heroImageDataUrl || "",
          alt: `Main materials for: ${analysis.item_name}`,
        },
      },
      // IMPORTANT: every step must have an image now
      steps: baseSteps.map((s, idx) => {
        const stepNumber = idx + 1;
        return {
          ...s,
          image: {
            src: stepImagesByIndex.get(idx) || heroImageDataUrl || "",
            alt: `Step ${stepNumber}: ${s.title}`,
          },
        };
      }),
    };

    return res.json({
      id,
      title,
      imageDataUrl: heroImageDataUrl || "",
      tutorial,
    });
  } catch (e) {
    console.error("Generate-idea error:", e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
});

// Error handling middleware (keep at the end)
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ---- start server ----
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend: http://localhost:${PORT}`);
  console.log(`Listening on 0.0.0.0:${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at:", promise, "reason:", reason);
});
