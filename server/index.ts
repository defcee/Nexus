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

  app.use("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.use("/api/db-test", async (_req, res) => {
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

  app.use("/api/demo", handleDemo);

  // AUTH (public routes kept server-side but client UI will be removed)
  app.post("/api/signup", handleSignup);
  app.post("/api/login", handleLogin);
  app.use("/api/users/:id", handleGetProfile);
  app.put("/api/users/:id", handleUpdateProfile);

  // PACKAGES
  app.post("/api/packages", handleCreatePackage);
  app.use("/api/packages/track/:trackingNumber", handleTrackPackage);
  app.use("/api/packages", handleGetAllPackages);
  app.put("/api/packages/:trackingNumber/status", handleUpdatePackageStatus);
  app.delete("/api/packages/:id", handleDeletePackage);

  // -------------------- ADMIN AUTH & ROUTES --------------------

  // Simple admin token-based middleware used for protecting admin API endpoints
  function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.get("authorization") || "";
    // Accept both Bearer and raw tokens
    const token = authHeader.replace(/^Bearer\s+/i, "") || (req.headers["x-admin-token"] as string) || "";
    if (!token || !token.startsWith("admin-token-")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Attach adminId for handlers if needed
    const idStr = token.replace("admin-token-", "");
    (req as any).adminId = parseInt(idStr, 10) || 0;
    next();
  }

  // Admin login remains public (uses DB first, falls back to ADMIN_USERNAME/ADMIN_PASSWORD env)
  app.post("/api/admin/login", handleAdminLogin);

  // Protect all other admin API endpoints
  app.post("/api/admin/logout", requireAdminAuth, handleAdminLogout);
  app.use("/api/admin/stats", requireAdminAuth, handleGetAdminStats);
  app.use("/api/admin/chats", requireAdminAuth, handleGetChatMessages);
  app.post("/api/admin/chats", requireAdminAuth, handleSaveChatMessage);
  app.use("/api/admin/invoices", requireAdminAuth, handleGetInvoices);
  app.post("/api/admin/invoices", requireAdminAuth, handleCreateInvoice);

  // -------------------- REMOVE/REDIRECT PUBLIC LOGIN & SIGNUP UI --------------------
  // The frontend login/signup routes are removed from the client. For safety, redirect those
  // requests to /admin so users land on the admin-only login page.
  app.use(["/login", "/signup", "/auth/login", "/auth/signup"], (_req, res) => {
    return res.redirect(302, "/admin");
  });

  // -------------------- FRONTEND --------------------

  const spaPath = path.join(process.cwd(), "dist", "spa");

  app.use(express.static(spaPath));

  // Serve index.html for SPA routes including /admin so the client-side admin UI can boot.
  app.use((_req, res) => {
    res.sendFile(path.join(spaPath, "index.html"));
  });

  return app;
}
