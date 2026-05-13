import path from "path";
import express from "express";
import { createServer } from "./index";

const app = createServer();
const port = process.env.PORT || 3000;

// Get current directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Production build path
const distPath = path.join(__dirname, "../spa");

// Serve static frontend files
app.use(express.static(distPath));

// Health check route
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

// React Router fallback
// IMPORTANT: Express 5 no longer supports "*"
app.get("/*", (req, res) => {
  // Skip API routes
  if (
    req.path.startsWith("/api/") ||
    req.path.startsWith("/health")
  ) {
    return res.status(404).json({
      error: "API endpoint not found",
    });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});