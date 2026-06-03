import { RequestHandler } from "express";
import { pool } from "../db";
import { handleSendEmail } from "./email";
import { sendEmail } from "../email.service";

// =====================================================
// TRACKING NUMBER GENERATOR
// =====================================================
function generateTrackingNumber() {
  return `NEX${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

// =====================================================
// CREATE PACKAGE
// =====================================================
export const handleCreatePackage: RequestHandler = async (req, res) => {
  try {
    const {
      sender_name,
      sender_email,
      sender_address,

      receiver_name,
      receiver_email,
      receiver_address,
      receiver_phone,

      package_type,
      weight,
      price,
      eta,
      destination,
      origin,
    } = req.body;

    console.log("CREATE PACKAGE BODY:", req.body);
console.log("ETA:", eta);
console.log("RECEIVER EMAIL:", receiver_email);

    const cleanWeight = Number(weight) || 0;
    const cleanPrice = Number(price) || 0;

    // =========================
    // 1. INSERT PACKAGE
    // =========================
    const result = await pool.query(
      `
      INSERT INTO packages (
        tracking_number,
        sender_name,
        sender_email,
        sender_address,

        receiver_name,
        receiver_email,
        receiver_address,
        receiver_phone,

        package_type,
        weight,
        price,

        eta,
        destination,
        origin,
        status,
        current_location
      )
      VALUES (
        $1,$2,$3,$4,
        $5,$6,$7,$8,
        $9,$10,$11,
        $12,$13,$14,$15,$16
      )
      RETURNING *
      `,
      [
        generateTrackingNumber(),
        sender_name,
        sender_email,
        sender_address,

        receiver_name,
        receiver_email,
        receiver_address,
        receiver_phone,

        package_type,
        cleanWeight,
        cleanPrice,

        eta || null,
        destination || null,
        origin || null,
        "Pending",
        "Warehouse",
      ]
    );

    const newPackage = result.rows[0];

    // =========================
    // 2. CREATE INVOICE (FIXED CRASH)
    // =========================
    console.log("STEP 2: ABOUT TO CREATE INVOICE");

try {
  console.log("INVOICE TRY BLOCK ENTERED");

  const invoiceNumber = `INV-${Date.now()}`;

  const result = await pool.query(
    `
    INSERT INTO invoices (
      invoice_number,
      tracking_number,
      total_amount,
      sender_name,
      receiver_name,
      sender_address,
      receiver_address,
      receiver_email,
      eta,
      status
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
    `,
    [
      invoiceNumber,
      newPackage.tracking_number,
      cleanPrice,
      sender_name,
      receiver_name,
      sender_address,
      receiver_address,
      receiver_email,
      eta,
      "Paid", // or "Pending"
    ]
  );

  console.log("INVOICE INSERT SUCCESS:", result.rows[0]);
} catch (invoiceErr) {
  console.error("INVOICE ERROR:", invoiceErr);
}
    // =========================
    // 3. SEND EMAIL (SAFE)
    // =========================
    console.log("EMAIL VALUE:", receiver_email);

    if (
      receiver_email &&
      typeof receiver_email === "string" &&
      receiver_email.includes("@")
    ) {
      try {
        console.log("SENDING EMAIL...");

        await sendEmail(
          receiver_email,
          "📦 Your Package Has Been Created",
          `
Hello ${receiver_name},

Your package has been successfully created.

Tracking Number: ${newPackage.tracking_number}
Status: Pending
ETA: ${eta || "Not set"}

You can track your package anytime using your tracking number.

Thank you.
          `
        );

        console.log("EMAIL SENT SUCCESSFULLY");
      } catch (emailErr) {
        console.error("EMAIL FAILED:", emailErr);
      }
    }

    return res.json({
      success: true,
      package: newPackage,
    });
  } catch (error) {
    console.error("CREATE PACKAGE ERROR:", error);
    return res.status(500).json({
      error: "Package creation failed",
    });
  }
};

// =====================================================
// GET ALL PACKAGES
// =====================================================
export const handleGetAllPackages: RequestHandler = async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM packages
      ORDER BY created_at DESC
    `);

    return res.json({
      packages: result.rows,
    });
  } catch (error) {
    console.error("GET PACKAGES ERROR:", error);
    return res.status(500).json({
      error: "Failed to fetch packages",
    });
  }
};

// =====================================================
// TRACK PACKAGE
// =====================================================
export const handleTrackPackage: RequestHandler = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const result = await pool.query(
      `
      SELECT * FROM packages
      WHERE tracking_number = $1
      LIMIT 1
      `,
      [trackingNumber]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        error: "Package not found",
      });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("TRACK ERROR:", error);
    return res.status(500).json({
      error: "Tracking failed",
    });
  }
};

// =====================================================
// UPDATE STATUS
// =====================================================
export const handleUpdatePackageStatus: RequestHandler = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { status, location } = req.body;

    const result = await pool.query(
      `
      UPDATE packages
      SET status = $1,
          current_location = $2,
          updated_at = NOW()
      WHERE tracking_number = $3
      RETURNING *
      `,
      [status, location, trackingNumber]
    );

    return res.json({
      success: true,
      package: result.rows[0],
    });
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    return res.status(500).json({
      error: "Update failed",
    });
  }
};

// =====================================================
// DELETE PACKAGE
// =====================================================
export const handleDeletePackage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM packages
      WHERE id = $1
      `,
      [id]
    );

    return res.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({
      error: "Delete failed",
    });
  }
};

// =====================================================
// UPDATE PACKAGE
// =====================================================
export const handleUpdatePackage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sender_name,
      receiver_name,
      receiver_address,
      status,
      current_location,
      eta,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE packages
      SET sender_name = COALESCE($1, sender_name),
          receiver_name = COALESCE($2, receiver_name),
          receiver_address = COALESCE($3, receiver_address),
          status = COALESCE($4, status),
          current_location = COALESCE($5, current_location),
          eta = COALESCE($6, eta),
          updated_at = NOW()
      WHERE id = $7
      RETURNING *
      `,
      [
        sender_name,
        receiver_name,
        receiver_address,
        status,
        current_location,
        eta,
        id,
      ]
    );

    return res.json({
      success: true,
      package: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return res.status(500).json({
      error: "Update failed",
    });
  }
};