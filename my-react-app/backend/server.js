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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, port: 4000, time: Date.now() });
});

// ---- QR session store (in memory) ----
const sessions = new Map();

function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

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

    if (!req.file) return res.status(400).json({ error: "Missing file (field name must be 'file')" });

    const mime = req.file.mimetype || "image/jpeg";
    const base64 = req.file.buffer.toString("base64");
    s.latest = `data:${mime};base64,${base64}`;

    return res.json({ ok: true });
  });
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
    if (!req.file) {
      return res.status(400).json({ error: "Missing file" });
    }

    const mime = req.file.mimetype || "image/jpeg";
    const base64 = req.file.buffer.toString("base64");
    const dataUrl = `data:${mime};base64,${base64}`;

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is not set");
      return res.status(500).json({ error: "Server configuration error: API key missing" });
    }

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

    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.PUBLIC_BASE_URL || "http://localhost:5173",
        "X-Title": "Hackathon Upcycler",
      },
      body: JSON.stringify({
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
      }),
    });

    if (!r.ok) {
      const errorText = await r.text();
      console.error("OpenRouter API error:", r.status, errorText);
      return res.status(500).json({ error: "Failed to analyze image", details: errorText });
    }
  } catch (e) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

    const json = await r.json();
    let content = json?.choices?.[0]?.message?.content || "";
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

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

app.listen(4000, "0.0.0.0", () => console.log("Backend on 0.0.0.0:4000"));
