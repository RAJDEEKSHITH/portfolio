import type { Social } from "@/types/content";

/**
 * Social links — icons in the hero and footer, in this order.
 * platform: autocompletes from SOCIAL_ICONS in src/lib/icons.ts
 *   (x, linkedin, github, youtube, leetcode, codeforces, codechef, geeksforgeeks,
 *    hackerrank, instagram, medium, hashnode, devto, discord, kaggle, stackoverflow,
 *    email, website …). Any other string works too and gets a generic link icon.
 * label: optional, overrides the default name used for aria-label/tooltip.
 * Add = append a line. Remove = delete the line.
 */
export const socials = [
  { platform: "x", url: "https://x.com/Rajdeekshith" },
  { platform: "linkedin", url: "https://linkedin.com/in/rajdeekshith-tula" },
  { platform: "github", url: "https://github.com/RAJDEEKSHITH" },
  { platform: "youtube", url: "https://youtube.com/@Rajdeekshith" },
  { platform: "leetcode", url: "https://leetcode.com/u/Rajdeekshith" },
  // { platform: "codeforces", url: "https://codeforces.com/profile/yourhandle" },
] satisfies Social[];
