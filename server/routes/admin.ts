import { RequestHandler } from "express";

interface Admin {
  id: number;
  username: string;
  password: string; // In production, this would be hashed
}

// Default admin credentials
const admins: Admin[] = [
  {
    id: 1,
    username: "admin",
    password: "admin123", // In production, this would be bcrypt hashed
  },
];

export const handleAdminLogin: RequestHandler = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const admin = admins.find(
    (a) => a.username === username && a.password === password
  );

  if (!admin) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // In production, create a JWT token here
  res.json({
    message: "Admin login successful",
    admin: {
      id: admin.id,
      username: admin.username,
    },
    token: `admin-token-${admin.id}`, // In production, use JWT
  });
};

export const handleAdminLogout: RequestHandler = (req, res) => {
  // In production, invalidate the JWT token
  res.json({ message: "Logged out successfully" });
};

interface AdminStats {
  totalShipments: number;
  deliveredShipments: number;
  pendingShipments: number;
  totalUsers: number;
  revenueToday: number;
}

export const handleGetAdminStats: RequestHandler = (req, res) => {
  // In production, query the database
  const stats: AdminStats = {
    totalShipments: 5234,
    deliveredShipments: 4892,
    pendingShipments: 342,
    totalUsers: 1203,
    revenueToday: 24500,
  };

  res.json(stats);
};

interface ChatMessage {
  id: number;
  userId: number;
  message: string;
  sender: "user" | "bot" | "admin";
  createdAt: Date;
}

let chatMessages: ChatMessage[] = [];
let messageIdCounter = 1;

export const handleGetChatMessages: RequestHandler = (req, res) => {
  res.json({
    messages: chatMessages,
  });
};

export const handleSaveChatMessage: RequestHandler = (req, res) => {
  const { userId, message, sender } = req.body;

  if (!userId || !message || !sender) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newMessage: ChatMessage = {
    id: messageIdCounter++,
    userId,
    message,
    sender,
    createdAt: new Date(),
  };

  chatMessages.push(newMessage);

  res.status(201).json({
    message: "Message saved successfully",
    data: newMessage,
  });
};

interface Invoice {
  id: number;
  trackingNumber: string;
  userId: number;
  totalAmount: number;
  invoiceFile: string;
  createdAt: Date;
}

let invoices: Invoice[] = [];
let invoiceIdCounter = 1;

export const handleGetInvoices: RequestHandler = (req, res) => {
  res.json({
    invoices: invoices,
  });
};

export const handleCreateInvoice: RequestHandler = (req, res) => {
  const { trackingNumber, userId, totalAmount, invoiceFile } = req.body;

  if (!trackingNumber || !userId || !totalAmount) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  const newInvoice: Invoice = {
    id: invoiceIdCounter++,
    trackingNumber,
    userId,
    totalAmount,
    invoiceFile: invoiceFile || `invoice-${trackingNumber}.pdf`,
    createdAt: new Date(),
  };

  invoices.push(newInvoice);

  res.status(201).json({
    message: "Invoice created successfully",
    invoice: newInvoice,
  });
};
