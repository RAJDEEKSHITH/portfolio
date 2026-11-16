import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { BulletList } from "@/components/ui/BulletList";
import { RichText } from "@/components/ui/RichText";
import { TechChip } from "@/components/ui/TechChip";
import type { Project } from "@/types/content";

type ProjectItemProps = {
  project: Project;
  /** Title heading level: "h2" on the Projects page (directly under the h1), "h3" under a Section h2 */
  headingAs?: "h2" | "h3";
};

/** Projects page list item: title row, description, highlights, tech chips. Missing parts render nothing. */
export function ProjectItem({ project, headingAs = "h3" }: ProjectItemProps) {
  const highlights = project.highlights ?? [];
  const tech = project.tech ?? [];

  return (
    <article>
      <ProjectHeader project={project} headingAs={headingAs} />
      <p className="mt-2 text-[15px] leading-relaxed text-muted">
        <RichText text={project.description} />
      </p>
      <BulletList items={highlights} className="mt-4" />
      {tech.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tech.map((name) => (
            <TechChip key={name} name={name} />
          ))}
        </ul>
      )}
    </article>
  );
}
