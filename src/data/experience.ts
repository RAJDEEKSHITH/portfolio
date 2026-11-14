import type { Experience } from "@/types/content";

/**
 * Work experience. Append anywhere — auto-sorted (current first, then newest start).
 * Required: company, role, start ("YYYY-MM"), end ("YYYY-MM" | null = current)
 * Optional: location, mode, type, url, logo, tech[], highlights[], links[]
 *   mode: "On-site" | "Remote" | "Hybrid"
 *   type: "Full-time" | "Part-time" | "Internship" | "Contract" | "Freelance"
 *   logo: square image in public/logos, .svg or .webp → "/logos/acme.svg". Omit it → a letter tile.
 *   links: [{ label: "Case study", url: "https://…" }] → shown after the highlights.
 *
 * highlights support rich text: **bold** and [label](url). Nothing else (no italics, no HTML).
 *   - Lead with the result, then how: "Cut build time **from 9 min to 2 min** by moving to Vite."
 *   - At most ONE **bold** per bullet: the metric or outcome. Not every bullet needs one.
 *   - Real numbers only. Numbers are never bolded automatically.
 */
export const experience = [
  {
    company: "Company A",
    role: "Software Engineer",
    start: "2026-01",
    end: null,
    location: "City, Country",
    mode: "On-site",
    type: "Full-time",
    url: "https://example.com",
    logo: "/logos/company-a.svg",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "AWS"],
    highlights: [
      "Cut checkout page load time **from 3.2 s to 1.1 s** by moving rendering to the server.",
      "Built the internal design system; see the [write-up](https://example.com/blog/design-system).",
      "Another concrete contribution, no metric needed.",
    ],
    links: [{ label: "Case study", url: "https://example.com/case-study" }],
  },
  {
    company: "Company B",
    role: "Frontend Engineer",
    start: "2025-08",
    end: "2025-12",
    location: "Remote",
    mode: "Remote",
    type: "Full-time",
    tech: ["React", "Tailwind CSS"],
    highlights: ["Plain bullet with no logo, no bold and no link above or below."],
  },
] satisfies Experience[];
