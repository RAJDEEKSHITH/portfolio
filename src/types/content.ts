import type { SocialPlatform } from "@/lib/icons";

/** "YYYY-MM", e.g. "2026-01". Validated at dev time by lib/validate.ts */
export type YearMonth = string;

export type Site = {
  name: string;
  role: string;
  tagline?: string;
  bio: string[];
  email: string;
  location?: string;
  avatar: string | null;
  url: string;
  /** driveUrl: Google Drive share link ("Anyone with the link"); preview/view/download URLs are derived in lib/resume.ts */
  resume: { driveUrl: string; updated: YearMonth };
  home: { experienceLimit: number; projectLimit: number };
};

export type NavItem = { label: string; to: string };

export type Social = {
  platform: SocialPlatform;
  url: string;
  label?: string;
};

export type WorkMode = "On-site" | "Remote" | "Hybrid";
export type EmploymentType = "Full-time" | "Part-time" | "Internship" | "Contract" | "Freelance";

export type Experience = {
  company: string;
  role: string;
  start: YearMonth;
  /** null = current job → "Present" + "Working" badge */
  end: YearMonth | null;
  location?: string;
  mode?: WorkMode;
  type?: EmploymentType;
  url?: string;
  tech?: string[];
  highlights?: string[];
};

export type Project = {
  title: string;
  description: string;
  year?: number;
  tech?: string[];
  links?: { live?: string; github?: string };
  /** path in /public, 16:9 webp, e.g. 1280×720 */
  image?: string;
  featured?: boolean;
};

export type SkillGroup = { group: string; items: string[] };
