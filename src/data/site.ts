import type { Site } from "@/types/content";

/**
 * Global site info. Edit freely.
 * Required: name, role, bio[] (paragraphs; rich text: **bold** and [label](url)), email, avatar (path or null), url,
 *   resume { driveUrl, updated: "YYYY-MM" }, home { experienceLimit, projectLimit } (both ≥ 1)
 * resume.driveUrl: Google Drive share link (Share → "Anyone with the link" → Viewer → Copy link).
 *   To update the resume, upload a new version in Drive (Manage versions); the link stays the same.
 * Optional: tagline, location
 * Also update the static <title>/description/OG tags in index.html to match.
 * avatar: square image (≥ 160×160 webp, ≤ 30 KB). Changing or nulling it → update/delete the avatar preload line in index.html.
 */
export const site = {
  name: "Your Name",
  role: "Full-Stack Engineer",
  tagline: "I build fast, thoughtful products for the web.",
  bio: ["Short paragraph about you. Keep it to 2–3 sentences."],
  email: "you@example.com",
  location: "City, Country",
  avatar: "/avatar.webp", // null to hide
  url: "https://yourdomain.com",
  resume: {
    driveUrl: "<paste Google Drive share link>",
    updated: "2026-11",
  },
  home: {
    experienceLimit: 3,
    projectLimit: 4,
  },
} satisfies Site;
