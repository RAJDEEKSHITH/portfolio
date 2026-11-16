import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { RichText } from "@/components/ui/RichText";
import type { Project } from "@/types/content";

type ProjectRowProps = { project: Project };

/** Home list row: header + description clamped to 2 lines. No highlights or tech chips (Projects page only). */
export function ProjectRow({ project }: ProjectRowProps) {
  return (
    <article>
      <ProjectHeader project={project} />
      <p className="mt-1.5 line-clamp-2 text-[15px] leading-relaxed text-muted">
        <RichText text={project.description} />
      </p>
    </article>
  );
}
