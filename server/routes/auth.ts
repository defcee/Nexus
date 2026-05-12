import { RequestHandler } from "express";

// In a real app, this would connect to a database
// For now, we'll use in-memory storage for demo purposes
interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  password: string; // In production, this would be hashed with bcrypt
  createdAt: Date;
}

let users: User[] = [];
let userIdCounter = 1;

export const handleSignup: RequestHandler = (req, res) => {
  const { fullName, email, phone, password } = req.body;

  // Validate input
  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if user already exists
  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ error: "Email already registered" });
  }

  // Create new user
  const newUser: User = {
    id: userIdCounter++,
    fullName,
    email,
    phone,
    password, // In production, hash this with bcrypt
    createdAt: new Date(),
  };

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully",
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
    },
  });
};

export const handleLogin: RequestHandler = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // In production, create a JWT token here
  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    },
    token: `mock-token-${user.id}`, // In production, use JWT
  });
};

export const handleGetProfile: RequestHandler = (req, res) => {
  // In production, extract user ID from JWT token
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
  });
};

export const handleUpdateProfile: RequestHandler = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const { fullName, phone } = req.body;

  if (fullName) user.fullName = fullName;
  if (phone) user.phone = phone;

  res.json({
    message: "Profile updated successfully",
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    },
  });
};
