"use client";
import { motion } from "framer-motion";

const projects = [
  {
    name: "Portfolio Website",
    desc: "A personal portfolio built with Next.js and Tailwind CSS showcasing my skills and projects.",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/rahul4091/my-portfolio",
    live: "https://my-portfolio-pearl-eight-ki13whxvso.vercel.app",
    gradient: "from-yellow-400 to-orange-400",
  },
  {
    name: "Library Management System",
    desc: "A full backend system to manage books, members and borrowing built with Node.js, Express and MongoDB.",
    tech: ["Node.js", "Express", "MongoDB", "REST API"],
    github: "https://github.com/rahul4091/library-management-system-",
    live: "",
    gradient: "from-green-400 to-teal-400",
  },
  {
    name: "Todo App",
    desc: "A task management app with full CRUD operations, local storage persistence and clean UI.",
    tech: ["React", "localStorage", "CSS"],
    github: "https://github.com/rahul4091/my-portfolio",
    live: "",
    gradient: "from-blue-400 to-cyan-400",
  },
  {
    name: "Blog Platform",
    desc: "A blog platform built with Next.js supporting Markdown, dynamic routing and static generation.",
    tech: ["Next.js", "Markdown", "SSG"],
    github: "https://github.com/rahul4091/my-portfolio",
    live: "",
    gradient: "from-purple-400 to-pink-400",
  },
];

export default function Projects() {
  return (
    <section className="py-20 px-6 bg-white dark:bg-black" id="projects">
      <motion.h2
        className="text-3xl font-bold text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        My Projects
      </motion.h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={project.name}
            className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
          >
            {/* Gradient header */}
            <div className={`h-2 w-full bg-gradient-to-r ${project.gradient}`} />

            <div className="p-5">
              <h3 className="text-base font-semibold mb-2">{project.name}</h3>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                {project.desc}
              </p>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                  </svg>
                  GitHub
                </a>

                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Live
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
