import { LuCheck, LuCopy } from "react-icons/lu";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

const ICON = "size-4 shrink-0 [grid-area:1/1] transition-[opacity,transform] duration-200";
const HIDDEN = "scale-75 opacity-0";

type CopyEmailProps = { className?: string };

export function CopyEmail({ className }: CopyEmailProps) {
  const { copied, copy } = useCopyToClipboard();

  const handleClick = async () => {
    const ok = await copy(site.email);
    if (!ok) window.location.href = `mailto:${site.email}`;
  };

  return (
    <div className={cn("flex min-w-0", className)}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Copy email address ${site.email}`}
        title="Copy email"
        className={cn(
          "inline-flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-subtle",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg",
        )}
      >
        <span className="truncate">{site.email}</span>
        <span className="grid text-muted">
          <LuCopy aria-hidden className={cn(ICON, copied && HIDDEN)} />
          <LuCheck aria-hidden className={cn(ICON, "text-accent", !copied && HIDDEN)} />
        </span>
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email copied" : ""}
      </span>
    </div>
  );
}
