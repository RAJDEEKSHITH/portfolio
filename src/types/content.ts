import type { SocialPlatform } from "@/lib/icons";

/** "YYYY-MM", e.g. "2026-01". Validated at dev time by lib/validate.ts */
export type YearMonth = string;

export type Site = {
  name: string;
  role: string;
  tagline?: string;
  /** Paragraphs. Rich text: **bold** and [label](url) — see components/ui/RichText */
  bio: string[];
  email: string;
  location?: string;
  avatar: string | null;
  url: string;
  /** driveUrl: Google Drive share link ("Anyone with the link"); preview/view/download URLs are derived in lib/resume.ts */
  resume: { driveUrl: string; updated: YearMonth };
  /** highlightLimit: how many highlights per job the Home preview shows (0 = header only) */
  home: { experienceLimit: number; projectLimit: number; highlightLimit: number };
};

export type NavItem = { label: string; to: string };

export type Social = {
  platform: SocialPlatform;
  url: string;
  label?: string;
};

export type WorkMode = "On-site" | "Remote" | "Hybrid";
export type EmploymentType = "Full-time" | "Part-time" | "Internship" | "Contract" | "Freelance";

export type ExperienceLink = { label: string; url: string };

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
  /** square logo in /public/logos, .svg or .webp, e.g. "/logos/acme.svg". No logo → monogram tile */
  logo?: string;
  tech?: string[];
  /** Rich text: **bold** and [label](url). Ordered by importance: Home shows the first site.home.highlightLimit */
  highlights?: string[];
  /** Shown after the highlights (Experience page only) */
  links?: ExperienceLink[];
};

/** All optional. Shown as icon links in a fixed order: GitHub · YouTube · Live (components/projects/ProjectLinks) */
export type ProjectLinkUrls = { github?: string; youtube?: string; live?: string };
export type ProjectLinkType = keyof ProjectLinkUrls;

export type Project = {
  title: string;
  /** Rich text: **bold** and [label](url) */
  description: string;
  /** Rich text bullets: **bold** and [label](url). Projects page only (2–4 recommended) */
  highlights?: string[];
  tech?: string[];
  links?: ProjectLinkUrls;
  featured?: boolean;
};

export type SkillGroup = { group: string; items: string[] };
