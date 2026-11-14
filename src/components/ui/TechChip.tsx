import type { IconType } from "react-icons";
import { TECH_ICONS, toKey } from "@/lib/icons";

type TechChipProps = { name: string };

// Parent: <ul className="flex flex-wrap gap-2">
export function TechChip({ name }: TechChipProps) {
  // Direct registry read (same as getTechIcon): entries are module-level components, so identity is stable
  const Icon: IconType | undefined = TECH_ICONS[toKey(name)];
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-subtle px-2.5 py-1 text-xs font-medium text-fg/80">
      {Icon && <Icon aria-hidden className="size-3.5 shrink-0" />}
      <span className="whitespace-nowrap">{name}</span>
    </li>
  );
}
