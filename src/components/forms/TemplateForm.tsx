"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import {
  createTemplate,
  updateTemplate,
} from "@/lib/api";
import { templateSchema, type TemplateSchemaValues } from "@/lib/validators";
import type { PromptTemplate } from "@/types";

const PromptEditor = dynamic(
  () =>
    import("@/components/editor/PromptEditor").then((mod) => mod.PromptEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
    ),
  },
);

const categories = [
  { value: "reasoning", label: "Рассуждение" },
  { value: "classification", label: "Классификация" },
  { value: "generation", label: "Генерация" },
  { value: "analysis", label: "Анализ" },
];

type TemplateFormProps = {
  token: string;
  initial?: PromptTemplate;
};

export function TemplateForm({ token, initial }: TemplateFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const isEdit = Boolean(initial);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TemplateSchemaValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      content: initial?.content ?? "",
      category: initial?.category ?? "reasoning",
      isPublic: initial?.isPublic ?? true,
    },
  });

  const onSubmit = async (values: TemplateSchemaValues) => {
    setServerError("");
    try {
      if (isEdit && initial) {
        await updateTemplate(token, initial.id, values);
      } else {
        await createTemplate(token, values);
      }
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Ошибка сохранения");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      noValidate
      aria-labelledby="template-form-title"
    >
      <div>
        <h1 id="template-form-title" className="text-2xl font-semibold">
          {isEdit ? "Редактирование шаблона" : "Новый шаблон промпта"}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Заполните поля и используйте редактор с подсветкой синтаксиса
        </p>
      </div>

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Название
        </label>
        <input
          id="title"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950"
          {...register("title")}
        />
        {errors.title ? (
          <p id="title-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.title.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Описание
        </label>
        <textarea
          id="description"
          rows={3}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "description-error" : undefined}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950"
          {...register("description")}
        />
        {errors.description ? (
          <p id="description-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          Категория
        </label>
        <select
          id="category"
          aria-invalid={Boolean(errors.category)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950"
          {...register("category")}
        >
          {categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {errors.category ? (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.category.message}
          </p>
        ) : null}
      </div>

      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <PromptEditor
            value={field.value}
            onChange={field.onChange}
            error={errors.content?.message}
          />
        )}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 rounded border-zinc-300 text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500"
          {...register("isPublic")}
        />
        Опубликовать в общем каталоге
      </label>

      {serverError ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {serverError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {isSubmitting ? "Сохранение..." : "Сохранить шаблон"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
