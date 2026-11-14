import { Link } from "react-router-dom";
import { parseRichText } from "@/lib/richText";

const LINK =
  "text-fg underline underline-offset-4 decoration-border transition-colors hover:decoration-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

type RichTextProps = { text: string };

/** Renders **bold** and [label](url) from owner-written strings. Inline: wrap it in a <p>/<li>. */
export function RichText({ text }: RichTextProps) {
  return (
    <>
      {parseRichText(text).map((t, i) => {
        if (t.type === "text") return t.text;
        if (t.type === "bold") {
          return (
            <strong key={i} className="font-medium text-fg">
              {t.text}
            </strong>
          );
        }
        if (t.kind === "internal") {
          return (
            <Link key={i} to={t.href} className={LINK}>
              {t.label}
            </Link>
          );
        }
        const external = t.kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {};
        return (
          <a key={i} href={t.href} {...external} className={LINK}>
            {t.label}
          </a>
        );
      })}
    </>
  );
}
