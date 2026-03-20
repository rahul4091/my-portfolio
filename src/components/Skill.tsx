"use client";
import { motion } from "framer-motion";

const skills = ["HTML", "CSS", "JavaScript", "Next.js", "Node", "Express", "MongoDB", "SQL", "PostgreSQL"];

export default function Skills() {
  return (
    <section className="py-20 px-6 bg-zinc-100 dark:bg-zinc-900">
      <h2 className="text-3xl font-bold text-center">My Skills</h2>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {skills.map((skill, index) => (
          <motion.div
        key={skill}
        className="p-6 bg-white dark:bg-black rounded-lg text-center shadow cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05, backgroundColor: "#facc15", color: "#000" }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
      >
              {skill}
      </motion.div>
        ))}
      </div>
    </section>
  );
}
