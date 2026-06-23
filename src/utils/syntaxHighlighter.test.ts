import { describe, expect, it } from "vitest";
import {
  escapeHtml,
  highlightPromptToHtml,
  tokenizePromptSyntax,
} from "@/utils/syntaxHighlighter";

describe("syntaxHighlighter", () => {
  it("выделяет заголовки", () => {
    const tokens = tokenizePromptSyntax("## Задача");
    expect(tokens.some((token) => token.className === "hl-heading")).toBe(true);
  });

  it("выделяет переменные", () => {
    const tokens = tokenizePromptSyntax("Привет {{name}}");
    expect(tokens.some((token) => token.className === "hl-variable")).toBe(true);
  });

  it("выделяет JSON-пары", () => {
    const html = highlightPromptToHtml('"key": "value"');
    expect(html).toContain("hl-json");
  });

  it("экранирует HTML", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("выделяет декораторы и XML", () => {
    const html = highlightPromptToHtml("+++Format: json\n<tag>");
    expect(html).toContain("hl-decorator");
    expect(html).toContain("hl-xml");
  });

  it("выделяет CAPS и MetaGlyph", () => {
    const html = highlightPromptToHtml("IMPORTANT ∈ set");
    expect(html).toContain("hl-caps");
    expect(html).toContain("hl-glyph");
  });
});
