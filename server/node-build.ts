import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "./index";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Frontend build folder
const distPath = path.join(__dirname, "../spa");

// Serve static frontend files
app.use(express.static(distPath));

// React Router fallback
app.use((req, res, next) => {
  // Skip API routes
  if (
    req.path.startsWith("/api/") ||
    req.path.startsWith("/health")
  ) {
    return next();
  }

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