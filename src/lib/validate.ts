import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { socials } from "@/data/socials";
import { YEAR_MONTH_RE } from "@/lib/dates";
import { isKnownPlatform } from "@/lib/icons";
import { getDriveId } from "@/lib/resume";
import type { Experience, Project, Site, Social } from "@/types/content";

const isPath = (s: string): boolean => s.startsWith("/") || s.startsWith("http");
const LOGO_RE = /^\/logos\/[^/]+\.(svg|webp)$/;

const findDuplicates = (values: string[]): string[] =>
  [...new Set(values.filter((v, i) => values.indexOf(v) !== i))];

/**
 * Dev-only content checks for src/data. Called once from main.tsx inside `import.meta.env.DEV`.
 * Logs ONE console.warn listing every problem. Never throws.
 */
export function validateContent(): void {
  // Widen to the declared types so checks don't depend on the literal shapes of the data
  const s: Site = site;
  const jobs: readonly Experience[] = experience;
  const links: readonly Social[] = socials;
  const work: readonly Project[] = projects;

  const problems: string[] = [];

  jobs.forEach(({ company, start, end, logo, links: jobLinks }, i) => {
    const at = `experience[${i}] (${company})`;
    if (logo !== undefined && !LOGO_RE.test(logo)) {
      problems.push(`${at}: logo "${logo}" must look like "/logos/name.svg" or "/logos/name.webp" (file in public/logos)`);
    }
    jobLinks?.forEach(({ label, url }, j) => {
      if (url.trim() === "") problems.push(`${at}: links[${j}] ("${label}") has an empty url`);
    });
    const startOk = YEAR_MONTH_RE.test(start);
    const endOk = end === null || YEAR_MONTH_RE.test(end);
    if (!startOk) problems.push(`${at}: start "${start}" must be "YYYY-MM"`);
    if (!endOk) problems.push(`${at}: end "${end}" must be "YYYY-MM" or null`);
    // Zero-padded "YYYY-MM" strings sort chronologically
    if (startOk && endOk && end !== null && end < start) {
      problems.push(`${at}: end "${end}" is before start "${start}"`);
    }
  });

  if (!YEAR_MONTH_RE.test(s.resume.updated)) {
    problems.push(`site.resume.updated "${s.resume.updated}" must be "YYYY-MM"`);
  }

  links.forEach(({ platform }, i) => {
    if (!isKnownPlatform(platform)) {
      problems.push(
        `socials[${i}]: unknown platform "${platform}" → generic link icon (add it to SOCIAL_ICONS in src/lib/icons.ts)`,
      );
    }
  });

  findDuplicates(links.map((l) => l.url)).forEach((url) =>
    problems.push(`socials: duplicate url "${url}" (React key collision)`),
  );
  findDuplicates(work.map((p) => p.title)).forEach((title) =>
    problems.push(`projects: duplicate title "${title}" (React key collision)`),
  );

  work.forEach(({ title, highlights, links: projectLinks }, i) => {
    highlights?.forEach((h, j) => {
      if (h.trim() === "") problems.push(`projects[${i}] (${title}): highlights[${j}] is empty (remove it or add text)`);
    });
    Object.entries(projectLinks ?? {}).forEach(([type, url]) => {
      if (url.trim() === "") problems.push(`projects[${i}] (${title}): links.${type} is empty (remove the key or add a URL)`);
    });
  });
  if (s.avatar !== null && !isPath(s.avatar)) {
    problems.push(`site.avatar "${s.avatar}" must start with "/" or "http" (or be null)`);
  }

  if (getDriveId(s.resume.driveUrl) === null) {
    problems.push(
      `site.resume.driveUrl: no Google Drive file ID found in "${s.resume.driveUrl}" → Resume page shows "Resume coming soon."`,
    );
  }

  (["experienceLimit", "projectLimit"] as const).forEach((key) => {
    if (s.home[key] < 1) problems.push(`site.home.${key} is ${s.home[key]}; must be ≥ 1`);
  });
  if (s.home.highlightLimit < 0) {
    problems.push(`site.home.highlightLimit is ${s.home.highlightLimit}; must be ≥ 0`);
  }

  if (problems.length === 0) return;
  console.warn(
    `[content] ${problems.length} problem${problems.length > 1 ? "s" : ""} in src/data:\n` +
      problems.map((p) => `  • ${p}`).join("\n"),
  );
}

// Dev: this module imports every data file but is loaded from main.tsx (not hot-reloadable), so a
// data edit would force a full page reload. Accepting updates here keeps edits to src/data/* as
// hot updates and re-runs the checks on the new content.
if (import.meta.hot) {
  import.meta.hot.accept((next) => next?.validateContent());
}
