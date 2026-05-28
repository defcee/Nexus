import { RequestHandler } from "express";
import { pool } from "../db";

type PackageStatus =
  | "Pending"
  | "Picked Up"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered";

const generateTrackingNumber = (): string => {
  return "NEX" + Math.random().toString().slice(2, 12);
};

// =====================================================
// CREATE PACKAGE
// =====================================================
export const handleCreatePackage: RequestHandler = async (req, res) => {
  try {
    const sender = req.body.senderName || req.body.sender_name;
    const receiver = req.body.receiverName || req.body.receiver_name;
    const address =
      req.body.receiverAddress || req.body.receiver_address;
    const phone = req.body.receiverPhone || req.body.receiver_phone;
    const type = req.body.packageType || req.body.package_type;
    const weight = req.body.weight;
    const price = req.body.price;

    if (
      !sender ||
      !receiver ||
      !address ||
      !phone ||
      !type ||
      !weight ||
      !price
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required" });
    }

    const trackingNumber = generateTrackingNumber();

    const eta = new Date();
    eta.setDate(eta.getDate() + 5);

    const result = await pool.query(
      `
      INSERT INTO packages (
        tracking_number,
        sender_name,
        receiver_name,
        receiver_address,
        receiver_phone,
        package_type,
        weight,
        price,
        status,
        current_location,
        eta
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
      `,
      [
        trackingNumber,
        sender,
        receiver,
        address,
        phone,
        type,
        parseFloat(weight),
        parseFloat(price),
        "Pending",
        "Warehouse",
        eta,
      ]
    );

    return res.status(201).json({
      success: true,
      package: result.rows[0],
    });
  } catch (err) {
    console.error("CREATE PACKAGE ERROR:", err);
    return res
      .status(500)
      .json({ error: "Failed to create package" });
  }
};

// =====================================================
// GET ALL PACKAGES
// =====================================================
export const handleGetAllPackages: RequestHandler = async (
  _req,
  res
) => {
  try {
    const result = await pool.query(`
      SELECT * FROM packages
      ORDER BY id DESC
    `);

    const packages = result.rows.map((p) => ({
      id: p.id,
      tracking_number: p.tracking_number,
      trackingNumber: p.tracking_number,
      sender_name: p.sender_name,
      receiver_name: p.receiver_name,
      receiver_address: p.receiver_address,
      receiver_phone: p.receiver_phone,
      package_type: p.package_type,
      status: p.status,
      current_location: p.current_location,
      weight: p.weight,
      price: p.price,
      eta: p.eta,
    }));

    return res.json({ packages });
  } catch (err) {
    console.error("GET PACKAGES ERROR:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch packages" });
  }
};

// =====================================================
// TRACK PACKAGE
// =====================================================
export const handleTrackPackage: RequestHandler = async (
  req,
  res
) => {
  try {
    const { trackingNumber } = req.params;

    const result = await pool.query(
      `
      SELECT * FROM packages
      WHERE UPPER(tracking_number) = UPPER($1)
      LIMIT 1
      `,
      [trackingNumber]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        error: "Package not found",
      });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("TRACK PACKAGE ERROR:", err);

    return res.status(500).json({
      error: "Tracking failed",
    });
  }
};

// =====================================================
// UPDATE PACKAGE (FULL EDIT)
// =====================================================
export const handleUpdatePackage: RequestHandler = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      sender_name,
      receiver_name,
      receiver_address,
      receiver_phone,
      package_type,
      weight,
      price,
      status,
      current_location,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE packages
      SET
        sender_name = $1,
        receiver_name = $2,
        receiver_address = $3,
        receiver_phone = $4,
        package_type = $5,
        weight = $6,
        price = $7,
        status = $8,
        current_location = $9
      WHERE id = $10
      RETURNING *
      `,
      [
        sender_name,
        receiver_name,
        receiver_address,
        receiver_phone,
        package_type,
        parseFloat(weight),
        parseFloat(price),
        status,
        current_location,
        id,
      ]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        error: "Package not found",
      });
    }

    return res.json({
      success: true,
      package: result.rows[0],
    });
  } catch (err) {
    console.error("UPDATE PACKAGE ERROR:", err);

    return res.status(500).json({
      error: "Failed to update package",
    });
  }
};

// =====================================================
// UPDATE PACKAGE STATUS
// =====================================================
export const handleUpdatePackageStatus: RequestHandler =
  async (req, res) => {
    try {
      const { trackingNumber } = req.params;
      const { status, location } = req.body;

      if (!status || !location) {
        return res.status(400).json({
          error: "Missing fields",
        });
      }

      const result = await pool.query(
        `
        UPDATE packages
        SET
          status = $1,
          current_location = $2
        WHERE tracking_number = $3
        RETURNING *
        `,
        [status, location, trackingNumber]
      );

      if (!result.rows[0]) {
        return res.status(404).json({
          error: "Package not found",
        });
      }

      return res.json({
        success: true,
        package: result.rows[0],
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        error: "Update failed",
      });
    }
  };

// =====================================================
// DELETE PACKAGE
// =====================================================
export const handleDeletePackage: RequestHandler = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM packages
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        error: "Not found",
      });
    }

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error("DELETE PACKAGE ERROR:", err);

    return res.status(500).json({
      error: "Delete failed",
    });
  }
};