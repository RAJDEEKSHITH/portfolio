import type { Site } from "@/types/content";

/**
 * Global site info. Edit freely.
 * Required: name, role, bio[] (paragraphs; rich text: **bold** and [label](url)), email, avatar (path or null), url,
 *   resume { driveUrl, updated: "YYYY-MM" }, home { experienceLimit, projectLimit (both ≥ 1), highlightLimit (≥ 0) }
 * home.highlightLimit: how many highlights per job Home shows (the first N, so order them by importance). 0 = none.
 * resume.driveUrl: Google Drive share link (Share → "Anyone with the link" → Viewer → Copy link).
 *   To update the resume, upload a new version in Drive (Manage versions); the link stays the same.
 * Optional: tagline, location
 * Also update the static <title>/description/OG tags in index.html to match.
 * avatar: square image (≥ 160×160 webp, ≤ 30 KB). Changing or nulling it → update/delete the avatar preload line in index.html.
 */
export const site = {
  name: "Rajdeekshith",
  role: "Backend & AI Engineer",
  tagline: "Backend and AI engineer building reliable services and safe LLM agents.",
  bio: [
    "I build backend systems and AI agents, mostly in TypeScript and Node.js. I care most about the parts that break in production: delivery guarantees, safety checks, and benchmarks that prove it works.",
  ],
  email: "rajdeekshith2912@gmail.com",
  location: "India",
  avatar: "/Toji.jpeg", // null to hide
  url: "https://yourdomain.com",
  resume: {
    driveUrl: "https://drive.google.com/file/d/1D4V_mfJQHYb6SxkwDHHM6TVfFj0-vKhW/view?usp=sharing",
    updated: "2026-11",
  },
  home: {
    experienceLimit: 3,
    projectLimit: 3,
    highlightLimit: 2,
  },
} satisfies Site;
