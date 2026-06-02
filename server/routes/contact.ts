import { RequestHandler } from "express";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handleContact: RequestHandler = async (
  req,
  res
) => {
  const {
    name,
    email,
    subject,
    message,
  } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error:
        "Name, email and message are required",
    });
  }

  try {
    await resend.emails.send({
      from:
        "Nexus Support <support@nexusglog.com>",
      to:
        process.env.CONTACT_EMAIL ||
        "support@nexusglog.com",

      replyTo: email,

      subject:
        subject ||
        `New Contact Message from ${name}`,

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
      message:
        "Message sent successfully",
    });
  } catch (err) {
    console.error(
      "CONTACT EMAIL ERROR:",
      err
    );

    return res.status(500).json({
      error: "Failed to send email",
    });
  }
};