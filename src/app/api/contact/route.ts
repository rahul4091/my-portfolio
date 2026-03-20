import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // use this until you verify a domain
      to: process.env.CONTACT_EMAIL!,                   // your email — set in .env.local
      replyTo: email,                                    // reply goes to the person who contacted you
      subject: `New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #111;">New Contact Form Message</h2>
          <hr style="border: none; border-top: 1px solid #eee;" />

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>

          <h3 style="margin-top: 24px;">Message:</h3>
          <p style="background: #f9f9f9; padding: 16px; border-radius: 8px; line-height: 1.6;">
            ${message}
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;" />
          <p style="color: #999; font-size: 12px;">
            Sent from your portfolio contact form
          </p>
        </div>
      `,
    });

    // If Resend returned an error
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully!" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
