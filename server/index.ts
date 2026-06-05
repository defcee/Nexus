import "dotenv/config";
import express from "express";
import cors from "cors";

import { pool } from "./db";

import { handleSendEmail } from "./routes/email";
import { handleContact } from "./routes/contact";


import {
  handleSignup,
  handleLogin,
  handleGetProfile,
  handleUpdateProfile,
  handleChangePassword, // ✅ ADDED
} from "./routes/auth";

import * as packages from "./routes/packages";

import {
  handleAdminLogin,
  handleAdminLogout,
  handleGetAdminStats,
  handleGetChatMessages,
  handleSaveChatMessage,
  handleGetInvoices,
  handleCreateInvoice,
  handleAdminChangePassword,
} from "./routes/admin";



// 🔐 AUTH MIDDLEWARE (MAKE SURE THIS FILE EXISTS)
import { authMiddleware } from "./middleware/authMiddleware";

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
        if (!origin) return callback(null, true);

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
    res.json({
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

      res.json({
        success: true,
        time: result.rows[0],
      });
    } catch (err) {
      console.error("DB ERROR:", err);
      res.status(500).json({ error: "DB error" });
    }
  });

  // ==============================
  // AUTH ROUTES
  // ==============================
  app.post("/api/signup", handleSignup);
  app.post("/api/login", handleLogin);

  app.get("/api/users/:id", handleGetProfile);
  app.put("/api/users/:id", handleUpdateProfile);
  
  // 🔐 CHANGE PASSWORD (PROTECTED)
  app.post(
    "/api/users/change-password",
    authMiddleware,
    handleChangePassword
  );

  // ==============================
// ADMIN ROUTES
// ==============================
app.post("/api/admin/login", handleAdminLogin);
app.post("/api/admin/logout", handleAdminLogout);
app.get("/api/admin/stats", handleGetAdminStats);

app.get("/api/admin/chat", handleGetChatMessages);
app.post("/api/admin/chat", handleSaveChatMessage);

app.get("/api/admin/invoices", handleGetInvoices);
app.post("/api/admin/invoices", handleCreateInvoice);

// 🔐 ADD THIS LINE
app.post("/api/admin/change-password", authMiddleware,handleAdminChangePassword);

  // ==============================
  // CONTACT ROUTE
  // ==============================
  app.post("/api/contact", handleContact);

  // ==============================
  // PACKAGE ROUTES
  // ==============================
  app.post("/api/packages", packages.handleCreatePackage);
  app.get("/api/packages", (packages as any).handleGetAllPackages);

  app.get(
    "/api/packages/track/:trackingNumber",
    (packages as any).handleTrackPackage
  );

  app.put(
    "/api/packages/:trackingNumber/status",
    (packages as any).handleUpdatePackageStatus
  );

  app.put("/api/packages/:id", (packages as any).handleUpdatePackage);
  app.delete("/api/packages/:id", (packages as any).handleDeletePackage);

  // ==============================
  // ADMIN ROUTES
  // ==============================
  app.post("/api/admin/login", handleAdminLogin);
  app.post("/api/admin/logout", handleAdminLogout);
  app.get("/api/admin/stats", handleGetAdminStats);

  app.get("/api/admin/chat", handleGetChatMessages);
  app.post("/api/admin/chat", handleSaveChatMessage);

  // PUBLIC CHAT ROUTES
  app.get("/api/chat", handleGetChatMessages);
  app.post("/api/chat", handleSaveChatMessage);

  app.get("/api/admin/invoices", handleGetInvoices);
  app.post("/api/admin/invoices", handleCreateInvoice);

  app.post("/api/email/send", handleSendEmail);

  return app;
}