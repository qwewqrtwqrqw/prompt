"use client";

import { useEffect, useId, useRef } from "react";
import { highlightPromptToHtml } from "@/utils/syntaxHighlighter";

type PromptEditorProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  minRows?: number;
};

export function PromptEditor({
  value,
  onChange,
  id,
  label = "Текст промпта",
  error,
  placeholder = "## Заголовок\n→ шаг с {{переменной}}\n+++Format: markdown",
  minRows = 12,
}: PromptEditorProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    if (!textarea || !highlight) return;

    const syncScroll = () => {
      highlight.scrollTop = textarea.scrollTop;
      highlight.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener("scroll", syncScroll);
    return () => textarea.removeEventListener("scroll", syncScroll);
  }, []);

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">
        {label}
      </label>

      <div
        className={`prompt-editor relative overflow-hidden rounded-lg border bg-zinc-950 ${
          error ? "border-red-500" : "border-zinc-700"
        }`}
      >
        <pre
          ref={highlightRef}
          className="pointer-events-none absolute inset-0 m-0 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-sm leading-6 text-transparent"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlightPromptToHtml(value || placeholder) }}
        />
        <textarea
          ref={textareaRef}
          id={fieldId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={minRows}
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          placeholder={placeholder}
          className="relative z-10 block w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-zinc-100 caret-indigo-300 outline-none"
        />
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <p className="text-xs text-zinc-500">
        Поддержка: ## заголовки, — разделители, → стрелки, {"{{var}}"}, CAPS, MetaGlyph, JSON, +++Format, XML-теги, `код`
      </p>
    </div>
  );
}
