import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeaderProps = { title: ReactNode; subtitle?: ReactNode; className?: string };

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <header className={cn("mb-10 sm:mb-12", className)}>
      <h1 className="text-3xl font-semibold tracking-tight break-words sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-3 text-[15px] leading-relaxed text-muted">{subtitle}</p>}
    </header>
  );
}
