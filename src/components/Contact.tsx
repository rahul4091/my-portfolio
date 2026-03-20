"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(data.error || "Failed to send message");
      }
    } catch (err) {
      setStatus("Something went wrong");
    }
  };

  return (
    <motion.section
      id="contact"
      className="py-20 px-6 bg-zinc-100 dark:bg-zinc-900"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold text-center">Contact Me</h2>

      <form className="mt-10 max-w-xl mx-auto flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="p-3 rounded border"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-3 rounded border"
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          className="p-3 rounded border"
          required
        />
        <button
          type="submit"
          className="bg-black text-white py-3 rounded hover:bg-gray-800"
        >
          Send Message
        </button>
      </form>

      {/* Animated status message */}
      {status && (
        <motion.p
          className="text-center mt-4 text-sm md:text-base text-zinc-700 dark:text-zinc-300"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {status}
        </motion.p>
      )}
    </motion.section>
  );
}
