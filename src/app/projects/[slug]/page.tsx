import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import ViewCounter from "@/components/ViewCounter";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";

async function getReadme(githubUrl: string): Promise<string | null> {
  try {
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    const [, owner, repo] = match;
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
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
  return { title: `${project.name} — Rahul`, description: project.desc };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const dbProject = await prisma.project.findUnique({ where: { slug } });
  const githubUrl = dbProject?.githubUrl ?? project.github;

  const rawReadme = await getReadme(githubUrl);
  const hiddenSections = ["Local Setup", "Environment Variables", "Author"];
  const readme = rawReadme
    ? rawReadme
        .split(/(?=^## )/m)
        .filter((s) => !s.startsWith("# "))
        .filter((s) => !hiddenSections.some((h) => s.startsWith(`## ${h}`)))
        .join("")
        .trim()
    : null;

  return (
    <main className="min-h-screen bg-white dark:bg-black py-16 px-6">
      <div className="max-w-3xl mx-auto">

        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors mb-10"
        >
          Back to projects
        </Link>

        <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${project.gradient} mb-8`} />

        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <ViewCounter slug={slug} />
        </div>

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

        <div className="flex gap-3 mb-10">
          <a
            href={githubUrl}
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

        {readme ? (
          <article className="mb-12 prose prose-zinc dark:prose-invert max-w-none
            prose-h1:hidden
            prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4
            prose-h2:border-b prose-h2:border-zinc-200 dark:prose-h2:border-zinc-800 prose-h2:pb-2
            prose-h3:text-base prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-sm
            prose-li:text-zinc-600 dark:prose-li:text-zinc-400 prose-li:text-sm
            prose-ul:my-3 prose-ol:my-3
            prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800
            prose-code:text-yellow-600 dark:prose-code:text-yellow-400
            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
            prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800
            prose-pre:rounded-xl prose-pre:p-5 prose-pre:my-6
            prose-a:text-yellow-500 hover:prose-a:text-yellow-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-zinc-800 dark:prose-strong:text-zinc-200
            prose-hr:border-zinc-100 dark:prose-hr:border-zinc-800
            prose-table:text-sm
            prose-th:bg-zinc-50 dark:prose-th:bg-zinc-900 prose-th:px-4 prose-th:py-2
            prose-th:border prose-th:border-zinc-200 dark:prose-th:border-zinc-800
            prose-td:px-4 prose-td:py-2
            prose-td:border prose-td:border-zinc-100 dark:prose-td:border-zinc-800
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
          </article>
        ) : (
          <div className="text-center py-12 text-zinc-400 text-sm">
            No README found for this project.
          </div>
        )}

        <hr className="border-zinc-200 dark:border-zinc-800 mb-8" />

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
