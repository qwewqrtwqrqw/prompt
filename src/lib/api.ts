import type {
  AuthResponse,
  LearningTopic,
  PromptTemplate,
  TemplateFormValues,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? "Ошибка запроса");
  }

  return response.json() as Promise<T>;
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(name: string, email: string, password: string) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function getTopics() {
  return request<LearningTopic[]>("/topics");
}

export function getTopic(slug: string) {
  return request<LearningTopic>(`/topics/${slug}`);
}

export function getPublicTemplates() {
  return request<PromptTemplate[]>("/templates?public=true");
}

export function getTemplate(id: number) {
  return request<PromptTemplate>(`/templates/${id}`);
}

export function getMyTemplates(token: string) {
  return request<PromptTemplate[]>("/me/templates", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createTemplate(token: string, data: TemplateFormValues) {
  return request<PromptTemplate>("/templates", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function updateTemplate(
  token: string,
  id: number,
  data: TemplateFormValues,
) {
  return request<PromptTemplate>(`/templates/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function deleteTemplate(token: string, id: number) {
  return request<PromptTemplate>(`/templates/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function likeTemplate(id: number) {
  return request<PromptTemplate>(`/templates/${id}/like`, {
    method: "POST",
  });
}
