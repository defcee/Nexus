import { RequestHandler } from "express";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// =====================================================
// SEND EMAIL
// =====================================================
export const handleSendEmail: RequestHandler = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        error: "Missing email fields",
      });
    }

    const result = await resend.emails.send({
      from: "Nexus Support <support@nexusglog.com>", // ✅ FIXED DOMAIN
      to: Array.isArray(to) ? to : [to],
      subject,
      text: message,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return res.status(500).json({
      error: "Email failed to send",
    });
  }
};