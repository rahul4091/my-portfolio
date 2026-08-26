"use client";

import { useEffect, useState } from "react";
import { EyeIcon } from "@/components/icons";

export default function ViewCounter({ slug }) {
  const [views, setViews] = useState(null);

  useEffect(() => {
    fetch(`/api/projects/${slug}/view`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => setViews(data.viewCount))
      .catch(() => {});
  }, [slug]);

  return (
    <span className="flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 mt-2 shrink-0">
      <EyeIcon size={14} />
      {views === null ? "—" : `${views} views`}
    </span>
  );
}
