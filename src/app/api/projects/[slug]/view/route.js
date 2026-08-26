import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VIEW_COOLDOWN_MS = 60 * 60 * 1000;

const globalForViews = globalThis;
const recentViews = globalForViews.recentProjectViews ?? new Map();
globalForViews.recentProjectViews = recentViews;

function clientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function alreadyCounted(req, slug) {
  const now = Date.now();
  for (const [key, seenAt] of recentViews) {
    if (now - seenAt > VIEW_COOLDOWN_MS) recentViews.delete(key);
  }

  const key = `${clientIp(req)}:${slug}`;
  if (recentViews.has(key)) return true;

  recentViews.set(key, now);
  return false;
}

export async function GET(_req, { params }) {
  const { slug } = await params;
  try {
    const project = await prisma.project.findUnique({ where: { slug } });
    return NextResponse.json({ viewCount: project?.viewCount ?? 0 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch view count" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  const { slug } = await params;

  try {
    if (alreadyCounted(req, slug)) {
      const project = await prisma.project.findUnique({ where: { slug } });
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json({ viewCount: project.viewCount });
    }

    const project = await prisma.project.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });

    return NextResponse.json({ viewCount: project.viewCount });
  } catch (error) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
