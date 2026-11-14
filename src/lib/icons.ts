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
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa6";
import {
  SiLeetcode,
  SiCodeforces,
  SiCodechef,
  SiGeeksforgeeks,
  SiHackerrank,
  SiHashnode,
  SiKaggle,
} from "react-icons/si";

// Step 4: only the social registry (SocialPlatform is needed by src/types/content.ts).
// Step 5 adds toKey, TECH_ICONS, the fallback and the getters.

type SocialMeta = { icon: IconType; label: string };

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
