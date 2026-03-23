import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.name} — Rahul`, description: project.desc };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-black py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors mb-10">
          ← Back to projects
        </Link>
        <div className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${project.gradient} mb-8`} />
        <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tech.map((t) => (
            <span key={t} className="text-xs px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">{t}</span>
          ))}
        </div>
        <div className="flex gap-3 mb-10">
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">GitHub</a>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">Live Demo ↗</a>
          )}
        </div>
        <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">About this project</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{project.longDesc}</p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Key features</h2>
          <ul className="space-y-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                <span className="text-yellow-400 mt-0.5">✦</span>{feature}
              </li>
            ))}
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">What I learned</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{project.challenges}</p>
        </section>
        <hr className="border-zinc-200 dark:border-zinc-800 mb-8" />
        <div className="flex justify-between items-center">
          <Link href="/#projects" className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">← All projects</Link>
          <Link href="/#contact" className="text-sm px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">Contact me →</Link>
        </div>
      </div>
    </main>
  );
}
