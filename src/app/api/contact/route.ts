import { NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ContactBody>;
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("Contact form submission (RESEND_API_KEY not set):", {
      name,
      email,
      subject,
      message,
    });
    return NextResponse.json({ success: true });
  }

  try {
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Portfolio Contact <noreply@alejandrosoza.ca>",
      to: [process.env.ADMIN_EMAIL || "soza.ale@gmail.com"],
      subject: `[alejandrosoza.ca] ${subject} — from ${name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f0ece4;">
          <div style="background: #0a0a0a; padding: 32px 40px;">
            <p style="margin: 0; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #f0ece4;">
              Alejandro Soza Portfolio
            </p>
            <p style="margin: 8px 0 0; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #c9a96e;">
              New Contact Form Submission
            </p>
          </div>
          <div style="padding: 32px 40px; background: #ffffff;">
            <p style="margin: 0 0 16px; font-size: 13px; color: #1a1a1a;">
              <strong>Name:</strong> ${escapeHtml(name)}
            </p>
            <p style="margin: 0 0 16px; font-size: 13px; color: #1a1a1a;">
              <strong>Email:</strong> ${escapeHtml(email)}
            </p>
            <p style="margin: 0 0 16px; font-size: 13px; color: #1a1a1a;">
              <strong>Subject:</strong> ${escapeHtml(subject)}
            </p>
            <p style="margin: 0 0 8px; font-size: 13px; color: #1a1a1a;"><strong>Message:</strong></p>
            <p style="margin: 0; font-size: 13px; line-height: 1.7; color: #333; white-space: pre-line;">${escapeHtml(message)}</p>
          </div>
          <div style="padding: 20px 40px; background: #0a0a0a;">
            <p style="margin: 0; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(240,236,228,0.4);">
              Sent from alejandrosoza.ca contact form
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
