import { ExternalLink } from "@/components/ui/ExternalLink";
import { RichText } from "@/components/ui/RichText";
import { TechChip } from "@/components/ui/TechChip";
import { cn } from "@/lib/cn";
import type { Project } from "@/types/content";

type ProjectCardProps = {
  project: Project;
  /** Home only: hides the image */
  compact?: boolean;
  /** Title heading level: "h3" under a Section h2 (Home), "h2" on the Projects page (directly under the h1) */
  headingAs?: "h2" | "h3";
};

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

// No whole-card anchor: the card holds other links, and nested <a> is invalid
export function ProjectCard({ project, compact = false, headingAs: Heading = "h3" }: ProjectCardProps) {
  const { title, description, year, image } = project;
  const tech = project.tech ?? [];
  const live = project.links?.live;
  const github = project.links?.github;
  const titleHref = live ?? github;

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border transition-colors hover:border-fg/20">
      {image && !compact && (
        <div className="aspect-video overflow-hidden bg-subtle">
          <img
            src={image}
            alt={title}
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <Heading className="min-w-0 text-base font-medium break-words sm:text-lg">
            {titleHref ? (
              <a
                href={titleHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("underline-offset-4 hover:underline", FOCUS)}
              >
                {title}
              </a>
            ) : (
              title
            )}
          </Heading>
          {year !== undefined && <span className="shrink-0 text-sm text-muted tabular-nums">{year}</span>}
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          <RichText text={description} />
        </p>
        {tech.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {tech.map((name) => (
              <TechChip key={name} name={name} />
            ))}
          </ul>
        )}
        {(live || github) && (
          <div className="mt-auto flex flex-wrap gap-4 pt-4">
            {live && (
              <ExternalLink href={live} aria-label={`Live: ${title}`}>
                Live
              </ExternalLink>
            )}
            {github && (
              <ExternalLink href={github} aria-label={`Source: ${title}`}>
                Source
              </ExternalLink>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
