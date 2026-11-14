import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = { title?: string; action?: ReactNode; className?: string; children: ReactNode };

export function Section({ title, action, className, children }: SectionProps) {
  return (
    <section className={cn("mt-16 sm:mt-20", className)}>
      {title && (
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
