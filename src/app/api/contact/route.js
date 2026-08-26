import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api";

export async function POST(req) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Contact API: RESEND_API_KEY is not set");
    return jsonError("Server configuration error.", 500);
  }
  if (!process.env.CONTACT_EMAIL) {
    console.error("Contact API: CONTACT_EMAIL is not set");
    return jsonError("Server configuration error.", 500);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  let body;
  try {
    body = await req.json();
  } catch (err) {
    console.error("Contact API: invalid JSON body:", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const { name, email, message } = body ?? {};

    if (!name || !email || !message) {
      return jsonError("All fields are required", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return jsonError("Please enter a valid email address", 400);
    }

    const safeName    = String(name).replace(/<[^>]*>/g, "").trim().slice(0, 100);
    const safeEmail   = String(email).trim().slice(0, 200);
    const safeMessage = String(message).replace(/<[^>]*>/g, "").trim().slice(0, 2000);

    try {
      await prisma.message.create({
        data: {
          name: safeName,
          email: safeEmail,
          message: safeMessage,
        },
      });
    } catch (err) {
      console.error("Contact API: failed to save message to the database:", err);
      return NextResponse.json(
        { error: "Could not save your message. Please try again later." },
        { status: 500 }
      );
    }

    let error;
    try {
      ({ error } = await resend.emails.send({
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
      }));
    } catch (err) {
      console.error("Contact API: Resend request failed:", err);
      return NextResponse.json(
        { success: true, message: "Message saved! Email delivery may be delayed." },
        { status: 200 }
      );
    }

    if (error) {
      console.error("Contact API: Resend rejected the email:", error);
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
    return jsonError("Something went wrong.", 500);
  }
}
