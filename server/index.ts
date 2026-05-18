import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

import { pool } from "./db";

import { handleDemo } from "./routes/demo";

import {
  handleSignup,
  handleLogin,
  handleGetProfile,
  handleUpdateProfile,
} from "./routes/auth";

import {
  handleCreatePackage,
  handleTrackPackage,
  handleUpdatePackageStatus,
  handleGetAllPackages,
  handleDeletePackage,
} from "./routes/packages";

import {
  handleAdminLogin,
  handleAdminLogout,
  handleGetAdminStats,
  handleGetChatMessages,
  handleSaveChatMessage,
  handleGetInvoices,
  handleCreateInvoice,
} from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // -------------------- API ROUTES --------------------

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/db-test", async (_req, res) => {
    try {
      // mysql2/promise returns [rows, fields]
      const [rows] = await pool.query("SELECT NOW() AS now");
      res.json({
        message: "Database connected successfully",
        time: Array.isArray(rows) && rows.length ? rows[0] : rows,
      });
    } catch (error) {
      console.error("DB connection error:", error);
      res.status(500).json({
        message: "Database connection failed",
        error: (error as Error).message,
      });
    }
  });

  app.get("/api/demo", handleDemo);

  // AUTH
  app.post("/api/signup", handleSignup);
  app.post("/api/login", handleLogin);
  app.get("/api/users/:id", handleGetProfile);
  app.put("/api/users/:id", handleUpdateProfile);

  // PACKAGES
  app.post("/api/packages", handleCreatePackage);
  app.get("/api/packages/track/:trackingNumber", handleTrackPackage);
  app.get("/api/packages", handleGetAllPackages);
  app.put("/api/packages/:trackingNumber/status", handleUpdatePackageStatus);
  app.delete("/api/packages/:id", handleDeletePackage);

  // ADMIN API
  app.post("/api/admin/login", handleAdminLogin);
  app.post("/api/admin/logout", handleAdminLogout);
  app.get("/api/admin/stats", handleGetAdminStats);
  app.get("/api/admin/chats", handleGetChatMessages);
  app.post("/api/admin/chats", handleSaveChatMessage);
  app.get("/api/admin/invoices", handleGetInvoices);
  app.post("/api/admin/invoices", handleCreateInvoice);

  // -------------------- ADMIN ROUTE PROTECTION --------------------
  // If BASIC_AUTH_USER & BASIC_AUTH_PASSWORD are set, enforce Basic Auth for /admin.
  // Otherwise fall back to referer-based direct-navigation guard (Option A).
  app.use((req, res, next) => {
    try {
      if (req.path === "/admin" || req.path.startsWith("/admin/")) {
        const BASIC_USER = process.env.BASIC_AUTH_USER;
        const BASIC_PASS = process.env.BASIC_AUTH_PASSWORD;

        if (BASIC_USER && BASIC_PASS) {
          // Enforce Basic Auth
          const auth = req.get("authorization") || "";
          if (!auth.startsWith("Basic ")) {
            res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
            return res.status(401).send("Authentication required");
          }

          const b64 = auth.split(" ")[1] || "";
          const decoded = Buffer.from(b64, "base64").toString("utf8");
          const [user, pass] = decoded.split(":");
          if (user !== BASIC_USER || pass !== BASIC_PASS) {
            res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
            return res.status(401).send("Invalid credentials");
          }

          // Basic auth passed
          return next();
        }

        // Fallback: referer-based direct navigation (Option A)
        const referer = req.get("referer") || "";
        const host = req.get("host") || "";
        const isDirect = !referer || !referer.includes(host);
        if (!isDirect) {
          return res.status(403).send("Forbidden");
        }
      }
    } catch (err) {
      console.warn("admin guard error", err);
    }
    next();
  });

  // -------------------- FRONTEND --------------------

  const spaPath = path.join(process.cwd(), "dist", "spa");

  app.use(express.static(spaPath));

  // FIXED FOR EXPRESS 5 (NO "*")
  app.use((_req, res) => {
    res.sendFile(path.join(spaPath, "index.html"));
  });

  return app;
}
