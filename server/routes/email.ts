import { RequestHandler } from "express";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// =====================================================
// SEND EMAIL (CLEAN VERSION)
// =====================================================
export const handleSendEmail: RequestHandler = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    // ✅ VALIDATION
    if (!to || !subject || !message) {
      return res.status(400).json({
        error: "Missing email fields (to, subject, message)",
      });
    }

    // Normalize recipients
    const recipients = Array.isArray(to) ? to : [to];

    // Send email via Resend
    const result = await resend.emails.send({
      from: "Nexus Support <support@nexusglog.com>",
      to: recipients,
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