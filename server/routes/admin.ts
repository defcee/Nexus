import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";

// =====================================================
// ADMIN LOGIN
// =====================================================

export const handleAdminLogin: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    try {
      const result = await pool.query(
        `
        SELECT *
        FROM admins
        WHERE username = $1
        LIMIT 1
        `,
        [username]
      );

      const admin = result.rows[0];

      if (admin) {
        let passwordValid = false;

        try {
          passwordValid = await bcrypt.compare(
            password,
            admin.password
          );
        } catch {
          passwordValid = password === admin.password;
        }

        if (!passwordValid) {
          return res.status(401).json({
            error: "Invalid username or password",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Admin login successful",
          token: `admin-token-${admin.id}`,
          admin: {
            id: admin.id,
            username: admin.username,
          },
        });
      }
    } catch (dbError) {
      console.error("⚠️ Admin DB login failed", dbError);
    }

    const ENV_USER = process.env.ADMIN_USERNAME || "admin";
    const ENV_PASS = process.env.ADMIN_PASSWORD || "admin123";

    if (username === ENV_USER && password === ENV_PASS) {
      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        token: "admin-token-0",
        admin: {
          id: 0,
          username,
        },
      });
    }

    return res.status(401).json({
      error: "Invalid username or password",
    });
  } catch (error) {
    console.error("❌ ADMIN LOGIN ERROR", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// =====================================================
// ADMIN LOGOUT
// =====================================================

export const handleAdminLogout: RequestHandler = async (_req, res) => {
  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};

// =====================================================
// ADMIN STATS
// =====================================================

export const handleGetAdminStats: RequestHandler = async (_req, res) => {
  try {
    const shipmentResult = await pool.query(`
      SELECT COUNT(*) AS totalshipments FROM packages
    `);

    const deliveredResult = await pool.query(
      `
      SELECT COUNT(*) AS deliveredshipments
      FROM packages
      WHERE status = $1
      `,
      ["Delivered"]
    );

    const userResult = await pool.query(`
      SELECT COUNT(*) AS totalusers FROM users
    `);

    const pendingResult = await pool.query(
      `
      SELECT COUNT(*) AS pendingshipments
      FROM packages
      WHERE status != $1
      `,
      ["Delivered"]
    );

    const revenueResult = await pool.query(`
      SELECT COALESCE(SUM(total_amount),0) AS revenuetoday
      FROM invoices
      WHERE DATE(created_at)=CURRENT_DATE
    `);

    return res.json({
      totalShipments: Number(shipmentResult.rows[0].totalshipments),
      deliveredShipments: Number(deliveredResult.rows[0].deliveredshipments),
      pendingShipments: Number(pendingResult.rows[0].pendingshipments),
      totalUsers: Number(userResult.rows[0].totalusers),
      revenueToday: Number(revenueResult.rows[0].revenuetoday),
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);

    return res.status(500).json({
      error: "Failed to load admin stats",
    });
  }
};

// =====================================================
// CHAT MESSAGES
// =====================================================

export const handleGetChatMessages: RequestHandler = async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM chat_messages
      ORDER BY created_at ASC
    `);

    return res.json({
      messages: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load chat messages",
    });
  }
};

// =====================================================
// SAVE CHAT MESSAGE (FIXED FOR CUSTOMER + ADMIN)
// =====================================================

export const handleSaveChatMessage: RequestHandler = async (req, res) => {
  try {
    const { userId, message, sender } = req.body;

    if (!message || !sender) {
      return res.status(400).json({
        error: "message and sender are required",
      });
    }

    // normalize sender to prevent bad frontend data
    const cleanSender =
      sender === "admin" || sender === "user"
        ? sender
        : "user";

    const insertResult = await pool.query(
      `
      INSERT INTO chat_messages
      (
        user_id,
        message,
        sender
      )
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [userId || null, message, cleanSender]
    );

    return res.status(201).json({
      success: true,
      data: insertResult.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to save message",
    });
  }
};

// =====================================================
// GET INVOICES
// =====================================================

export const handleGetInvoices: RequestHandler = async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM invoices
      ORDER BY created_at DESC
    `);

    return res.json({
      invoices: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load invoices",
    });
  }
};

// =====================================================
// CREATE INVOICE
// =====================================================

export const handleCreateInvoice: RequestHandler = async (req, res) => {
  try {
    const {
      trackingNumber,
      userId,
      totalAmount,

      sender_name,
      sender_address,
      receiver_name,
      receiver_address,
    } = req.body;

    if (!trackingNumber || !totalAmount) {
      return res.status(400).json({
        error: "Tracking number and total amount are required",
      });
    }

    const invoiceNumber =
      "INV-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 9999);

    const insertResult = await pool.query(
      `
      INSERT INTO invoices
      (
        invoice_number,
        tracking_number,
        user_id,
        total_amount,
        sender_name,
        receiver_name,
        sender_address,
        receiver_address,
        status
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )
      RETURNING *
      `,
      [
        invoiceNumber,
        trackingNumber,
        userId || null,
        Number(totalAmount),

        sender_name || null,
        receiver_name || null,
        sender_address || null,
        receiver_address || null,

        "Pending",
      ]
    );

    return res.status(201).json({
      success: true,
      invoice: insertResult.rows[0],
    });
  } catch (error) {
    console.error(
      "CREATE INVOICE ERROR:",
      error
    );

    return res.status(500).json({
      error: "Failed to create invoice",
    });
  }
};

// =====================================================
// ADMIN CHANGE PASSWORD (NEW)
// =====================================================

export const handleAdminChangePassword: RequestHandler = async (req, res) => {
  try {
    const adminId = (req as any).admin?.id || (req as any).user?.id;

    if (!adminId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current and new password are required",
      });
    }

    // GET ADMIN
    const result = await pool.query(
      `SELECT * FROM admins WHERE id = $1`,
      [adminId]
    );

    const admin = result.rows[0];

    if (!admin) {
      return res.status(404).json({
        error: "Admin not found",
      });
    }

    // VERIFY PASSWORD
    let isMatch = false;

    try {
      isMatch = await bcrypt.compare(currentPassword, admin.password);
    } catch {
      isMatch = currentPassword === admin.password;
    }

    if (!isMatch) {
      return res.status(400).json({
        error: "Current password is incorrect",
      });
    }

    // HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // UPDATE PASSWORD
    await pool.query(
      `UPDATE admins SET password = $1 WHERE id = $2`,
      [hashedPassword, adminId]
    );

    return res.json({
      success: true,
      message: "Admin password updated successfully",
    });
  } catch (error) {
    console.error("ADMIN CHANGE PASSWORD ERROR:", error);

    return res.status(500).json({
      error: "Failed to change password",
    });
  }
};