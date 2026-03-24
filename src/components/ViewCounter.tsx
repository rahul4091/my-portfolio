
"use client";

import { useEffect, useState } from "react";

export default function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${slug}/view`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => setViews(data.viewCount))
      .catch(() => {});
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
