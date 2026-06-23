import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PromptEditor } from "@/components/editor/PromptEditor";

describe("PromptEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендерит textarea с label", () => {
    render(<PromptEditor value="" onChange={() => undefined} />);
    expect(screen.getByLabelText("Текст промпта")).toBeInTheDocument();
  });

  it("вызывает onChange при вводе", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<PromptEditor value="" onChange={handleChange} />);
    await user.type(screen.getByLabelText("Текст промпта"), "A");

    expect(handleChange).toHaveBeenCalled();
  });

  it("показывает ошибку валидации", () => {
    render(
      <PromptEditor
        value=""
        onChange={() => undefined}
        error="Обязательное поле"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Обязательное поле");
  });
});
