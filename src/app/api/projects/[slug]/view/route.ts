import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const project = await prisma.project.upsert({
      where: { slug },
      update: { viewCount: { increment: 1 } },
      create: { slug, viewCount: 1 },
    });
    return NextResponse.json({ viewCount: project.viewCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update view count" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const project = await prisma.project.findUnique({ where: { slug } });
    return NextResponse.json({ viewCount: project?.viewCount ?? 0 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch view count" }, { status: 500 });
  }
}
