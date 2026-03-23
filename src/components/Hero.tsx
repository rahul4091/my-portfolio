"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const roles = ["a Developer 💻", "a Next.js Learner 🚀", "a Problem Solver 🧠", "a Builder ⚡"];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [currentRole, setCurrentRole] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const fullText = roles[currentRole];
    if (!isDeleting && displayed.length < fullText.length) {
      const timeout = setTimeout(() => setDisplayed(fullText.slice(0, displayed.length + 1)), 80);
      return () => clearTimeout(timeout);
    }
    if (!isDeleting && displayed.length === fullText.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(timeout);
    }
    if (isDeleting && displayed.length > 0) {
      const timeout = setTimeout(() => setDisplayed(fullText.slice(0, displayed.length - 1)), 40);
      return () => clearTimeout(timeout);
    }
    if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }
  }, [displayed, isDeleting, currentRole, mounted]);

  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6">
      <motion.h1
        className="text-5xl md:text-6xl font-bold leading-tight"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Hi, I&apos;m Rahul 👋
      </motion.h1>

      <motion.div
        className="mt-4 text-2xl md:text-3xl font-semibold text-yellow-500 dark:text-yellow-400 h-10 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {mounted ? (
          <>
            <span>I&apos;m {displayed}</span>
            <span className="ml-1 inline-block w-0.5 h-7 bg-yellow-500 dark:bg-yellow-400 animate-pulse" />
          </>
        ) : (
          <span className="opacity-0">I&apos;m a Developer 💻</span>
        )}
      </motion.div>

      <motion.p
        className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        I love creating clean and functional user experiences with modern web technologies.
      </motion.p>

      <motion.div
        className="mt-8 flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <button
          onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          View Projects
        </button>
        <button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className="px-6 py-3 border border-black dark:border-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Contact Me
        </button>
        
<a href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-yellow-400 text-yellow-500 dark:text-yellow-400 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-400/10 transition-colors"
        >
          Resume ↓
        </a>
      </motion.div>

      <motion.div
        className="mt-6 flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <a href="https://github.com/rahul4091" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" /></svg>
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/rahul-pawar-5b8881240/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
          LinkedIn
        </a>
      </motion.div>
    </section>
  );
}