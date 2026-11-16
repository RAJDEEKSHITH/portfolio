import { CompanyLogo } from "@/components/experience/CompanyLogo";
import { BulletList } from "@/components/ui/BulletList";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TechChip } from "@/components/ui/TechChip";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { formatDuration, formatRange, isCurrent } from "@/lib/dates";
import type { Experience, Site } from "@/types/content";

const LABEL = "text-sm font-medium text-muted";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

// Read through the declared type so the limit isn't narrowed to the literal in site.ts
const home: Site["home"] = site.home;

type ExperienceItemProps = {
  item: Experience;
  /** Home only: header + the first site.home.highlightLimit highlights; no tech, links or duration */
  preview?: boolean;
  /** Company heading level: "h3" under a Section h2 (Home), "h2" on the Experience page (directly under the h1) */
  headingAs?: "h2" | "h3";
};

export function ExperienceItem({ item, preview = false, headingAs: Heading = "h3" }: ExperienceItemProps) {
  const { company, role, type, url, logo, start, end, location, mode } = item;
  const tech = preview ? [] : (item.tech ?? []);
  const links = preview ? [] : (item.links ?? []);
  const allHighlights = item.highlights ?? [];
  const highlights = preview ? allHighlights.slice(0, Math.max(0, home.highlightLimit)) : allHighlights;

  const subtitle = [role, type].filter(Boolean).join(" · ");
  const meta = [location, mode].filter(Boolean).join(" · ");
  const duration = preview ? "" : formatDuration(start, end);

  // Preview: bullets sit right under the header (no label), same list styling as the full item
  const bullets = <BulletList items={highlights} className={preview ? "mt-4" : "mt-2"} />;

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
        {highlights.length > 0 &&
          (preview ? (
            bullets
          ) : (
            <div className="mt-4">
              <p className={LABEL}>What I&apos;ve done</p>
              {bullets}
            </div>
          ))}
        {links.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {links.map((link) => (
              <li key={`${link.label}-${link.url}`}>
                <ExternalLink href={link.url}>{link.label}</ExternalLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
