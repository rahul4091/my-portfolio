import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_BODY_BYTES = 10 * 1024;
const NAME_MAX = 100;
const EMAIL_MAX = 200;
const MESSAGE_MAX = 2000;

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const globalForRateLimit = globalThis;
const submissions = globalForRateLimit.contactSubmissions ?? new Map();
globalForRateLimit.contactSubmissions = submissions;

function clientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip) {
  const now = Date.now();
  for (const [key, timestamps] of submissions) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) submissions.delete(key);
    else submissions.set(key, recent);
  }

  const recent = submissions.get(ip) ?? [];
  if (recent.length >= RATE_LIMIT_MAX) return true;

  submissions.set(ip, [...recent, now]);
  return false;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }
  if (!process.env.CONTACT_EMAIL) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { name, email, message } = body ?? {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const safeName = name.replace(/[\r\n]+/g, " ").trim().slice(0, NAME_MAX);
    const safeEmail = email.replace(/[\r\n]+/g, "").trim().slice(0, EMAIL_MAX);
    const safeMessage = message.trim().slice(0, MESSAGE_MAX);

    if (!safeName || !safeEmail || !safeMessage) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(safeEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    await prisma.message.create({
      data: {
        name: safeName,
        email: safeEmail,
        message: safeMessage,
      },
    });

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      replyTo: safeEmail,
      subject: `New message from ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #111;">
          <h2>New Contact Form Message</h2>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
          <h3>Message:</h3>
          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(safeMessage)}</div>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 24px;" />
          <p style="color: #aaa; font-size: 12px;">Sent from your portfolio contact form</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
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
