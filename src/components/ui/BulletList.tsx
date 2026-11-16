import { RichText } from "@/components/ui/RichText";
import { cn } from "@/lib/cn";

type BulletListProps = {
  /** Rich text: **bold** and [label](url) */
  items: string[];
  className?: string;
};

/** Body-scale bullets with a small muted dot. Shared by experience and project highlights. */
export function BulletList({ items, className }: BulletListProps) {
  if (items.length === 0) return null;

  return (
    <ul className={cn("space-y-2 text-[15px] leading-relaxed text-muted", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="relative pl-4 before:absolute before:top-[0.7em] before:left-0 before:size-1 before:rounded-full before:bg-muted/60"
        >
          <RichText text={item} />
        </li>
      ))}
    </ul>
  );
}
