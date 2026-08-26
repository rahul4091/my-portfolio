import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export function jsonError(message, status) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error, message, status = 500) {
  console.error(error);
  return jsonError(message, status);
}

export function findProjectBySlug(slug) {
  return prisma.project.findUnique({ where: { slug } });
}
