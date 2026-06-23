"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { TemplateForm } from "@/components/forms/TemplateForm";
import { useAuth } from "@/context/AuthContext";

function NewTemplateContent() {
  const { token } = useAuth();
  if (!token) return null;
  return <TemplateForm token={token} />;
}

export default function NewTemplatePage() {
  return (
    <AuthGuard>
      <NewTemplateContent />
    </AuthGuard>
  );
}
