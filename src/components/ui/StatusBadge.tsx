import type { ReactNode } from "react";

type StatusBadgeProps = { children?: ReactNode };

export function StatusBadge({ children = "Working" }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
      </span>
      {children}
    </span>
  );
}
