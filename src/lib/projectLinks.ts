import type { Project, ProjectLinkType } from "@/types/content";

/** Fixed display order: GitHub · YouTube · Live */
export const PROJECT_LINK_TYPES = ["github", "youtube", "live"] as const satisfies readonly ProjectLinkType[];

export const PROJECT_LINK_LABELS: Record<ProjectLinkType, string> = {
  github: "GitHub",
  youtube: "YouTube",
  live: "Live site",
};

/** The URL for one link type; blank strings count as missing (the dev validator warns about them). */
export const getProjectLink = (project: Pick<Project, "links">, type: ProjectLinkType): string | undefined => {
  const url = project.links?.[type]?.trim();
  return url ? url : undefined;
};

/** Where the project title links: live, else github, else youtube. */
export const getTitleHref = (project: Pick<Project, "links">): string | undefined =>
  getProjectLink(project, "live") ?? getProjectLink(project, "github") ?? getProjectLink(project, "youtube");
