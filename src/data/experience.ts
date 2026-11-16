import type { Experience } from "@/types/content";

/**
 * Work experience. Append anywhere — auto-sorted (current first, then newest start).
 * Required: company, role, start ("YYYY-MM"), end ("YYYY-MM" | null = current)
 * Optional: location, mode, type, url, logo, tech[], highlights[], links[]
 *   mode: "On-site" | "Remote" | "Hybrid"
 *   type: "Full-time" | "Part-time" | "Internship" | "Contract" | "Freelance"
 *   logo: square image in public/logos, .svg or .webp → "/logos/acme.svg". Omit it → a letter tile.
 *   links: [{ label: "Case study", url: "https://…" }] → shown after the highlights (Experience page only).
 *
 * Order highlights by importance; the first N (site.home.highlightLimit) appear on Home.
 *
 * highlights support rich text: **bold** and [label](url). Nothing else (no italics, no HTML).
 *   - Lead with the result, then how: "Cut build time **from 9 min to 2 min** by moving to Vite."
 *   - At most ONE **bold** per bullet: the metric or outcome. Not every bullet needs one.
 *   - Real numbers only. Numbers are never bolded automatically.
 *
 * No jobs yet? Keep the empty array: Home switches to projects-first and /experience redirects (src/lib/content.ts).
 */
export const experience = [] satisfies Experience[];
