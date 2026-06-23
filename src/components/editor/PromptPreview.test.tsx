import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { PromptPreview } from "@/components/editor/PromptPreview";

describe("PromptPreview", () => {
  it("рендерит подсветку промпта", () => {
    const { container } = render(
      <PromptPreview content={'## Title\n{{name}}'} />,
    );

    const html = container.querySelector(".prompt-preview")?.innerHTML ?? "";
    expect(html).toContain("hl-heading");
    expect(html).toContain("hl-variable");
  });
});
