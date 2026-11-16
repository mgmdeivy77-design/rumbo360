import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL = "gemini-4-hydrogen";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function parseJsonResponse(raw: string): unknown {
  const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("La respuesta de la IA no tuvo formato JSON válido.");
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/ai/status", (_req, res) => {
    res.json({
      available: Boolean(process.env.GEMINI_API_KEY),
      model: MODEL,
    });
  });

  app.post("/api/ai/generate", async (req, res) => {
    const ai = getClient();
    if (!ai) {
      res.status(503).json({
        error: "GEMINI_API_KEY_MISSING",
        message: "La IA no está configurada en el entorno del servidor.",
      });
      return;
    }

    const { prompt, json } = req.body ?? {};
    if (typeof prompt !== "string" || !prompt.trim()) {
      res.status(400).json({ error: "INVALID_PROMPT", message: "Prompt vacío." });
      return;
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          ...(json ? { responseMimeType: "application/json" } : {}),
        },
      });

      const text = (response.text ?? "").trim();
      if (!text) {
        res.status(502).json({
          error: "EMPTY_RESPONSE",
          message: "Gemini no devolvió texto.",
        });
        return;
      }

      if (json) {
        const parsed = parseJsonResponse(text);
        res.json({ text, data: parsed });
        return;
      }

      res.json({ text });
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      const status = typeof e?.status === "number" && e.status >= 400 ? e.status : 500;
      res.status(status).json({
        error: "GEMINI_ERROR",
        message: e?.message ? String(e.message).slice(0, 220) : "Error al consultar Gemini.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rumbo server listening on http://localhost:${PORT}`);
  });
}

startServer();
