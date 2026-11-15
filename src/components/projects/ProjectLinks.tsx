import type { IconType } from "react-icons";
import { FaGithub, FaYoutube } from "react-icons/fa6";
import { LuGlobe } from "react-icons/lu";
import { cn } from "@/lib/cn";
import { PROJECT_LINK_LABELS, PROJECT_LINK_TYPES, getProjectLink } from "@/lib/projectLinks";
import type { Project, ProjectLinkType } from "@/types/content";

const ICONS: Record<ProjectLinkType, IconType> = { github: FaGithub, youtube: FaYoutube, live: LuGlobe };

type ProjectLinksProps = { project: Project; className?: string };

/** Only the links the project has, packed flush right in the fixed order GitHub · YouTube · Live. */
export function ProjectLinks({ project, className }: ProjectLinksProps) {
  const links = PROJECT_LINK_TYPES.flatMap((type) => {
    const url = getProjectLink(project, type);
    return url ? [{ type, url }] : [];
  });
  if (links.length === 0) return null;

  return (
    <div className={cn("ml-auto flex shrink-0 justify-end gap-1", className)}>
      {links.map(({ type, url }) => {
        const Icon = ICONS[type];
        const label = `${PROJECT_LINK_LABELS[type]}: ${project.title}`;
        return (
          <a
            key={type}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={cn(
              "grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg focus-visible:transition-none",
            )}
          >
            <Icon aria-hidden className="size-4" />
          </a>
        );
      })}
    </div>
  );
}
