import { RequestHandler } from "express";
import { pool } from "../db";

const generateTrackingNumber = (): string => {
  return "NEX" + Math.random().toString().slice(2, 12);
};

export const handleCreatePackage: RequestHandler = async (req, res) => {
  try {
    const {
      senderName,
      receiverName,
      receiverAddress,
      receiverPhone,
      packageType,
      weight,
      price,
    } = req.body;

    if (
      !senderName ||
      !receiverName ||
      !receiverAddress ||
      !receiverPhone ||
      !packageType ||
      !weight ||
      !price
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const trackingNumber = generateTrackingNumber();

    const [result] = await pool.query(
      `INSERT INTO packages (trackingNumber, senderName, receiverName, receiverAddress, receiverPhone, packageType, weight, price, status, currentLocation, eta)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trackingNumber,
        senderName,
        receiverName,
        receiverAddress,
        receiverPhone,
        packageType,
        parseFloat(weight),
        parseFloat(price),
        "Pending",
        "Warehouse",
        null,
      ]
    );

    const insertId = (result as any).insertId;

    // Insert initial history
    await pool.query(
      `INSERT INTO package_history (trackingNumber, location, status) VALUES (?, ?, ?)`,
      [trackingNumber, "Warehouse", "Pending"]
    );

    const [rows] = await pool.query("SELECT * FROM packages WHERE id = ?", [insertId]);
    const pkg = Array.isArray(rows) ? rows[0] : rows;

    res.status(201).json({ message: "Package created successfully", package: pkg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleTrackPackage: RequestHandler = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const [rows] = await pool.query("SELECT * FROM packages WHERE trackingNumber = ?", [
      trackingNumber,
    ]);

    const pkg = Array.isArray(rows) ? rows[0] : rows;

    if (!pkg) {
      return res.status(404).json({ error: "Tracking number not found" });
    }

    const [historyRows] = await pool.query(
      "SELECT * FROM package_history WHERE trackingNumber = ? ORDER BY updatedAt ASC",
      [trackingNumber]
    );

    res.json({
      trackingNumber: pkg.trackingNumber,
      sender: pkg.senderName,
      receiver: pkg.receiverName,
      status: pkg.status,
      eta: pkg.eta,
      currentLocation: pkg.currentLocation,
      weight: `${pkg.weight} kg`,
      price: `$${pkg.price}`,
      history: Array.isArray(historyRows) ? historyRows : [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleUpdatePackageStatus: RequestHandler = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const { status, location } = req.body;

    const [rows] = await pool.query("SELECT * FROM packages WHERE trackingNumber = ?", [
      trackingNumber,
    ]);

    const pkg = Array.isArray(rows) ? rows[0] : rows;
    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }

    await pool.query("UPDATE packages SET status = ?, currentLocation = ? WHERE trackingNumber = ?", [
      status,
      location,
      trackingNumber,
    ]);

    await pool.query(
      "INSERT INTO package_history (trackingNumber, location, status) VALUES (?, ?, ?)",
      [trackingNumber, location, status]
    );

    const [updatedRows] = await pool.query("SELECT * FROM packages WHERE trackingNumber = ?", [
      trackingNumber,
    ]);

    res.json({ message: "Package status updated", package: Array.isArray(updatedRows) ? updatedRows[0] : updatedRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetAllPackages: RequestHandler = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, trackingNumber, senderName, receiverName, status FROM packages ORDER BY createdAt DESC"
    );

    res.json({ packages: Array.isArray(rows) ? rows : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleDeletePackage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM packages WHERE id = ?", [parseInt(id, 10)]);

    const affectedRows = (result as any).affectedRows || 0;
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Optionally delete related history
    await pool.query("DELETE FROM package_history WHERE trackingNumber NOT IN (SELECT trackingNumber FROM packages)");

    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
