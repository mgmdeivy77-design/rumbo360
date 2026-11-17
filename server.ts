import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { handleAiGenerate, handleAiStatus } from "./lib/aiServer.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), geolocation=()");
    next();
  });

  app.use(express.json({ limit: "64kb" }));

  app.get("/api/ai/status", (req, res) => {
    void handleAiStatus(req, res);
  });

  app.post("/api/ai/generate", (req, res) => {
    void handleAiGenerate(req, res);
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
