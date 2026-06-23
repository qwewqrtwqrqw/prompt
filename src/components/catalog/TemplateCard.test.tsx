import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TemplateCard } from "@/components/catalog/TemplateCard";
import type { PromptTemplate } from "@/types";

const template: PromptTemplate = {
  id: 1,
  title: "Тестовый шаблон",
  description: "Описание для карточки",
  content: "content",
  category: "reasoning",
  isPublic: true,
  authorId: 1,
  authorName: "Анна",
  createdAt: "2026-01-01T00:00:00.000Z",
  likes: 3,
};

describe("TemplateCard", () => {
  it("отображает название и автора", () => {
    render(<TemplateCard template={template} />);
    expect(screen.getByRole("heading", { name: "Тестовый шаблон" })).toBeInTheDocument();
    expect(screen.getByText("Анна")).toBeInTheDocument();
  });

  it("содержит ссылку на детальную страницу", () => {
    render(<TemplateCard template={template} />);
    expect(screen.getByRole("link", { name: "Тестовый шаблон" })).toHaveAttribute(
      "href",
      "/catalog/1",
    );
  });
});
