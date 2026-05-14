import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer } from "./index";

const app = createServer();
const port = process.env.PORT || 3000;

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct frontend build folder
const distPath = path.join(__dirname, "../dist/spa");

// Serve static frontend files
app.use(express.static(distPath));

// Health route
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// React Router SPA fallback
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT");
  process.exit(0);
});