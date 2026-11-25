import type { SkillGroup } from "@/types/content";

/**
 * Skills by category. Add/remove strings freely; group order and item order = display order.
 * Every skill renders as a plain text chip (no icons), so any name works.
 */
export const skills = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "C++"] },
  {
    group: "Backend",
    items: ["Node.js", "Express.js", "FastAPI", "BullMQ", "Server-Sent Events", "WebSockets", "gRPC", "Vitest"],
  },
  { group: "AI & LLMs", items: ["LangChain", "LangGraph", "RAG", "Pinecone", "Qdrant", "MCP"] },
  { group: "Databases & Caching", items: ["PostgreSQL", "MongoDB", "Redis", "Drizzle ORM"] },
  { group: "Cloud & DevOps", items: ["AWS", "Docker", "Nginx", "CI/CD", "GitHub Actions", "Git", "Grafana k6"] },
  {
    group: "Frontend",
    items: ["React", "Next.js", "Zustand", "TanStack Query", "Redux Toolkit", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    group: "CS Fundamentals",
    items: ["Data Structures & Algorithms", "Object-Oriented Programming"],
  },
] satisfies SkillGroup[];
