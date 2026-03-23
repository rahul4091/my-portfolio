"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { projects } from "@/lib/projects";

export default function Projects() {
  return (
    <section className="py-24 px-6 bg-white dark:bg-black" id="projects">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-xs font-semibold tracking-widest uppercase text-yellow-500 dark:text-yellow-400 mb-3">What I&apos;ve built</p>
          <h2 className="text-3xl md:text-4xl font-bold">My Projects</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div key={project.slug} className="group rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }}>
              <div className={`h-1 w-full bg-gradient-to-r ${project.gradient}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">{project.name}</h3>
                  {project.live && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium shrink-0 ml-2">Live</span>
                  )}
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">{project.desc}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Link href={`/projects/${project.slug}`} className="flex-1 text-center text-sm font-semibold py-2 px-4 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">View Details →</Link>
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-sm font-medium py-2 px-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">GitHub</a>
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-sm font-medium py-2 px-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">Live ↗</a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
