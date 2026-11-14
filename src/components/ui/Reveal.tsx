import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type RevealProps = { as?: ElementType; step?: number; className?: string; children: ReactNode };

export function Reveal({ as: Tag = "div", step = 0, className, children }: RevealProps) {
  return (
    <Tag
      className={cn("animate-fade-up motion-reduce:animate-none", className)}
      style={{ animationDelay: `${Math.min(step, 6) * 60}ms` }}
    >
      {children}
    </Tag>
  );
}
