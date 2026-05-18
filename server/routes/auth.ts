import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  password: string; // hashed password
  createdAt: Date;
}

// -------------------- SIGNUP --------------------
export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email exists
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (fullName, email, phone, password) VALUES (?, ?, ?, ?)",
      [fullName, email, phone, hashedPassword]
    );

    const insertId = (result as any).insertId;

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: insertId,
        fullName,
        email,
        phone,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

// -------------------- LOGIN --------------------
export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const users = Array.isArray(rows) ? rows : [];
    const user = users[0] as any;

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
      token: `mock-token-${user.id}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// -------------------- GET PROFILE --------------------
export const handleGetProfile: RequestHandler = async (req, res) => {
  const userIdParam = req.params.id;

  if (!userIdParam || Array.isArray(userIdParam)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const userId = parseInt(userIdParam, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const [rows] = await pool.query("SELECT id, fullName, email, phone, createdAt FROM users WHERE id = ?", [
    userId,
  ]);

  const users = Array.isArray(rows) ? rows : [];
  const user = users[0] as any;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
};

// -------------------- UPDATE PROFILE --------------------
export const handleUpdateProfile: RequestHandler = async (req, res) => {
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
  if (fullName) {
    updates.push("fullName = ?");
    values.push(fullName);
  }
  if (phone) {
    updates.push("phone = ?");
    values.push(phone);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  values.push(userId);

  await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values);

  const [rows] = await pool.query("SELECT id, fullName, email, phone FROM users WHERE id = ?", [
    userId,
  ]);

  const users = Array.isArray(rows) ? rows : [];
  const user = users[0] as any;

  return res.json({ message: "Profile updated successfully", user });
};
