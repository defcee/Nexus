import { RequestHandler } from "express";

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    const parts = token.split("-");

    if (parts.length < 3) {
      return res.status(401).json({
        message: "Invalid token structure",
      });
    }

    const role = parts[0]; // 👈 NEW (mock-token OR admin-token)
    const userId = parseInt(parts[2], 10);

    if (Number.isNaN(userId)) {
      return res.status(401).json({
        message: "Invalid user in token",
      });
    }

    // attach user info
    (req as any).user = {
      id: userId,
      role,
    };

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);

    return res.status(500).json({
      message: "Authentication failed",
    });
  }
};