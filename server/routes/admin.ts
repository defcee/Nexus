import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";

// Admin login: prefer admins table, fallback to env vars
export const handleAdminLogin: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Try DB first
    const [rows] = await pool.query("SELECT * FROM admins WHERE username = ?", [username]);
    const admins = Array.isArray(rows) ? rows : [];
    const admin = admins[0] as any;

    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid username or password" });

      return res.json({ message: "Admin login successful", admin: { id: admin.id, username: admin.username }, token: `admin-token-${admin.id}` });
    }

    // Fallback to env vars
    const ENV_USER = process.env.ADMIN_USERNAME || "admin";
    const ENV_PASS = process.env.ADMIN_PASSWORD || "admin123";

    if (username === ENV_USER && password === ENV_PASS) {
      return res.json({ message: "Admin login successful", admin: { id: 0, username }, token: `admin-token-0` });
    }

    return res.status(401).json({ error: "Invalid username or password" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleAdminLogout: RequestHandler = (_req, res) => {
  res.json({ message: "Logged out successfully" });
};

export const handleGetAdminStats: RequestHandler = async (_req, res) => {
  try {
    // Example counts from DB
    const [[{ totalShipments }]] = await Promise.all([
      pool.query("SELECT COUNT(*) AS totalShipments FROM packages") as any,
    ]);

    const [[{ deliveredShipments }]] = await Promise.all([
      pool.query("SELECT COUNT(*) AS deliveredShipments FROM packages WHERE status = ?", ["Delivered"]) as any,
    ]);

    const [[{ totalUsers }]] = await Promise.all([
      pool.query("SELECT COUNT(*) AS totalUsers FROM users") as any,
    ]);

    const stats = {
      totalShipments: totalShipments?.totalShipments || 0,
      deliveredShipments: deliveredShipments?.deliveredShipments || 0,
      pendingShipments: 0,
      totalUsers: totalUsers?.totalUsers || 0,
      revenueToday: 0,
    };

    // pending shipments
    const [pendingRows] = await pool.query("SELECT COUNT(*) AS pending FROM packages WHERE status != ?", ["Delivered"]);
    stats.pendingShipments = Array.isArray(pendingRows) && pendingRows[0] ? pendingRows[0].pending : 0;

    // revenueToday: sum from invoices created today
    const [revRows] = await pool.query("SELECT IFNULL(SUM(totalAmount),0) AS revenueToday FROM invoices WHERE DATE(createdAt) = CURDATE()");
    stats.revenueToday = Array.isArray(revRows) && revRows[0] ? parseFloat(revRows[0].revenueToday) : 0;

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetChatMessages: RequestHandler = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM chat_messages ORDER BY createdAt ASC");
    res.json({ messages: Array.isArray(rows) ? rows : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleSaveChatMessage: RequestHandler = async (req, res) => {
  try {
    const { userId, message, sender } = req.body;

    if (!userId || !message || !sender) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO chat_messages (userId, message, sender) VALUES (?, ?, ?)",
      [userId, message, sender]
    );

    const insertId = (result as any).insertId;
    const [rows] = await pool.query("SELECT * FROM chat_messages WHERE id = ?", [insertId]);

    res.status(201).json({ message: "Message saved successfully", data: Array.isArray(rows) ? rows[0] : rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetInvoices: RequestHandler = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM invoices ORDER BY createdAt DESC");
    res.json({ invoices: Array.isArray(rows) ? rows : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleCreateInvoice: RequestHandler = async (req, res) => {
  try {
    const { trackingNumber, userId, totalAmount, invoiceFile } = req.body;

    if (!trackingNumber || !userId || !totalAmount) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const [result] = await pool.query(
      "INSERT INTO invoices (trackingNumber, userId, totalAmount, invoiceFile) VALUES (?, ?, ?, ?)",
      [trackingNumber, userId, parseFloat(totalAmount), invoiceFile || `invoice-${trackingNumber}.pdf`]
    );

    const insertId = (result as any).insertId;
    const [rows] = await pool.query("SELECT * FROM invoices WHERE id = ?", [insertId]);

    res.status(201).json({ message: "Invoice created successfully", invoice: Array.isArray(rows) ? rows[0] : rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
