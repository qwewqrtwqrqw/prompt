import Link from "next/link";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { getTemplate } from "@/lib/api";
import { LikeButton } from "@/components/catalog/LikeButton";
import type { Metadata } from "next";

const PromptPreview = dynamic(
  () => import("@/components/editor/PromptPreview").then((mod) => mod.PromptPreview),
  { loading: () => <div className="h-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" /> },
);

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const template = await getTemplate(Number(id)).catch(() => null);
  return { title: template?.title ?? "Шаблон" };
}

export default async function CatalogDetailPage({ params }: PageProps) {
  const { id } = await params;
  const template = await getTemplate(Number(id)).catch(() => null);

  if (!template || !template.isPublic) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <nav aria-label="Хлебные крошки" className="text-sm text-zinc-500">
        <Link href="/catalog" className="hover:text-indigo-600">
          Каталог
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{template.title}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{template.title}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{template.description}</p>
        <p className="text-sm text-zinc-500">
          Автор: {template.authorName} · {new Date(template.createdAt).toLocaleDateString("ru-RU")}
        </p>
        <LikeButton templateId={template.id} initialLikes={template.likes} />
      </header>

      <section aria-labelledby="prompt-content-title">
        <h2 id="prompt-content-title" className="mb-3 text-xl font-semibold">
          Текст промпта
        </h2>
        <PromptPreview content={template.content} />
      </section>
    </article>
  );
}
