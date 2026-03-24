import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import ViewCounter from "@/components/ViewCounter";

async function getReadme(githubUrl: string): Promise<string | null> {
  try {
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;

    const [, owner, repo] = match;

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: `${project.name} — Rahul`,
    description: project.desc,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const rawReadme = await getReadme(project.github);

  // Remove sections we don't want to show on the portfolio
  const hiddenSections = ["Local Setup", "Environment Variables", "Author"];
  const readme = rawReadme
    ? rawReadme
        .split(/(?=^## )/m)
        .filter((section) => !hiddenSections.some((h) => section.startsWith(`## ${h}`)))
        .join("")
        .trim()
    : null;

  return (
    <main className="min-h-screen bg-white dark:bg-black py-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors mb-10"
        >
          ← Back to projects
        </Link>

        {/* Gradient */}
        <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${project.gradient} mb-8`} />

        {/* Title + Views */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <ViewCounter slug={slug} />
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 mb-10">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            GitHub
          </a>

          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Live Demo
            </a>
          )}
        </div>

        <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />

        {/* README */}
        {readme && (
          <>
            <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold">README</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                  from GitHub
                </span>
              </div>

              <div className="prose prose-zinc dark:prose-invert max-w-none prose-sm">
                <ReactMarkdown>{readme}</ReactMarkdown>
              </div>
            </section>
          </>
        )}

        <hr className="border-zinc-200 dark:border-zinc-800 mb-8" />

        {/* Footer Links */}
        <div className="flex justify-between items-center">
          <Link
            href="/#projects"
            className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            All projects
          </Link>

          <Link
            href="/#contact"
            className="text-sm px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Contact me
          </Link>
        </div>

      </div>
    </main>
  );
}
