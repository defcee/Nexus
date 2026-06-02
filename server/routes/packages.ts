import { RequestHandler } from "express";
import { pool } from "../db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
// CREATE PACKAGE (WITH EMAIL NOTIFICATION)
// =====================================================
export const handleCreatePackage: RequestHandler = async (req, res) => {
  try {
    const sender = req.body.sender_name || req.body.senderName;
    const receiver = req.body.receiver_name || req.body.receiverName;
    const address = req.body.receiver_address || req.body.receiverAddress;
    const phone = req.body.receiver_phone || req.body.receiverPhone;
    const type = req.body.package_type || req.body.packageType;
    const weight = req.body.weight;
    const price = req.body.price;
    const recipient_email = req.body.recipient_email; // ✅ NEW

    if (
      !sender ||
      !receiver ||
      !address ||
      !phone ||
      !type ||
      !weight ||
      !price ||
      !recipient_email
    ) {
      return res.status(400).json({
        error: "All fields including recipient email are required",
      });
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
        eta,
        recipient_email
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
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
        recipient_email,
      ]
    );

    const newPackage = result.rows[0];

    // =====================================================
    // EMAIL NOTIFICATION (RESEND)
    // =====================================================
    try {
      await resend.emails.send({
        from: `Nexus Logistics <${process.env.FROM_EMAIL}>`,
        to: recipient_email,
        subject: `📦 Your Package Has Been Created - ${trackingNumber}`,
        html: `
          <div style="font-family:Arial;padding:20px">
            <h2>Package Created Successfully</h2>

            <p><b>Tracking Number:</b> ${trackingNumber}</p>
            <p><b>Sender:</b> ${sender}</p>
            <p><b>Receiver:</b> ${receiver}</p>
            <p><b>Package Type:</b> ${type}</p>
            <p><b>Status:</b> Pending</p>
            <p><b>ETA:</b> ${eta.toDateString()}</p>

            <hr />
            <p style="color:gray;font-size:12px">
              Nexus Logistics - Automated Notification
            </p>
          </div>
        `,
      });

      console.log("✅ Email sent to:", recipient_email);
    } catch (emailErr) {
      console.error("❌ EMAIL ERROR:", emailErr);
    }

    return res.status(201).json({
      success: true,
      package: newPackage,
    });
  } catch (err) {
    console.error("CREATE PACKAGE ERROR:", err);
    return res.status(500).json({
      error: "Failed to create package",
    });
  }
};

// =====================================================
// GET ALL PACKAGES
// =====================================================
export const handleGetAllPackages: RequestHandler = async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM packages ORDER BY id DESC
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
      recipient_email: p.recipient_email, // ✅ included
    }));

    return res.json({ packages });
  } catch (err) {
    console.error("GET PACKAGES ERROR:", err);
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
    console.error("TRACK ERROR:", err);
    return res.status(500).json({
      error: "Tracking failed",
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
      return res.status(404).json({ error: "Package not found" });
    }

    return res.json({
      success: true,
      package: result.rows[0],
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({
      error: "Failed to update package",
    });
  }
};

// =====================================================
// UPDATE STATUS
// =====================================================
export const handleUpdatePackageStatus: RequestHandler = async (
  req,
  res
) => {
  try {
    const { trackingNumber } = req.params;
    const { status, location } = req.body;

    const result = await pool.query(
      `
      UPDATE packages
      SET status = $1,
          current_location = $2
      WHERE tracking_number = $3
      RETURNING *
      `,
      [status, location, trackingNumber]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Package not found" });
    }

    return res.json({
      success: true,
      package: result.rows[0],
    });
  } catch (err) {
    console.error("STATUS ERROR:", err);
    return res.status(500).json({ error: "Update failed" });
  }
};

// =====================================================
// DELETE PACKAGE
// =====================================================
export const handleDeletePackage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM packages WHERE id = $1 RETURNING *
      `,
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ error: "Delete failed" });
  }
};