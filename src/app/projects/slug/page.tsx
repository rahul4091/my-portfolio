import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import type { Metadata } from "next";
import Link from "next/link";

// ✅ Tell Next.js which slugs exist at build time → pre-renders as static HTML
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// ✅ Generate unique SEO metadata per project page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};

  return {
    title: `${project.name} — Rahul`,
    description: project.desc,
  };
}

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  // Find project matching the URL slug
  const project = projects.find((p) => p.slug === params.slug);

  // ✅ If slug doesn't match any project → show 404 page
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-black py-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Back button */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors mb-10"
        >
          ← Back to projects
        </Link>

        {/* Gradient bar */}
        <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${project.gradient} mb-8`} />

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">{project.name}</h1>

        {/* Tech stack badges */}
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
            </svg>
            View on GitHub
          </a>

          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Live Demo
            </a>
          )}
        </div>

        {/* Divider */}
        <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />

        {/* About section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">About this project</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {project.longDesc}
          </p>
        </section>

        {/* Features */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Key features</h2>
          <ul className="space-y-2">
            {project.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400 text-sm"
              >
                <span className="text-yellow-400 mt-0.5">✦</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>

        {/* Challenges */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">What I learned</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {project.challenges}
          </p>
        </section>

        {/* Bottom nav */}
        <hr className="border-zinc-200 dark:border-zinc-800 mb-8" />
        <div className="flex justify-between items-center">
          <Link
            href="/#projects"
            className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            ← All projects
          </Link>
          <Link
            href="/#contact"
            className="text-sm px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Contact me →
          </Link>
        </div>

      </div>
    </main>
  );
}
