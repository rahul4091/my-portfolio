
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Rahul",
  description: "Learn more about Rahul, a Next.js developer from India.",
};

export default function About() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">About Page</h1>
    </div>
  );
}
