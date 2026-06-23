"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { TemplateForm } from "@/components/forms/TemplateForm";
import { useAuth } from "@/context/AuthContext";
import { getTemplate } from "@/lib/api";
import type { PromptTemplate } from "@/types";

function EditTemplateContent() {
  const { token } = useAuth();
  const params = useParams<{ id: string }>();
  const [template, setTemplate] = useState<PromptTemplate | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getTemplate(Number(params.id))
      .then(setTemplate)
      .catch((err) => setError(err instanceof Error ? err.message : "Ошибка"));
  }, [params.id]);

  if (error) {
    return (
      <p role="alert" className="text-red-600">
        {error}
      </p>
    );
  }

  if (!template || !token) {
    return (
      <p role="status" aria-live="polite">
        Загрузка шаблона...
      </p>
    );
  }

  return <TemplateForm token={token} initial={template} />;
}

export default function EditTemplatePage() {
  return (
    <AuthGuard>
      <EditTemplateContent />
    </AuthGuard>
  );
}
