import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";

interface User {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  password: string;
  createdat: Date;
}

// ============================================
// SIGNUP
// ============================================

export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // CHECK IF EMAIL EXISTS
    const existingResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const insertResult = await pool.query(
      `
      INSERT INTO users (fullname, email, phone, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, fullname, email, phone
      `,
      [fullName, email, phone, hashedPassword]
    );

    const user = insertResult.rows[0];

    return res.status(201).json({
      message: "User created successfully",
      user,
      token: `mock-token-${user.id}`,
    });
  } catch (err) {
    console.error("❌ SIGNUP ERROR:");
    console.error(err);

    return res.status(500).json({
      message: "Server error during signup",
    });
  }
};

// ============================================
// LOGIN
// ============================================

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    const user = result.rows[0] as User;

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.fullname,
        email: user.email,
        phone: user.phone,
      },
      token: `mock-token-${user.id}`,
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:");
    console.error(err);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

// ============================================
// GET PROFILE
// ============================================

export const handleGetProfile: RequestHandler = async (req, res) => {
  try {
    const rawUserIdParam = req.params.id;
    const userIdParam = Array.isArray(rawUserIdParam)
      ? rawUserIdParam[0]
      : rawUserIdParam;

    if (!userIdParam) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userId = parseInt(userIdParam, 10);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const result = await pool.query(
      `
      SELECT id, fullname, email, phone, createdat
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      id: user.id,
      fullName: user.fullname,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdat,
    });
  } catch (err) {
    console.error("❌ GET PROFILE ERROR:");
    console.error(err);

    return res.status(500).json({
      message: "Server error fetching profile",
    });
  }
};

// ============================================
// UPDATE PROFILE
// ============================================

export const handleUpdateProfile: RequestHandler = async (req, res) => {
  try {
    const userIdParam = req.params.id;

    if (!userIdParam || Array.isArray(userIdParam)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userId = parseInt(userIdParam, 10);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const { fullName, phone } = req.body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (fullName) {
      updates.push(`fullname = $${paramCount}`);
      values.push(fullName);
      paramCount++;
    }

    if (phone) {
      updates.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        message: "No fields to update",
      });
    }

    values.push(userId);

    await pool.query(
      `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      `,
      values
    );

    const result = await pool.query(
      `
      SELECT id, fullname, email, phone
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    const user = result.rows[0];

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        fullName: user.fullname,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("❌ UPDATE PROFILE ERROR:");
    console.error(err);

    return res.status(500).json({
      message: "Server error updating profile",
    });
  }
};

// ============================================
// 🔐 CHANGE PASSWORD (NEW)
// ============================================

export const handleChangePassword: RequestHandler = async (req, res) => {
  try {
    // IMPORTANT: requires auth middleware that sets req.user
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password are required",
      });
    }

    // GET USER
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );

    const user = result.rows[0] as User;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // VERIFY CURRENT PASSWORD
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // UPDATE PASSWORD
    await pool.query(
      `UPDATE users SET password = $1 WHERE id = $2`,
      [hashedPassword, userId]
    );

    return res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("❌ CHANGE PASSWORD ERROR:");
    console.error(err);

    return res.status(500).json({
      message: "Server error updating password",
    });
  }
};