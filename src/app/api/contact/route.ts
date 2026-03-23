import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Guard: check env vars are set before doing anything
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY environment variable");
    return NextResponse.json(
      { error: "Server configuration error. Please try again later." },
      { status: 500 }
    );
  }

  if (!process.env.CONTACT_EMAIL) {
    console.error("Missing CONTACT_EMAIL environment variable");
    return NextResponse.json(
      { error: "Server configuration error. Please try again later." },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Validate all fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Sanitise inputs — strip HTML tags to prevent injection
    const safeName    = String(name).replace(/<[^>]*>/g, "").trim().slice(0, 100);
    const safeEmail   = String(email).trim().slice(0, 200);
    const safeMessage = String(message).replace(/<[^>]*>/g, "").trim().slice(0, 2000);

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      replyTo: safeEmail,
      subject: `New message from ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #111;">
          <h2 style="margin-bottom: 4px;">New Contact Form Message</h2>
          <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 20px;" />

          <p style="margin: 8px 0;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> ${safeEmail}</p>

          <h3 style="margin-top: 24px; margin-bottom: 8px;">Message:</h3>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; line-height: 1.7; white-space: pre-wrap;">
${safeMessage}
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin-top: 28px;" />
          <p style="color: #aaa; font-size: 12px;">Sent from your portfolio contact form</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent! I'll get back to you soon." },
      { status: 200 }
    );

  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
