import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { RichText } from "@/components/ui/RichText";
import { TechChip } from "@/components/ui/TechChip";
import type { Project } from "@/types/content";

type ProjectCardProps = {
  project: Project;
  /** Title heading level: "h2" on the Projects page (directly under the h1), "h3" under a Section h2 */
  headingAs?: "h2" | "h3";
};

// No whole-card anchor: the card holds other links, and nested <a> is invalid
export function ProjectCard({ project, headingAs = "h3" }: ProjectCardProps) {
  const { title, description, image } = project;
  const tech = project.tech ?? [];

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border transition-colors hover:border-fg/20">
      {image && (
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
        <ProjectHeader project={project} headingAs={headingAs} />
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
      </div>
    </article>
  );
}
