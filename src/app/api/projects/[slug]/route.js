import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req, { params }) {
  const { slug } = await params;

  try {
    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error(`Projects API: failed to fetch project "${slug}":`, error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}
