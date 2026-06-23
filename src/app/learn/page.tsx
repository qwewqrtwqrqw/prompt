import Link from "next/link";
import { getTopics } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Обучение",
};

export default async function LearnPage() {
  const topics = await getTopics().catch(() => []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Техники промпт-инженерии</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Материалы для самостоятельного изучения: от базовых паттернов до структурированного вывода.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
          <li key={topic.id}>
            <article className="h-full rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-xl font-semibold">
                <Link
                  href={`/learn/${topic.slug}`}
                  className="hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {topic.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{topic.summary}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
