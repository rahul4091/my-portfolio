import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }
  if (!process.env.CONTACT_EMAIL) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const safeName    = String(name).replace(/<[^>]*>/g, "").trim().slice(0, 100);
    const safeEmail   = String(email).trim().slice(0, 200);
    const safeMessage = String(message).replace(/<[^>]*>/g, "").trim().slice(0, 2000);

    // ✅ Save to Neon database first
    await prisma.message.create({
      data: {
        name: safeName,
        email: safeEmail,
        message: safeMessage,
      },
    });

    // ✅ Then send email via Resend
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      replyTo: safeEmail,
      subject: `New message from ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #111;">
          <h2>New Contact Form Message</h2>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <h3>Message:</h3>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; line-height: 1.7; white-space: pre-wrap;">${safeMessage}</div>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;" />
          <p style="color: #aaa; font-size: 12px;">Sent from your portfolio contact form</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      // Message already saved to DB so don't fail completely
      return NextResponse.json(
        { success: true, message: "Message saved! Email delivery may be delayed." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
