"use client";

import { highlightPromptToHtml } from "@/utils/syntaxHighlighter";

type PromptPreviewProps = {
  content: string;
  className?: string;
};

export function PromptPreview({ content, className = "" }: PromptPreviewProps) {
  return (
    <pre
      className={`prompt-preview overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-zinc-200 bg-zinc-950 p-4 font-mono text-sm leading-6 text-zinc-100 dark:border-zinc-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: highlightPromptToHtml(content) }}
    />
  );
}
