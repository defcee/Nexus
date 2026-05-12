import "dotenv/config";
import express from "express";
import cors from "cors";
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

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // User Authentication Routes
  app.post("/api/signup", handleSignup);
  app.post("/api/login", handleLogin);
  app.get("/api/users/:id", handleGetProfile);
  app.put("/api/users/:id", handleUpdateProfile);

  // Package & Tracking Routes
  app.post("/api/packages", handleCreatePackage);
  app.get("/api/packages/track/:trackingNumber", handleTrackPackage);
  app.get("/api/packages", handleGetAllPackages);
  app.put("/api/packages/:trackingNumber/status", handleUpdatePackageStatus);
  app.delete("/api/packages/:id", handleDeletePackage);

  // Admin Routes
  app.post("/api/admin/login", handleAdminLogin);
  app.post("/api/admin/logout", handleAdminLogout);
  app.get("/api/admin/stats", handleGetAdminStats);
  app.get("/api/admin/chats", handleGetChatMessages);
  app.post("/api/admin/chats", handleSaveChatMessage);
  app.get("/api/admin/invoices", handleGetInvoices);
  app.post("/api/admin/invoices", handleCreateInvoice);

  return app;
}
