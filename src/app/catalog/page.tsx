import { getPublicTemplates } from "@/lib/api";
import { TemplateCard } from "@/components/catalog/TemplateCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог шаблонов",
};

export default async function CatalogPage() {
  const templates = await getPublicTemplates().catch(() => []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Каталог шаблонов</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Публичные промпты от участников платформы. Используйте их как отправную точку.
        </p>
      </header>

      {templates.length === 0 ? (
        <p role="status">Пока нет опубликованных шаблонов.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {templates.map((template) => (
            <li key={template.id}>
              <TemplateCard template={template} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
