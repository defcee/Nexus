import { RequestHandler } from "express";
import { pool } from "../db";

// =====================================================
// CREATE PACKAGE
// =====================================================
export const handleCreatePackage: RequestHandler = async (req, res) => {
  try {
    const {
      sender_name,
      sender_address,
      receiver_name,
      receiver_address,
      receiver_phone,
      package_type,
      weight,
      price,
      eta, // ✅ MANUAL ETA ADDED
    } = req.body;

    const trackingNumber =
      "NEX" + Date.now() + Math.floor(Math.random() * 9999);

    const result = await pool.query(
      `
      INSERT INTO packages (
        tracking_number,
        sender_name,
        sender_address,
        receiver_name,
        receiver_address,
        receiver_phone,
        package_type,
        weight,
        price,
        eta,
        status,
        current_location,
        created_at,
        updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Pending','Warehouse',NOW(),NOW())
      RETURNING *
      `,
      [
        trackingNumber,
        sender_name,
        sender_address,
        receiver_name,
        receiver_address,
        receiver_phone,
        package_type,
        weight,
        price,
        eta || null, // ✅ manual ETA support
      ]
    );

    return res.status(201).json({
      success: true,
      package: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE PACKAGE ERROR:", error);
    return res.status(500).json({ error: "Failed to create package" });
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
    return res.status(500).json({ error: "Failed to fetch packages" });
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

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Package not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "Tracking failed" });
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
    return res.status(500).json({ error: "Update failed" });
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
    return res.status(500).json({ error: "Delete failed" });
  }
};

// =====================================================
// UPDATE PACKAGE (FULL EDIT)
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
    return res.status(500).json({ error: "Update failed" });
  }
};