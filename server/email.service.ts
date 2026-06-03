import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  to: string,
  subject: string,
  message: string
) {
  if (!to) return;

  return await resend.emails.send({
    from: "Nexus Support <support@app.nexusglog.com>",
    to: [to],
    subject,
    text: message,
  });
}