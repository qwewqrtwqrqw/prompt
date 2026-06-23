export type HighlightToken = {
  text: string;
  className: string;
};

const META_GLYPHS = /[∈∩∪¬⊕→]/g;
const JSON_PAIR = /"([^"\\]|\\.)*"\s*:\s*"([^"\\]|\\.)*"/g;
const HEADING = /^## .+$/gm;
const DECORATOR = /\+\+\+[A-Za-zА-Яа-я0-9:_\-\s]+/g;
const XML_TAG = /<\/?[a-zA-Z][a-zA-Z0-9_-]*>/g;
const VARIABLE = /\{\{[^{}]+\}\}/g;
const INLINE_CODE = /`[^`\n]+`/g;
const CAPS_WORD = /\b[A-ZА-Я]{2,}\b/g;
const SEPARATOR = /—/g;
const FLOW_ARROW = /(?<![∈∩∪¬⊕])→(?![∈∩∪¬⊕])/g;

type Rule = {
  pattern: RegExp;
  className: string;
};

const RULES: Rule[] = [
  { pattern: HEADING, className: "hl-heading" },
  { pattern: DECORATOR, className: "hl-decorator" },
  { pattern: JSON_PAIR, className: "hl-json" },
  { pattern: XML_TAG, className: "hl-xml" },
  { pattern: VARIABLE, className: "hl-variable" },
  { pattern: INLINE_CODE, className: "hl-code" },
  { pattern: META_GLYPHS, className: "hl-glyph" },
  { pattern: SEPARATOR, className: "hl-separator" },
  { pattern: FLOW_ARROW, className: "hl-arrow" },
  { pattern: CAPS_WORD, className: "hl-caps" },
];

type MatchRange = {
  start: number;
  end: number;
  className: string;
};

function collectMatches(text: string, pattern: RegExp, className: string) {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const regex = new RegExp(pattern.source, flags);
  const matches: MatchRange[] = [];

  for (const match of text.matchAll(regex)) {
    if (match.index === undefined) continue;
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      className,
    });
  }

  return matches;
}

function mergeRanges(ranges: MatchRange[]) {
  return ranges
    .sort((a, b) => a.start - b.start || b.end - a.end)
    .filter((range, index, list) => {
      if (index === 0) return true;
      const prev = list[index - 1];
      return range.start >= prev.end;
    });
}

export function tokenizePromptSyntax(text: string): HighlightToken[] {
  if (!text) {
    return [{ text: "", className: "hl-plain" }];
  }

  const ranges = RULES.flatMap((rule) =>
    collectMatches(text, rule.pattern, rule.className),
  );
  const merged = mergeRanges(ranges);
  const tokens: HighlightToken[] = [];
  let cursor = 0;

  for (const range of merged) {
    if (cursor < range.start) {
      tokens.push({
        text: text.slice(cursor, range.start),
        className: "hl-plain",
      });
    }
    tokens.push({
      text: text.slice(range.start, range.end),
      className: range.className,
    });
    cursor = range.end;
  }

  if (cursor < text.length) {
    tokens.push({
      text: text.slice(cursor),
      className: "hl-plain",
    });
  }

  return tokens.length ? tokens : [{ text, className: "hl-plain" }];
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function highlightPromptToHtml(text: string) {
  return tokenizePromptSyntax(text)
    .map((token) => {
      const safe = escapeHtml(token.text);
      if (token.className === "hl-plain") return safe;
      return `<span class="${token.className}">${safe}</span>`;
    })
    .join("");
}
