import { NextResponse } from "next/server";
import { findProjectBySlug, handleApiError } from "@/lib/api";

export async function GET(_req, { params }) {
  const { slug } = await params;
  try {
    const project = await findProjectBySlug(slug);
    return NextResponse.json({ viewCount: project?.viewCount ?? 0 });
  } catch (error) {
    return handleApiError(error, "Failed to fetch view count");
  }
}
