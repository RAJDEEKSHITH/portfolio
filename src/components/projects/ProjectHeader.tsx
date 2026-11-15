import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { cn } from "@/lib/cn";
import { getTitleHref } from "@/lib/projectLinks";
import type { Project } from "@/types/content";

type ProjectHeaderProps = {
  project: Project;
  /** "h3" under a Section h2 (Home), "h2" on the Projects page (directly under the h1) */
  headingAs?: "h2" | "h3";
};

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

/** Title + year on the left, link icons flush right on the first title line. Shared by Home rows and Projects cards. */
export function ProjectHeader({ project, headingAs: Heading = "h3" }: ProjectHeaderProps) {
  const { title, year } = project;
  const href = getTitleHref(project);

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3">
        <Heading className="min-w-0 text-base font-medium break-words sm:text-lg">
          {href ? (
            <a
              href={href}
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
        {year !== undefined && <span className="text-sm text-muted tabular-nums">{year}</span>}
      </div>
      {/* Negative margins centre the 36px icons on the first title line (24px, 28px from sm) without making the row taller */}
      <ProjectLinks project={project} className="-my-1.5 sm:-my-1" />
    </div>
  );
}
