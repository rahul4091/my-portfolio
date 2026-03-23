"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const roles = ["a Developer 💻", "a Next.js Learner 🚀", "a Problem Solver 🧠", "a Builder ⚡"];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [currentRole, setCurrentRole] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Wait for client mount before starting animation
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fullText = roles[currentRole];

    if (!isDeleting && displayed.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayed(fullText.slice(0, displayed.length + 1));
      }, 80);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting && displayed.length === fullText.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayed.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayed(fullText.slice(0, displayed.length - 1));
      }, 40);
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

      {/* Typewriter line */}
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
          // Placeholder shown on server — prevents layout shift
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
        className="mt-8 flex gap-4"
        initial={{ opacity: 0, y: 20 }}
