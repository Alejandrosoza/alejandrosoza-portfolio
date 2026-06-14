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
      to: process.env.ADMIN_EMAIL!,
      subject: `[Portfolio] ${subject} — from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #1a1a1a;">
          <h2 style="font-weight: 600;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
