import { useId, useState } from "react";
import { LuChevronRight } from "react-icons/lu";
import { CompanyLogo } from "@/components/experience/CompanyLogo";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { RichText } from "@/components/ui/RichText";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TechChip } from "@/components/ui/TechChip";
import { cn } from "@/lib/cn";
import { formatDuration, formatRange, isCurrent } from "@/lib/dates";
import type { Experience } from "@/types/content";

const LABEL = "text-sm font-medium text-muted";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

type ExperienceItemProps = {
  item: Experience;
  /** Home only: details collapse behind a chevron; duration hidden */
  expandable?: boolean;
  /** Company heading level: "h3" under a Section h2 (Home), "h2" on the Experience page (directly under the h1) */
  headingAs?: "h2" | "h3";
};

export function ExperienceItem({ item, expandable = false, headingAs: Heading = "h3" }: ExperienceItemProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const { company, role, type, url, logo, start, end, location, mode } = item;
  const tech = item.tech ?? [];
  const highlights = item.highlights ?? [];
  const links = item.links ?? [];
  const hasDetails = tech.length > 0 || highlights.length > 0 || links.length > 0;

  const subtitle = [role, type].filter(Boolean).join(" · ");
  const meta = [location, mode].filter(Boolean).join(" · ");
  const duration = expandable ? "" : formatDuration(start, end);

  const details = (
    <>
      {tech.length > 0 && (
        <div className="mt-4">
          <p className={LABEL}>Technologies &amp; Tools</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {tech.map((name) => (
              <TechChip key={name} name={name} />
            ))}
          </ul>
        </div>
      )}
      {highlights.length > 0 && (
        <div className="mt-4">
          <p className={LABEL}>What I&apos;ve done</p>
          <ul className="mt-2 space-y-2 text-[15px] leading-relaxed text-muted">
            {highlights.map((h) => (
              <li
                key={h}
                className="relative pl-4 before:absolute before:top-[0.7em] before:left-0 before:size-1 before:rounded-full before:bg-muted/60"
              >
                <RichText text={h} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {links.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {links.map((link) => (
            <li key={`${link.label}-${link.url}`}>
              <ExternalLink href={link.url}>{link.label}</ExternalLink>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <article className="flex gap-4">
      <CompanyLogo company={company} logo={logo} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <Heading className="flex flex-wrap items-center gap-2 text-base font-medium sm:text-lg">
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("min-w-0 break-words underline-offset-4 hover:underline", FOCUS)}
                >
                  {company}
                </a>
              ) : (
                <span className="min-w-0 break-words">{company}</span>
              )}
              {isCurrent(item) && <StatusBadge />}
              {expandable && hasDetails && (
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  aria-label={`${open ? "Hide" : "Show"} details for ${company}`}
                  onClick={() => setOpen((o) => !o)}
                  className={cn(
                    "-my-1.5 grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg",
                    FOCUS,
                  )}
                >
                  <LuChevronRight
                    aria-hidden
                    className={cn(
                      "size-4 transition-transform duration-300 motion-reduce:transition-none",
                      EASE,
                      open && "rotate-90",
                    )}
                  />
                </button>
              )}
            </Heading>
            {subtitle && <p className="text-[15px] text-muted">{subtitle}</p>}
          </div>
          <div className="shrink-0 text-sm text-muted tabular-nums sm:text-right">
            <p>
              {formatRange(start, end)}
              {duration && <span className="hidden sm:inline"> · {duration}</span>}
            </p>
            {meta && <p>{meta}</p>}
          </div>
        </div>

        {!expandable && details}
        {expandable && hasDetails && (
          <div
            id={panelId}
            inert={!open}
            className={cn(
              "grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none",
              EASE,
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="-mx-1 min-h-0 overflow-hidden px-1">
              <div
                className={cn(
                  "pb-1 transition-opacity duration-300 motion-reduce:transition-none",
                  open ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="mt-4 border-t border-border">{details}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
