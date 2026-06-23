export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PromptTemplate {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  isPublic: boolean;
  authorId: number;
  authorName: string;
  createdAt: string;
  likes: number;
}

export interface LearningTopic {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  order: number;
}

export type TemplateFormValues = {
  title: string;
  description: string;
  content: string;
  category: string;
  isPublic: boolean;
};
