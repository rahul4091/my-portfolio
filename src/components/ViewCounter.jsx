"use client";

import { useEffect, useState } from "react";

export default function ViewCounter({ slug }) {
  const [views, setViews] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function registerView() {
      try {
        const res = await fetch(`/api/projects/${slug}/view`, { method: "POST" });
        if (!res.ok) {
          throw new Error(`View count request failed with status ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) setViews(data.viewCount);
      } catch (err) {
        console.error(`Failed to load view count for "${slug}":`, err);
      }
    }

    registerView();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <span className="flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 mt-2 shrink-0">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      {views === null ? "—" : `${views} views`}
    </span>
  );
}
