import { socials } from "@/data/socials";
import { cn } from "@/lib/cn";
import { getSocial } from "@/lib/icons";
import type { Social } from "@/types/content";

// Read through the declared type so optional fields (label) exist even if no entry sets them
const links: readonly Social[] = socials;

type SocialLinksProps = { size?: "sm" | "md"; className?: string };

export function SocialLinks({ size = "md", className }: SocialLinksProps) {
  return (
    // sm (footer): no gap below 640px, so 7 icons (252px) fit one row even beside a desktop scrollbar at 320px
    <ul className={cn("flex flex-wrap items-center", size === "sm" ? "gap-0 sm:gap-1" : "gap-1", className)}>
      {links.map(({ platform, url, label }) => {
        const meta = getSocial(platform);
        const Icon = meta.icon;
        const name = label ?? meta.label;
        const external = url.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" };
        return (
          <li key={url}>
            <a
              href={url}
              aria-label={name}
              title={name}
              {...external}
              className={cn(
                "grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg focus-visible:transition-none",
              )}
            >
              <Icon aria-hidden className={size === "sm" ? "size-4" : "size-4.5"} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
