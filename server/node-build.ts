import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer } from "./index";

const app = createServer();
const port = process.env.PORT || 3000;

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to frontend build
const distPath = path.join(__dirname, "../spa");

// Serve static frontend files
app.use(express.static(distPath));

// Health check route
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});

// API 404 handler
app.use("/api", (_req, res) => {
  res.status(404).json({
    error: "API route not found",
  });
});

// React SPA fallback
// Serves index.html for all frontend routes
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