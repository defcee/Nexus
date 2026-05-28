console.log("🚀 NODE BUILD STARTED");

import "dotenv/config";

import { createServer } from "./index";

// ============================================
// ENV (CLEAN + RENDER SAFE)
// ============================================

const PORT = Number(process.env.PORT) || 8080;

const NODE_ENV = process.env.NODE_ENV || "development";

// FIX 1: API_URL is NOT needed in backend runtime on Render
// Backend should NOT assume its own public URL incorrectly
const API_URL =
  process.env.API_URL ||
  `http://localhost:${PORT}`;

// ============================================
// GLOBAL ERROR HANDLING
// ============================================

// Catch sync errors
process.on("uncaughtException", (err: Error) => {
  console.error("====================================");
  console.error("❌ UNCAUGHT EXCEPTION");
  console.error(err);
  console.error("====================================");
});

// Catch async errors
process.on("unhandledRejection", (reason: any) => {
  console.error("====================================");
  console.error("❌ UNHANDLED PROMISE REJECTION");
  console.error(reason);
  console.error("====================================");
});

// ============================================
// CREATE EXPRESS APP
// ============================================

let app;

try {
  app = createServer();

  if (!app) {
    throw new Error("createServer() did not return an Express app");
  }
} catch (error) {
  console.error("====================================");
  console.error("❌ FAILED TO INITIALIZE SERVER");
  console.error(error);
  console.error("====================================");
  process.exit(1);
}

// ============================================
// START SERVER (FIXED FOR RENDER)
// ============================================

console.log("✅ STARTING EXPRESS SERVER");

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("====================================");
  console.log("🚀 Nexus Global Logistics Server Started");
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 Port: ${PORT}`);

  // FIX 2: avoid misleading API_URL logs in production
  console.log(`🧪 API: /api/test`);
  console.log(`🗄️ DB: /api/db-test`);

  console.log("====================================");
});

// ============================================
// SERVER ERROR HANDLING
// ============================================

server.on("error", (error: any) => {
  console.error("====================================");
  console.error("❌ SERVER STARTUP ERROR");
  console.error(error);

  if (error.code === "EADDRINUSE") {
    console.error(`⚠️ Port ${PORT} already in use`);
  }

  if (error.code === "EACCES") {
    console.error(`⚠️ Permission denied for port ${PORT}`);
  }

  console.error("====================================");
  process.exit(1);
});

// ============================================
// GRACEFUL SHUTDOWN (RENDER SAFE)
// ============================================

const gracefulShutdown = (signal: string) => {
  console.log("====================================");
  console.log(`⚠️ ${signal} received`);
  console.log("🛑 Closing server gracefully...");
  console.log("====================================");

  server.close(() => {
    console.log("✅ Server closed successfully");
    process.exit(0);
  });

  // FIX 3: force shutdown fallback (Render safety)
  setTimeout(() => {
    console.log("⚠️ Force shutdown triggered");
    process.exit(1);
  }, 10000);
};

// Render shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));