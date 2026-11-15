import type { Project } from "@/types/content";

/**
 * Projects. Array order = display order.
 * Required: title, description. Optional: year, tech[], links{github, youtube, live}, image, featured.
 * links: every key optional → icon links (GitHub · YouTube · Live, always in that order). Omit a key rather than
 *   leaving it "". The title links to live, else github, else youtube.
 * image: path in /public, 16:9 webp (e.g. 1280×720), e.g. "/projects/my-app.webp"
 * featured: true → shown on Home (the first site.home.projectLimit), as a compact list row: title, year,
 *   link icons and the description clamped to 2 lines.
 * description supports rich text: **bold** and [label](url) (same rules as experience highlights).
 */
export const projects = [
  {
    title: "Project One",
    description: "What it is and why it's interesting, in one or two sentences.",
    year: 2026,
    tech: ["React", "Node.js", "MongoDB"],
    links: {
      github: "https://github.com/you/project-one",
      youtube: "https://www.youtube.com/@you",
      live: "https://example.com",
    },
    image: "/projects/project-one.webp",
    featured: true,
  },
  {
    title: "Project Two",
    description: "A second project with a **real outcome** up front, then how it was built.",
    year: 2025,
    tech: ["Next.js", "TypeScript"],
    links: { github: "https://github.com/you/project-two", live: "https://example.org" },
    featured: true,
  },
  {
    title: "Project Three",
    description: "A smaller tool or library; source only.",
    year: 2024,
    tech: ["Node.js"],
    links: { github: "https://github.com/you/project-three" },
  },
] satisfies Project[];
