"use client";

import { motion } from "framer-motion";
import type { Metadata } from "next";
import Link from "next/link";

const techStack = [
  "Next.js", "React", "TypeScript", "Node.js",
  "Express", "MongoDB", "PostgreSQL", "Tailwind CSS",
  "Prisma", "Framer Motion",
];

const timeline = [
  {
    year: "2024",
    title: "Started Full-Stack Development",
    desc: "Began learning Next.js, Node.js and building real projects from scratch.",
  },
  {
    year: "2024",
    title: "Built Library Management System",
    desc: "Created a full RESTful API backend with Node.js, Express and MongoDB.",
  },
  {
    year: "2025",
    title: "Launched Portfolio",
    desc: "Built and deployed this portfolio using Next.js, Tailwind CSS and Framer Motion.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-white dark:bg-black py-20 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 mb-8" />
          <h1 className="text-4xl font-bold mb-6">About Me</h1>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed mb-12"
        >
          <p>
            Hi, I&apos;m <span className="font-semibold text-zinc-900 dark:text-white">Rahul</span> — a
            full-stack developer from India who loves building clean, functional web applications.
          </p>
          <p>
            I&apos;m focused on the JavaScript ecosystem — building frontends with{" "}
            <span className="font-medium text-zinc-800 dark:text-zinc-200">Next.js & React</span> and
            backends with{" "}
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Node.js, Express and MongoDB/PostgreSQL
            </span>
            .
          </p>
          <p>
            I enjoy taking projects from idea to deployment — writing the backend API, designing the
            frontend UI, and making it all work together on platforms like Vercel.
          </p>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.04, duration: 0.3 }}
                className="text-sm px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-6">Journey</h2>
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.1, duration: 0.5 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-800 mt-1" />
                  )}
                </div>
                <div className="pb-6">
                  <span className="text-xs font-mono text-yellow-500 dark:text-yellow-400">
                    {item.year}
                  </span>
                  <h3 className="font-semibold text-zinc-900 dark:text-white mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex gap-4"
        >
          <Link
            href="/#projects"
            className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            View my projects
          </Link>
          <Link
            href="/#contact"
            className="px-5 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            Contact me
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
