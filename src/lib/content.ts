import { experience } from "@/data/experience";
import { navigation } from "@/data/navigation";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import type { NavItem, Project, Site } from "@/types/content";

// Read through the declared types so `[]` in a data file (typed never[]) doesn't narrow anything here
const work: readonly Project[] = projects;
const home: Site["home"] = site.home;

/** No jobs → zero-experience mode: projects-first Home, no Experience page (IMPLEMENTATION.md §6.7). */
export const hasExperience = experience.length > 0;
export const hasProjects = work.length > 0;
/** Hidden only in zero-experience mode with no projects; with jobs, /projects always stays. */
export const showProjectsPage = hasExperience || hasProjects;

export function getVisibleNav(): NavItem[] {
  return navigation.filter(
    ({ to }) => (to !== "/experience" || hasExperience) && (to !== "/projects" || showProjectsPage),
  );
}

/** Featured projects if any are featured, else the first projects in array order; capped at site.home.projectLimit. */
export function getHomeProjects(): Project[] {
  const featured = work.filter((p) => p.featured);
  return (featured.length > 0 ? featured : work).slice(0, home.projectLimit);
}
