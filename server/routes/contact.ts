import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handleContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const data = await resend.emails.send({
      from: "Nexus Support <support@app.nexusglog.com>",
      to: ["support@nexusglog.com"],
      subject: subject || "New Contact Message",
      replyTo: email,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}
      `,
    });

    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("RESEND ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};