import Link from "next/link";
import type { PromptTemplate } from "@/types";

const categoryLabels: Record<string, string> = {
  reasoning: "Рассуждение",
  classification: "Классификация",
  generation: "Генерация",
  analysis: "Анализ",
};

type TemplateCardProps = {
  template: PromptTemplate;
};

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <Link
            href={`/catalog/${template.id}`}
            className="hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {template.title}
          </Link>
        </h2>
        <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200">
          {categoryLabels[template.category] ?? template.category}
        </span>
      </div>

      <p className="mb-4 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
        {template.description}
      </p>

      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>{template.authorName}</span>
        <span aria-label={`${template.likes} лайков`}>♥ {template.likes}</span>
      </div>
    </article>
  );
}
