import type { SkillGroup } from "@/types/content";

/**
 * Skills by category. Add/remove strings freely.
 * Names match icons case/punctuation-insensitively ("Next.js" == "nextjs").
 * Unknown names render as text-only chips.
 */
export const skills = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "Python","C++"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Zustand"] },
  { group: "Backend", items: ["Node.js", "Express", "FastAPI","MongoDB", "PostgreSQL"] },
  { group: "Tools", items: ["Git", "Docker", "Figma", "Postman", "Vercel"] },
] satisfies SkillGroup[];
