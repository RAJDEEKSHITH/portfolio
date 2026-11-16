import type { Project } from "@/types/content";

/**
 * Projects. Array order = display order.
 * Required: title, description. Optional: highlights[], tech[], links{github, youtube, live}, featured.
 * links: every key optional → icon links (GitHub · YouTube · Live, always in that order). Omit a key rather than
 *   leaving it "". The title links to live, else github, else youtube.
 * highlights: bullets on the Projects page (not on Home). 2–4 recommended. Lead with the result; at most ONE
 *   **bold** metric/outcome per bullet; not every bullet needs one; real numbers only.
 * featured: true → shown on Home (the first site.home.projectLimit), as a compact list row: title,
 *   link icons and the description clamped to 2 lines.
 * description and highlights support rich text: **bold** and [label](url).
 */
export const projects = [
  {
    title: "Project One",
    description: "What it is and why it's interesting, in one or two sentences.",
    highlights: [
      "Cut page load time by **60%** by moving rendering to the edge and caching API responses.",
      "Built real-time sync with WebSockets so edits show up for every collaborator instantly.",
      "Wrote the [deployment guide](https://example.com/docs) used to onboard new contributors.",
    ],
    tech: ["React", "Node.js", "MongoDB"],
    links: {
      github: "https://github.com/you/project-one",
      youtube: "https://www.youtube.com/@you",
      live: "https://example.com",
    },
    featured: true,
  },
  {
    title: "Project Two",
    description: "A second project with a **real outcome** up front, then how it was built.",
    highlights: ["Shipped type-safe forms end to end, with one schema shared by the client and the server."],
    tech: ["Next.js", "TypeScript"],
    links: { github: "https://github.com/you/project-two", live: "https://example.org" },
    featured: true,
  },
  {
    title: "Project Three",
    description: "A smaller tool or library; source only.",
    tech: ["Node.js"],
    links: { github: "https://github.com/you/project-three" },
  },
] satisfies Project[];
