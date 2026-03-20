"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render icon after mount
  useEffect(() => setMounted(true), []);

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Rahul.dev</h1>

      <div className="flex gap-6 items-center">
        <Link href="/" className={pathname === "/" ? "text-yellow-400" : "hover:text-gray-300"}>
          Home
        </Link>
        <Link href="/about" className={pathname === "/about" ? "text-yellow-400" : "hover:text-gray-300"}>
          About
        </Link>

        {/* Dark mode toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-xl hover:scale-110 transition-transform"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        )}
      </div>
    </nav>
  );
}
