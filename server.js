import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

import { createServer } from "./index";

dotenv.config();

// Create app from server/index.ts
const app = createServer();

const PORT = Number(
  process.env.PORT ||
  process.env.NODE_PORT ||
  8080
);

const distSpa = path.resolve(
  process.cwd(),
  "dist",
  "spa"
);

// Serve static assets
app.use(
  express.static(distSpa, {
    index: false,
  })
);

// Health check
app.use(
  process.env.HEALTH_PATH || "/health",
  (_req, res) => {
    res.type("text").send("ok");
  }
);

// SPA fallback (/admin, etc.)
app.use("*", (_req, res) => {
  const indexPath = path.join(
    distSpa,
    "index.html"
  );

  if (fs.existsSync(indexPath)) {
    return res
      .type("html")
      .sendFile(indexPath);
  }

  return res.type("html").send(`
    <!doctype html>
    <html>
      <body>
        <h1>App not built yet</h1>
      </body>
    </html>
  `);
});

// START SERVER (ONLY PLACE)
app.listen(PORT, "0.0.0.0", () => {
  console.log("====================================");
  console.log(
    `🚀 Server running on ${PORT}`
  );
  console.log("📡 API ready at /api");
  console.log("====================================");
});