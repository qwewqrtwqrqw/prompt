import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TemplateForm } from "@/components/forms/TemplateForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
}));

vi.mock("next/dynamic", () => ({
  default: () =>
    function MockEditor({
      value,
      onChange,
      error,
    }: {
      value: string;
      onChange: (v: string) => void;
      error?: string;
    }) {
      return (
        <div>
          <textarea
            aria-label="Текст промпта"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {error ? <p role="alert">{error}</p> : null}
        </div>
      );
    },
}));

describe("TemplateForm", () => {
  it("рендерит форму создания шаблона", () => {
    render(<TemplateForm token="token-1" />);
    expect(
      screen.getByRole("heading", { name: "Новый шаблон промпта" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Название")).toBeInTheDocument();
  });
});
