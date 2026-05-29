import { RequestHandler } from "express";
import { transporter } from "../mailer";

export const handleContact: RequestHandler = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Name, email and message are required",
    });
  }

  try {
    await transporter.sendMail({
      from: `"Nexus Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: subject || `New Contact Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject || "No subject"}

Message:
${message}
      `,
    });

    return res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (err) {
    console.error("CONTACT EMAIL ERROR:", err);

    return res.status(500).json({
      error: "Failed to send email",
    });
  }
};