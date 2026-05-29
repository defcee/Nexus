import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleContact } from "./routes/contact";

import { pool } from "./db";

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
  handleUpdatePackage,
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
  console.log("====================================");
  console.log("🚀 Initializing Nexus Server");
  console.log("====================================");

  const app = express();

  // ==============================
  // CORS
  // ==============================
  const CLIENT_URL = process.env.CLIENT_URL;

  const allowedOrigins = [
    CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000",
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        if (
          allowedOrigins.includes(origin) ||
          process.env.NODE_ENV === "production"
        ) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },

      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // ==============================
  // HEALTH CHECK
  // ==============================
  app.get("/api/test", (_req, res) => {
    return res.json({
      success: true,
      message: "API running",
    });
  });

  // ==============================
  // DB TEST
  // ==============================
  app.get("/api/db-test", async (_req, res) => {
    try {
      const result = await pool.query("SELECT NOW() as now");

      return res.json({
        success: true,
        time: result.rows[0],
      });
    } catch (err) {
      console.error("DB ERROR:", err);

      return res.status(500).json({
        error: "DB error",
      });
    }
  });

  // ==============================
  // AUTH ROUTES
  // ==============================
  app.post("/api/signup", handleSignup);
  app.post("/api/login", handleLogin);
  app.get("/api/users/:id", handleGetProfile);
  app.put("/api/users/:id", handleUpdateProfile);

  // CONTACT ROUTE
  app.post("/api/contact", handleContact);

  // ==============================
  // PACKAGE ROUTES
  // ==============================
  app.post("/api/packages", handleCreatePackage);

  app.get("/api/packages/track/:trackingNumber", handleTrackPackage);
  app.get("/api/packages", handleGetAllPackages);

  app.put("/api/packages/:trackingNumber/status", handleUpdatePackageStatus);
  app.put("/api/packages/:id", handleUpdatePackage);
  app.delete("/api/packages/:id", handleDeletePackage);

  // ==============================
  // ADMIN ROUTES
  // ==============================
  app.post("/api/admin/login", handleAdminLogin);
  app.post("/api/admin/logout", handleAdminLogout);
  app.get("/api/admin/stats", handleGetAdminStats);

  app.get("/api/admin/chat", handleGetChatMessages);
  app.post("/api/admin/chat", handleSaveChatMessage);

  // ✅ PUBLIC CHAT ROUTES (FIXED POSITION)
  app.get("/api/chat", handleGetChatMessages);
  app.post("/api/chat", handleSaveChatMessage);

  app.get("/api/admin/invoices", handleGetInvoices);
  app.post("/api/admin/invoices", handleCreateInvoice);

  return app;
}