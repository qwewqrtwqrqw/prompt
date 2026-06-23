"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { deleteTemplate, getMyTemplates } from "@/lib/api";
import type { PromptTemplate } from "@/types";

function DashboardContent() {
  const { user, token } = useAuth();
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    getMyTemplates(token)
      .then(setTemplates)
      .catch((err) => setError(err instanceof Error ? err.message : "Ошибка загрузки"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!window.confirm("Удалить шаблон?")) return;

    try {
      await deleteTemplate(token, id);
      setTemplates((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Личный кабинет</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Добро пожаловать, {user?.name}
          </p>
        </div>
        <Link
          href="/dashboard/templates/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Создать шаблон
        </Link>
      </header>

      {loading ? (
        <p role="status" aria-live="polite">
          Загрузка шаблонов...
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {!loading && templates.length === 0 ? (
        <p role="status">У вас пока нет шаблонов. Создайте первый!</p>
      ) : null}

      <ul className="space-y-3">
        {templates.map((template) => (
          <li
            key={template.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div>
              <h2 className="font-semibold">{template.title}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{template.description}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {template.isPublic ? "Публичный" : "Приватный"} · ♥ {template.likes}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/dashboard/templates/${template.id}/edit`}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Редактировать
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(template.id)}
                className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/30"
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
