import type { Project } from "@/types/content";

/**
 * Projects. Array order = display order.
 * Required: title, description. Optional: year, tech[], links{live,github}, image, featured.
 * image: path in /public, 16:9 webp (e.g. 1280×720), e.g. "/projects/my-app.webp"
 * featured: true → shown on Home.
 * description supports rich text: **bold** and [label](url) (same rules as experience highlights).
 */
export const projects = [
  {
    title: "Project One",
    description: "What it is and why it's interesting, in one or two sentences.",
    year: 2026,
    tech: ["React", "Node.js", "MongoDB"],
    links: { live: "https://example.com", github: "https://github.com/you/project-one" },
    image: "/projects/project-one.webp",
    featured: true,
  },
] satisfies Project[];
