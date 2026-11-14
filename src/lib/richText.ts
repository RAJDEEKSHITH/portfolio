/**
 * Owner-written rich text: **bold** and [label](url). Nothing else.
 * Pure tokenizer, no HTML: anything that isn't a complete, well-formed marker stays plain text.
 * Links: http(s) → new tab, "/path" → router link, mailto: → plain link.
 * Any other scheme (javascript:, data:, //host, relative paths…) renders the label as plain text.
 */
export type LinkKind = "external" | "internal" | "mailto";

export type RichToken =
  | { type: "text"; text: string }
  | { type: "bold"; text: string }
  | { type: "link"; label: string; href: string; kind: LinkKind };

// **bold** (no "*" inside, no leading/trailing space) | [label](url) (no spaces/parens in url)
const TOKEN_RE = /\*\*([^*\s](?:[^*]*[^*\s])?)\*\*|\[([^\]\n]+)\]\(([^()\s]+)\)/g;

export const getLinkKind = (href: string): LinkKind | null => {
  if (/^https?:\/\/[^/\s]/i.test(href)) return "external";
  if (/^mailto:\S/i.test(href)) return "mailto";
  if (/^\/(?!\/)/.test(href)) return "internal";
  return null;
};

export function parseRichText(input: string): RichToken[] {
  const tokens: RichToken[] = [];
  const pushText = (text: string) => {
    if (!text) return;
    const last = tokens.at(-1);
    if (last?.type === "text") last.text += text;
    else tokens.push({ type: "text", text });
  };

  let cursor = 0;
  for (const m of input.matchAll(TOKEN_RE)) {
    pushText(input.slice(cursor, m.index));
    cursor = m.index + m[0].length;
    const [, bold, label, href] = m;
    if (bold !== undefined) {
      tokens.push({ type: "bold", text: bold });
      continue;
    }
    if (label === undefined || href === undefined) continue;
    const kind = getLinkKind(href);
    if (kind) tokens.push({ type: "link", label, href, kind });
    else pushText(label);
  }
  pushText(input.slice(cursor));
  return tokens;
}
