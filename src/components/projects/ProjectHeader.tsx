import { ProjectLinks } from "@/components/projects/ProjectLinks";
import type { Project } from "@/types/content";

type ProjectHeaderProps = {
  project: Project;
  /** "h3" under a Section h2 (Home), "h2" on the Projects page (directly under the h1) */
  headingAs?: "h2" | "h3";
};

/** Title on the left (plain text; the icons carry the links), link icons flush right on the first title line. Shared by Home rows and Projects list items. */
export function ProjectHeader({ project, headingAs: Heading = "h3" }: ProjectHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <Heading className="min-w-0 text-base font-medium break-words sm:text-lg">{project.title}</Heading>
      {/* Negative margins centre the 36px icons on the first title line (24px, 28px from sm) without making the row taller */}
      <ProjectLinks project={project} className="-my-1.5 sm:-my-1" />
    </div>
  );
}
