import { RequestHandler } from "express";
import bcrypt from "bcrypt";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  password: string; // hashed password
  createdAt: Date;
}

let users: User[] = [];
let userIdCounter = 1;

// -------------------- SIGNUP --------------------
export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (users.some((u) => u.email === email)) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: userIdCounter++,
      fullName,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.push(newUser);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error during signup",
    });
  }
};

// -------------------- LOGIN --------------------
export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 🔐 COMPARE HASHED PASSWORD
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
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
      token: `mock-token-${user.id}`,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

// -------------------- GET PROFILE --------------------
export const handleGetProfile: RequestHandler = (req, res) => {
  const userIdParam = req.params.id;

  if (!userIdParam || Array.isArray(userIdParam)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const userId = parseInt(userIdParam, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
  });
};

// -------------------- UPDATE PROFILE --------------------
export const handleUpdateProfile: RequestHandler = (req, res) => {
  const userIdParam = req.params.id;

  if (!userIdParam || Array.isArray(userIdParam)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const userId = parseInt(userIdParam, 10);

  if (Number.isNaN(userId)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const { fullName, phone } = req.body;

  if (fullName) user.fullName = fullName;
  if (phone) user.phone = phone;

  return res.json({
    message: "Profile updated successfully",
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    },
  });
};