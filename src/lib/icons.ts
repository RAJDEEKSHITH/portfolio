import type { IconType } from "react-icons";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaGithub,
  FaYoutube,
  FaInstagram,
  FaMedium,
  FaDiscord,
  FaDev,
  FaStackOverflow,
  FaAws,
  FaEnvelope,
  FaGlobe,
  FaLink,
} from "react-icons/fa6";
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiGeeksforgeeks,
  SiHackerrank,
  SiHashnode,
  SiKaggle,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiFigma,
  SiVercel,
  SiThreedotjs,
  SiGreensock,
  SiFramer,
  SiRedux,
  SiPostman,
  SiVite,
  SiPrisma,
  SiRedis,
  SiGraphql,
} from "react-icons/si";

type SocialMeta = { icon: IconType; label: string };

/** "Next.js" → "nextjs", "Tailwind CSS" → "tailwindcss", "C++" → "c++" */
export const toKey = (s: string): string => s.toLowerCase().replace(/[^a-z0-9+#]/g, "");

export const SOCIAL_ICONS = {
  x: { icon: FaXTwitter, label: "X" },
  twitter: { icon: FaXTwitter, label: "X" },
  linkedin: { icon: FaLinkedinIn, label: "LinkedIn" },
  github: { icon: FaGithub, label: "GitHub" },
  youtube: { icon: FaYoutube, label: "YouTube" },
  instagram: { icon: FaInstagram, label: "Instagram" },
  medium: { icon: FaMedium, label: "Medium" },
  discord: { icon: FaDiscord, label: "Discord" },
  devto: { icon: FaDev, label: "DEV" },
  stackoverflow: { icon: FaStackOverflow, label: "Stack Overflow" },
  leetcode: { icon: SiLeetcode, label: "LeetCode" },
  codeforces: { icon: SiCodeforces, label: "Codeforces" },
  codechef: { icon: SiCodechef, label: "CodeChef" },
  geeksforgeeks: { icon: SiGeeksforgeeks, label: "GeeksforGeeks" },
  hackerrank: { icon: SiHackerrank, label: "HackerRank" },
  hashnode: { icon: SiHashnode, label: "Hashnode" },
  kaggle: { icon: SiKaggle, label: "Kaggle" },
  email: { icon: FaEnvelope, label: "Email" },
  website: { icon: FaGlobe, label: "Website" },
} satisfies Record<string, SocialMeta>;

/** Known keys autocomplete; any other string is still accepted. */
export type SocialPlatform = keyof typeof SOCIAL_ICONS | (string & {});

const FALLBACK_SOCIAL: SocialMeta = { icon: FaLink, label: "Link" };

export const TECH_ICONS: Record<string, IconType> = {
  react: SiReact,
  reactjs: SiReact,
  nextjs: SiNextdotjs,
  next: SiNextdotjs,
  typescript: SiTypescript,
  ts: SiTypescript,
  javascript: SiJavascript,
  js: SiJavascript,
  python: SiPython,
  tailwindcss: SiTailwindcss,
  tailwind: SiTailwindcss,
  nodejs: SiNodedotjs,
  node: SiNodedotjs,
  express: SiExpress,
  expressjs: SiExpress,
  mongodb: SiMongodb,
  mongo: SiMongodb,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  docker: SiDocker,
  git: SiGit,
  figma: SiFigma,
  vercel: SiVercel,
  threejs: SiThreedotjs,
  gsap: SiGreensock,
  framermotion: SiFramer,
  framer: SiFramer,
  motion: SiFramer,
  redux: SiRedux,
  postman: SiPostman,
  vite: SiVite,
  prisma: SiPrisma,
  redis: SiRedis,
  graphql: SiGraphql,
  aws: FaAws,
};

export const getSocial = (platform: string): SocialMeta =>
  (SOCIAL_ICONS as Record<string, SocialMeta>)[toKey(platform)] ?? FALLBACK_SOCIAL;

export const getTechIcon = (name: string): IconType | null => TECH_ICONS[toKey(name)] ?? null;

export const isKnownPlatform = (platform: string): boolean => toKey(platform) in SOCIAL_ICONS;
