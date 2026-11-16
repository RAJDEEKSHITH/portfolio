import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { BulletList } from "@/components/ui/BulletList";
import { RichText } from "@/components/ui/RichText";
import { TechChip } from "@/components/ui/TechChip";
import { site } from "@/data/site";
import type { Project, Site } from "@/types/content";

// Read through the declared type so the limit isn't narrowed to the literal in site.ts
const home: Site["home"] = site.home;

type ProjectItemProps = {
  project: Project;
  /** Projects-first Home only (no experience): the first site.home.highlightLimit highlights, no tech chips */
  preview?: boolean;
  /** Title heading level: "h2" on the Projects page (directly under the h1), "h3" under a Section h2 */
  headingAs?: "h2" | "h3";
};

/** Title row, description, highlights, tech chips. Missing parts render nothing. */
export function ProjectItem({ project, preview = false, headingAs = "h3" }: ProjectItemProps) {
  const allHighlights = project.highlights ?? [];
  const highlights = preview ? allHighlights.slice(0, Math.max(0, home.highlightLimit)) : allHighlights;
  const tech = preview ? [] : (project.tech ?? []);

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
