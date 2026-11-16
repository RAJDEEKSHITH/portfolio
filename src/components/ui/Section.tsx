import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = { title?: string; action?: ReactNode; className?: string; children: ReactNode };

export function Section({ title, action, className, children }: SectionProps) {
  return (
    <section className={cn("mt-14 sm:mt-16", className)}>
      {title && (
        <div className="mb-5 flex items-baseline justify-between gap-4 sm:mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
