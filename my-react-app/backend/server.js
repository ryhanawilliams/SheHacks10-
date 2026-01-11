import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // Vite dev server

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

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

    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
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
      return res.status(500).send(errorText);
    }

    const json = await r.json();
    let content = json?.choices?.[0]?.message?.content || "";
    console.log("AI Response content:", content);

    // Strip markdown code blocks if present
    content = content
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();
    console.log("After stripping markdown:", content);

    let parsed;
    try {
      parsed = JSON.parse(content);
      console.log("Parsed successfully:", parsed);
    } catch (e) {
      console.error("JSON parse error:", e.message);
      return res.status(200).json({ error: "Bad JSON", raw: content });
    }

    res.json(parsed);
  } catch (e) {
    res.status(500).send(e?.message || "Server error");
  }
});

app.listen(3001, () => console.log("Backend: http://localhost:3001"));
