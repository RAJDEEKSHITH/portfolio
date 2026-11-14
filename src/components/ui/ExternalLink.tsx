import type { ComponentProps } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { cn } from "@/lib/cn";

type ExternalLinkProps = ComponentProps<"a">;

export function ExternalLink({ href, className, children, ...props }: ExternalLinkProps) {
  const external = href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a
      href={href}
      {...external}
      {...props}
      className={cn(
        "group inline-flex items-center gap-1 text-sm font-medium text-fg underline-offset-4 hover:underline",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg",
        className,
      )}
    >
      {children}
      <LuArrowUpRight
        aria-hidden
        className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}
