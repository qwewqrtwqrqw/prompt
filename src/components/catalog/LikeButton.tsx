"use client";

import { useState } from "react";
import { likeTemplate } from "@/lib/api";

type LikeButtonProps = {
  templateId: number;
  initialLikes: number;
};

export function LikeButton({ templateId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [pending, setPending] = useState(false);

  const handleLike = async () => {
    setPending(true);
    try {
      const updated = await likeTemplate(templateId);
      setLikes(updated.likes);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={pending}
      aria-label={`Поставить лайк. Сейчас ${likes}`}
      className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm transition hover:bg-zinc-100 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      ♥ {likes}
    </button>
  );
}
