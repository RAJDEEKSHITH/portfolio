import type { Experience } from "@/types/content";

/**
 * Work experience. Append anywhere — auto-sorted (current first, then newest start).
 * Required: company, role, start ("YYYY-MM"), end ("YYYY-MM" | null = current)
 * Optional: location, mode, type, url, tech[], highlights[]
 *   mode: "On-site" | "Remote" | "Hybrid"
 *   type: "Full-time" | "Part-time" | "Internship" | "Contract" | "Freelance"
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
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "AWS"],
    highlights: [
      "What you did, with impact where possible (numbers beat adjectives).",
      "Another concrete contribution.",
    ],
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
    highlights: ["…"],
  },
] satisfies Experience[];
