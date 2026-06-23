import Link from "next/link";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getTopic } from "@/lib/api";
import type { Metadata } from "next";

const PromptPreview = dynamic(
  () => import("@/components/editor/PromptPreview").then((mod) => mod.PromptPreview),
  { loading: () => <div className="h-40 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" /> },
);

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopic(slug).catch(() => null);
  return { title: topic?.title ?? "Тема" };
}

export default async function LearnTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = await getTopic(slug).catch(() => null);

  if (!topic) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <nav aria-label="Хлебные крошки" className="text-sm text-zinc-500">
        <Link href="/learn" className="hover:text-indigo-600">
          Обучение
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{topic.title}</span>
      </nav>

      <header>
        <h1 className="text-3xl font-bold">{topic.title}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{topic.summary}</p>
      </header>

      <div className="prose prose-zinc max-w-none dark:prose-invert">
        {topic.content.split("\n\n").map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="whitespace-pre-wrap text-base leading-7">
            {paragraph}
          </p>
        ))}
      </div>

      <section aria-labelledby="example-title">
        <h2 id="example-title" className="text-xl font-semibold">
          Пример синтаксиса в промпте
        </h2>
        <PromptPreview
          content={`## ${topic.title}\n— ключевой принцип\n→ шаг с {{variable}}\nCAPS для акцента\n"key": "value"\n<tag>контекст</tag>\n+++Format: markdown`}
        />
      </section>
    </article>
  );
}
