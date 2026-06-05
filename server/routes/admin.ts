import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";

/* =========================
   ADMIN LOGIN
========================= */
export const handleAdminLogin: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      [username]
    );

    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json({
      success: true,
      token: `admin-token-${admin.id}`,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   PLACEHOLDERS (NO BREAK)
========================= */

export const handleAdminLogout: RequestHandler = async (_req, res) => {
  return res.json({ success: true });
};

export const handleGetAdminStats: RequestHandler = async (_req, res) => {
  return res.json({});
};

export const handleGetChatMessages: RequestHandler = async (_req, res) => {
  return res.json({ messages: [] });
};

export const handleSaveChatMessage: RequestHandler = async (_req, res) => {
  return res.json({ success: true });
};

export const handleGetInvoices: RequestHandler = async (_req, res) => {
  return res.json({ invoices: [] });
};

export const handleCreateInvoice: RequestHandler = async (_req, res) => {
  return res.json({ success: true });
};

/* =========================
   FIXED PASSWORD CHANGE
   (THIS WAS THE MAIN BUG)
========================= */
export const handleAdminChangePassword: RequestHandler = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // NOTE: token middleware must attach admin id
    const adminId = (req as any).user?.id || (req as any).admin?.id;

    if (!adminId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      "SELECT * FROM admins WHERE id = $1",
      [adminId]
    );

    const admin = result.rows[0];

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // verify current password
    const valid = await bcrypt.compare(currentPassword, admin.password);

    if (!valid) {
      return res.status(400).json({ error: "Current password incorrect" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update DB
    await pool.query(
      "UPDATE admins SET password = $1 WHERE id = $2",
      [hashedPassword, adminId]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};