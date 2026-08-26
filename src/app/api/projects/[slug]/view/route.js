import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, findProjectBySlug, handleApiError } from "@/lib/api";

export async function GET(_req, { params }) {
  const { slug } = await params;
  try {
    const project = await findProjectBySlug(slug);
    if (!project) {
      return jsonError("Project not found", 404);
    }
    return NextResponse.json({ viewCount: project.viewCount });
  } catch (error) {
    return handleApiError(error, `View count API: failed to fetch views for "${slug}":`, "Failed to fetch view count");
  }
}

export async function POST(_req, { params }) {
  const { slug } = await params;
  try {
    const project = await prisma.project.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });
    return NextResponse.json({ viewCount: project.viewCount });
  } catch (error) {
    if (error?.code === "P2025") {
      return jsonError("Project not found", 404);
    }
    console.error(`View count API: failed to increment views for "${slug}":`, error);
    return jsonError("Failed to update view count", 500);
  }
}
