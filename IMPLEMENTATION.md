# IMPLEMENTATION.md — Portfolio Build Spec

Complete build plan for a minimal, typographic, fast, fully responsive developer portfolio.

**Stack:** pnpm · React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 (≥ 4.3) · react-router-dom v7 · react-icons · fontsource.

Read `CLAUDE.md` first for the hard rules. Build **phase by phase** and pass each phase's acceptance checklist before moving on.

Starting point: Vite React + TypeScript project with Tailwind v4 already configured (`@tailwindcss/vite` plugin + `@import "tailwindcss"`). Nothing else.

---

## 0. Goals & non-goals

**Goals**
- Clean, content-first design: one centered column (`max-w-3xl`), strong typography, generous whitespace.
- Light / dark mode with **no flash** on load; follows the system until the user picks; remembers the choice.
- Pages: Home, Experience, Projects, Resume, 404.
- All content in typed `src/data/*.ts` arrays. Adding a job, project, skill or social = appending one object/string.
- Subtle CSS-only motion; smooth on low-end phones.
- Lighthouse (mobile) ≥ 95 in all four categories.
- Never breaks: 320px → 4K, long text, missing optional fields, unknown icons.

**Non-goals (do not build):** Zustand/Redux, Framer Motion, UI kits, CMS, blog, search palette, analytics, pets/mascots/cursor effects, particles, 3D.

---

## 1. Decisions

| Decision | Choice | Why |
|---|---|---|
| "Work" vs "Experience" | **Experience** at `/experience`; `/work` redirects there | Projects has its own page, so "Work" is ambiguous. "Experience" is what recruiters scan for. |
| Global state | **React Context** (theme only) | The only cross-cutting state. Zustand would add a dependency for nothing. |
| Animation | **Tailwind v4 + CSS keyframes** | Fade/rise on enter, hover, icon swap are all CSS. Zero JS, GPU-friendly. |
| Routing | `createBrowserRouter` + route `lazy` | `<ScrollRestoration>`, and lazy chunks load *before* the navigation commits (no Suspense flicker). |
| Head tags | React 19 native `<title>` / `<meta>` | No helmet library needed. |
| Icons | `react-icons` + registry keyed by normalized name | Owner writes `"leetcode"` or `"Next.js"`; unknown names degrade gracefully. |
| Fonts | `@fontsource-variable/*` (self-hosted) | No third-party request, no layout shift. |
| Colors | Six semantic CSS-variable tokens | Components can't drift between themes. |
| Resume | Google Drive share link (`site.resume.driveUrl`); Drive preview iframe on all sizes + Download / Open in Google Drive buttons | Updating = upload a new version in Drive, the link never changes. Drive's viewer works on phones, unlike an embedded PDF (iOS shows only page 1; Android Chrome doesn't render it inline). |
| Tech chips | Icon + label, monochrome | More readable than icon-only tiles; black brand icons (Next.js, Vercel) don't vanish in dark mode. |
| Formatted text | `**bold**` + `[label](url)` only, via a tiny tokenizer (`<RichText>`, §5.8) | Enough to highlight one metric or link a write-up. No Markdown library, no `dangerouslySetInnerHTML`, unsafe link schemes fall back to text. |
| Company logos | Optional `logo`; every job always shows a tile (logo or letter) | Rows align whether or not a logo exists. |
| Experience on Home | Preview: the same item design as the Experience page, showing the header plus the first `site.home.highlightLimit` highlights, and an always-visible "View all experience →" link (§6.1, §6.2) | Home stays scannable with no hidden UI or layout animation; the full details (tech, links, every highlight) live on `/experience`. |
| Bundle budget | Initial JS ≤ **140 KB gzip, hard cap** (§8) | Keeps the full icon registries. Over the cap → code-split, never raise it again. |

---

## 2. Phase 1 — Foundation

### 2.1 Audit & clean
1. Confirm in `package.json`: `react@^19`, `typescript`, `tailwindcss@^4`, `@tailwindcss/vite`. Confirm `pnpm-lock.yaml` exists.
2. Confirm `vite.config.ts` includes the `tailwindcss()` plugin.
3. Delete template boilerplate: `src/App.css`, `src/assets/react.svg`, `public/vite.svg`, the counter demo in `App.tsx` (then delete `App.tsx` — `router.tsx` replaces it).

### 2.2 Dependencies

```bash
pnpm add react-router-dom react-icons @fontsource-variable/hanken-grotesk @fontsource-variable/jetbrains-mono
pnpm add -D @types/node
```

> Font alternative: for a more neutral look swap Hanken Grotesk for `@fontsource-variable/inter` — change only the import in `main.tsx` and `--font-sans` in `index.css`.

### 2.3 Path alias `@/` → `src/`

`vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
```

`tsconfig.app.json` → inside `compilerOptions`:

```json
"strict": true,
"paths": { "@/*": ["./src/*"] }
```

No `baseUrl`: TypeScript 6 rejects it (TS5101), and `paths` alone resolves relative to the tsconfig. Set `"strict": true` explicitly.
(Keep whatever the template already enables: `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals`, etc.)

### 2.4 Design tokens (`src/index.css`)

```css
@import "tailwindcss";

/* Don't generate classes from the spec/docs (CLAUDE.md, IMPLEMENTATION.md, …) */
@source not "../*.md";

/* class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));

/* Raw theme values — the ONLY place colors are defined */
:root {
  --bg: #fafafa;
  --fg: #18181b;
  --muted: #71717a;   /* ≥ 4.5:1 on --bg */
  --subtle: #f4f4f5;  /* chip / hover fill */
  --border: #e4e4e7;
  --accent: #16a34a;  /* status dot + tiny highlights only */
  --logo: #ffffff;    /* company-logo tile fill (most logos are drawn for white) */
  color-scheme: light;
}
.dark {
  --bg: #0a0a0a;
  --fg: #fafafa;
  --muted: #a1a1aa;
  --subtle: #18181b;
  --border: #27272a;
  --accent: #22c55e;
  --logo: #f4f4f5;
  color-scheme: dark;
}

/* Utilities: bg-bg, text-fg, text-muted, bg-subtle, border-border, text-accent, bg-logo (+ /opacity) */
@theme inline {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-subtle: var(--subtle);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-logo: var(--logo);
}

@theme {
  --font-sans: "Hanken Grotesk Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, monospace;

  --animate-fade-up: fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  --animate-fade-in: fade-in 0.4s ease-out both;

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
}

@layer base {
  html {
    -webkit-text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
    scrollbar-gutter: stable; /* no horizontal jump between short and long pages */
  }
  body {
    @apply bg-bg font-sans text-fg antialiased;
  }
  ::selection {
    @apply bg-fg text-bg;
  }
}

/* Applied for one frame while switching theme so nothing animates */
.no-transitions,
.no-transitions * {
  transition: none !important;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

`bg-logo` is used only by `CompanyLogo` tiles that hold a logo image (§6.2). It's a light surface in both themes because most company logos are drawn for white; in dark mode it's toned down to `#f4f4f5` so it doesn't glare.

### 2.5 `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

    <!-- No-flash theme: must run before CSS/JS -->
    <script>
      (function () {
        try {
          var stored = localStorage.getItem("theme");
          var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
          var root = document.documentElement;
          root.classList.toggle("dark", dark);
          root.style.colorScheme = dark ? "dark" : "light";
        } catch (e) {}
      })();
    </script>

    <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <!-- Avatar preload (LCP image). Keep href in sync with site.avatar; delete this line if site.avatar is null -->
    <link rel="preload" as="image" href="/avatar.webp" fetchpriority="high" />

    <title>Your Name — Full-Stack Engineer</title>
    <meta name="description" content="Portfolio of Your Name." />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Your Name — Full-Stack Engineer" />
    <meta property="og:description" content="Portfolio of Your Name." />
    <meta property="og:image" content="/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

(The avatar preload is enabled since Step 12, when a placeholder `public/avatar.webp` was added. Keep its `href` in sync with `site.avatar`; delete it if `site.avatar` is `null`.)

### 2.6 Theme (`src/lib/theme.ts`, `src/context/ThemeContext.tsx`)

```ts
// src/lib/theme.ts
export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

export function getStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode — ignore */
  }
}

export function getDomTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.add("no-transitions");
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  void root.offsetHeight; // force reflow so the change applies without transitions
  requestAnimationFrame(() => root.classList.remove("no-transitions"));
}
```

```tsx
// src/context/ThemeContext.tsx
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { applyTheme, getDomTheme, getStoredTheme, storeTheme, type Theme } from "@/lib/theme";

type ThemeContextValue = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getDomTheme);

  // Follow OS changes only while the user hasn't picked explicitly
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (getStoredTheme()) return;
      const next: Theme = e.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = getDomTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    storeTheme(next);
    setTheme(next);
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
```

> Side effects live in the event handler, not inside a `setState` updater (StrictMode double-invokes updaters).

### 2.7 `cn` helper (`src/lib/cn.ts`)

```ts
export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(" ");
```

**Phase 1 acceptance**
- [ ] Reload with OS in dark mode → dark from the first frame (no white flash), including hard refresh.
- [ ] `bg-bg/80`, `text-muted`, `border-border`, `dark:` variants all work.
- [ ] Network tab: fonts served from the bundle, no Google Fonts requests.
- [ ] `import x from "@/…"` resolves in both Vite and `tsc`.

---

## 3. Phase 2 — Types & data

### 3.1 `src/types/content.ts`

```ts
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
  year?: number;
  tech?: string[];
  links?: ProjectLinkUrls;
  /** path in /public, 16:9 webp, e.g. 1280×720 */
  image?: string;
  featured?: boolean;
};

export type SkillGroup = { group: string; items: string[] };
```

### 3.2 `src/data/site.ts`

```ts
import type { Site } from "@/types/content";

/** Global site info. Edit freely. bio[] paragraphs support rich text: **bold** and [label](url). */
export const site = {
  name: "Your Name",
  role: "Full-Stack Engineer",
  tagline: "I build fast, thoughtful products for the web.",
  bio: [
    "Short paragraph about you. Keep it to 2–3 sentences.",
  ],
  email: "you@example.com",
  location: "City, Country",
  avatar: "/avatar.webp", // null to hide
  url: "https://yourdomain.com",
  resume: {
    // Drive → Share → "Anyone with the link" (Viewer) → Copy link
    driveUrl: "<paste Google Drive share link>",
    updated: "2026-11",
  },
  home: {
    experienceLimit: 3, // ≥ 1
    projectLimit: 3, // ≥ 1
    highlightLimit: 2, // ≥ 0: highlights per job on Home (the first N, so order them by importance)
  },
} satisfies Site;
```

### 3.3 `src/data/navigation.ts`

```ts
import type { NavItem } from "@/types/content";

/** Header nav. `to` must match a route in router.tsx. */
export const navigation = [
  { label: "Home", to: "/" },
  { label: "Experience", to: "/experience" },
  { label: "Projects", to: "/projects" },
  { label: "Resume", to: "/resume" },
] satisfies NavItem[];
```

### 3.4 `src/data/socials.ts`

```ts
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
  { platform: "x", url: "https://x.com/yourhandle" },
  { platform: "linkedin", url: "https://linkedin.com/in/yourhandle" },
  { platform: "github", url: "https://github.com/yourhandle" },
  { platform: "youtube", url: "https://youtube.com/@yourhandle" },
  { platform: "leetcode", url: "https://leetcode.com/u/yourhandle" },
  { platform: "codeforces", url: "https://codeforces.com/profile/yourhandle" },
  { platform: "email", url: "mailto:you@example.com" },
] satisfies Social[];
```

### 3.5 `src/data/experience.ts`

```ts
import type { Experience } from "@/types/content";

/**
 * Work experience. Append anywhere — auto-sorted (current first, then newest start).
 * Required: company, role, start ("YYYY-MM"), end ("YYYY-MM" | null = current)
 * Optional: location, mode, type, url, logo, tech[], highlights[], links[]
 *   mode: "On-site" | "Remote" | "Hybrid"
 *   type: "Full-time" | "Part-time" | "Internship" | "Contract" | "Freelance"
 *   logo: square image in public/logos, .svg or .webp → "/logos/acme.svg". Omit it → a letter tile.
 *   links: [{ label: "Case study", url: "https://…" }] → shown after the highlights (Experience page only).
 *
 * Order highlights by importance; the first N (site.home.highlightLimit) appear on Home.
 *
 * highlights support rich text: **bold** and [label](url). Nothing else (no italics, no HTML).
 *   - Lead with the result, then how: "Cut build time **from 9 min to 2 min** by moving to Vite."
 *   - At most ONE **bold** per bullet: the metric or outcome. Not every bullet needs one.
 *   - Real numbers only. Numbers are never bolded automatically.
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
    logo: "/logos/company-a.svg",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "AWS"],
    highlights: [
      "Cut checkout page load time **from 3.2 s to 1.1 s** by moving rendering to the server.",
      "Built the internal design system; see the [write-up](https://example.com/blog/design-system).",
      "Another concrete contribution, no metric needed.",
    ],
    links: [{ label: "Case study", url: "https://example.com/case-study" }],
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
    highlights: ["Plain bullet with no logo, no bold and no link above or below."],
  },
] satisfies Experience[];
```

The placeholder data deliberately covers both cases: Company A has a logo, one bold metric, an inline link and a `links` entry; Company B has none of them. `public/logos/company-a.svg` is a neutral placeholder logo.

### 3.6 `src/data/projects.ts`

```ts
import type { Project } from "@/types/content";

/**
 * Projects. Array order = display order.
 * Required: title, description. Optional: year, tech[], links{github, youtube, live}, image, featured.
 * links: every key optional → icon links (GitHub · YouTube · Live, always in that order). Omit a key rather than
 *   leaving it "". The title links to live, else github, else youtube.
 * featured: true → shown on Home (the first site.home.projectLimit), as a compact list row: title, year,
 *   link icons and the description clamped to 2 lines.
 * description supports rich text: **bold** and [label](url) (same rules as experience highlights).
 */
export const projects = [
  {
    title: "Project One",
    description: "What it is and why it's interesting, in one or two sentences.",
    year: 2026,
    tech: ["React", "Node.js", "MongoDB"],
    links: {
      github: "https://github.com/you/project-one",
      youtube: "https://www.youtube.com/@you",
      live: "https://example.com",
    },
    image: "/projects/project-one.webp",
    featured: true,
  },
  {
    title: "Project Two",
    description: "A second project with a **real outcome** up front, then how it was built.",
    year: 2025,
    tech: ["Next.js", "TypeScript"],
    links: { github: "https://github.com/you/project-two", live: "https://example.org" },
    featured: true,
  },
  {
    title: "Project Three",
    description: "A smaller tool or library; source only.",
    year: 2024,
    tech: ["Node.js"],
    links: { github: "https://github.com/you/project-three" },
  },
] satisfies Project[];
```

The placeholder data covers every link combination the layout has to handle: Project One has all three links, Project Two has GitHub + Live, and Project Three has GitHub only (and isn't featured, so Home shows "View all projects →").

**`src/lib/projectLinks.ts`** (pure helpers):
- `PROJECT_LINK_TYPES = ["github", "youtube", "live"] as const`, the fixed display order;
- `PROJECT_LINK_LABELS`: GitHub / YouTube / Live site;
- `getProjectLink(project, type)`: the URL, with blank strings treated as missing;
- `getTitleHref(project)`: live ?? github ?? youtube.

### 3.7 `src/data/skills.ts`

```ts
import type { SkillGroup } from "@/types/content";

/**
 * Skills by category. Add/remove strings freely.
 * Names match icons case/punctuation-insensitively ("Next.js" == "nextjs").
 * Unknown names render as text-only chips.
 */
export const skills = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "Python"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Zustand", "Three.js", "GSAP"] },
  { group: "Backend", items: ["Node.js", "Express", "MongoDB", "PostgreSQL"] },
  { group: "Tools", items: ["Git", "Docker", "Figma", "Postman", "Vercel"] },
] satisfies SkillGroup[];
```

### 3.8 `src/lib/dates.ts`

```ts
import type { Experience, YearMonth } from "@/types/content";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

type YM = { y: number; m: number };

export const YEAR_MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

const parse = (ym: YearMonth): YM => {
  const [y = 0, m = 1] = ym.split("-").map(Number);
  return { y, m };
};

const toIndex = ({ y, m }: YM): number => y * 12 + (m - 1);

const now = (): YM => {
  const d = new Date();
  return { y: d.getFullYear(), m: d.getMonth() + 1 };
};

export const formatMonth = (ym: YearMonth | null): string => {
  if (!ym) return "Present";
  const { y, m } = parse(ym);
  return `${MONTHS[m - 1] ?? ""} ${y}`;
};

export const formatRange = (start: YearMonth, end: YearMonth | null): string =>
  `${formatMonth(start)} – ${formatMonth(end)}`;

/** Inclusive month count: Jan–Mar = "3 mos" */
export const formatDuration = (start: YearMonth, end: YearMonth | null): string => {
  const total = toIndex(end ? parse(end) : now()) - toIndex(parse(start)) + 1;
  if (total <= 0) return "";
  const y = Math.floor(total / 12);
  const m = total % 12;
  return [y > 0 && `${y} yr${y > 1 ? "s" : ""}`, m > 0 && `${m} mo${m > 1 ? "s" : ""}`]
    .filter(Boolean)
    .join(" ");
};

export const isCurrent = (item: Pick<Experience, "end">): boolean => item.end === null;

/** Current jobs first, then by start desc. Never mutates input. */
export const sortExperience = <T extends Experience>(list: readonly T[]): T[] =>
  [...list].sort((a, b) => {
    if (isCurrent(a) !== isCurrent(b)) return isCurrent(a) ? -1 : 1;
    return toIndex(parse(b.start)) - toIndex(parse(a.start));
  });

/** Time since the earliest start, e.g. "1 yr 2 mos". Empty list → "". */
export const totalExperience = (list: readonly Pick<Experience, "start">[]): string => {
  if (list.length === 0) return "";
  const earliest = list.reduce((min, e) => (toIndex(parse(e.start)) < toIndex(parse(min)) ? e.start : min), list[0].start);
  return formatDuration(earliest, null);
};
```

### 3.9 `src/lib/icons.ts`

```ts
import type { IconType } from "react-icons";
import {
  FaXTwitter, FaLinkedinIn, FaGithub, FaYoutube, FaInstagram, FaMedium, FaDiscord,
  FaDev, FaStackOverflow, FaAws, FaEnvelope, FaGlobe, FaLink,
} from "react-icons/fa6";
import {
  SiLeetcode, SiCodeforces, SiCodechef, SiGeeksforgeeks, SiHackerrank, SiHashnode, SiKaggle,
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiPython, SiTailwindcss, SiNodedotjs,
  SiExpress, SiMongodb, SiPostgresql, SiDocker, SiGit, SiFigma, SiVercel, SiThreedotjs,
  SiGreensock, SiFramer, SiRedux, SiPostman, SiVite, SiPrisma, SiRedis, SiGraphql,
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
  react: SiReact, reactjs: SiReact,
  nextjs: SiNextdotjs, next: SiNextdotjs,
  typescript: SiTypescript, ts: SiTypescript,
  javascript: SiJavascript, js: SiJavascript,
  python: SiPython,
  tailwindcss: SiTailwindcss, tailwind: SiTailwindcss,
  nodejs: SiNodedotjs, node: SiNodedotjs,
  express: SiExpress, expressjs: SiExpress,
  mongodb: SiMongodb, mongo: SiMongodb,
  postgresql: SiPostgresql, postgres: SiPostgresql,
  docker: SiDocker,
  git: SiGit,
  figma: SiFigma,
  vercel: SiVercel,
  threejs: SiThreedotjs,
  gsap: SiGreensock,
  framermotion: SiFramer, framer: SiFramer, motion: SiFramer,
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
```

> **Verify icon exports on first build.** react-icons occasionally renames/removes brand icons. If `pnpm build` reports a missing export, replace it with the closest available icon or delete that entry — the fallbacks keep the UI working. Never `import * as`.

### 3.10 `src/lib/validate.ts` — dev-only content checks

Runs once from `main.tsx` inside `if (import.meta.env.DEV)`. Logs a **single grouped `console.warn`** listing problems so typos are caught instantly; never throws, never runs in production.

It also accepts its own hot updates in dev: `if (import.meta.hot) import.meta.hot.accept((next) => next?.validateContent());`. `validate.ts` imports every data file but is loaded from `main.tsx`, which can't hot-reload, so without this any `src/data/*` edit would force a full page reload. With it, data edits are hot updates and the checks re-run on the new content. Vite strips `import.meta.hot` from production builds.

Checks:
- every `experience.start` / non-null `end` and `site.resume.updated` matches `YEAR_MONTH_RE`
- `experience.logo`, when set, matches `/^\/logos\/[^/]+\.(svg|webp)$/` (a file in `public/logos/`)
- every `experience.links[].url` is non-empty
- `end` is not before `start`
- unknown social platforms (`!isKnownPlatform`)
- duplicate social URLs / duplicate project titles (would cause React key collisions)
- project `image` / `site.avatar` start with `/` or `http`
- every present `projects[].links.*` is non-empty (`links.youtube is empty (remove the key or add a URL)`)
- `getDriveId(site.resume.driveUrl)` (from `lib/resume.ts`, §6.5) finds a file ID; otherwise warn that the Resume page will show "Resume coming soon."
- `site.home.experienceLimit` and `projectLimit` ≥ 1; `site.home.highlightLimit` ≥ 0

**Phase 2 acceptance**
- [ ] `pnpm build` passes; typing `platform: "` in `socials.ts` autocompletes known platforms.
- [ ] Wrong `mode: "remote"` (lowercase) → TS error in the data file.
- [ ] New job with `end: null` anywhere in the array → appears first with "Working".
- [ ] `{ platform: "foo", url }` → generic link icon + dev warning, no crash.
- [ ] `"Zustand"` in skills → text-only chip; `"Next.js"` → chip with icon.
- [ ] `logo: "logo.png"` or `links: [{ label: "x", url: "" }]` → one dev warning each, no crash.

---

## 4. Phase 3 — Layout & routing

### 4.1 `src/router.tsx`

```tsx
import type { ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

export const pageLoaders = {
  experience: () => import("@/pages/Experience"),
  projects: () => import("@/pages/Projects"),
  resume: () => import("@/pages/Resume"),
} as const;

const lazyPage =
  (load: () => Promise<{ default: ComponentType }>) =>
  async () => ({ Component: (await load()).default });

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RootLayout error />,
    // First load of a lazy route renders nothing until its chunk arrives (a few ms). Declaring it
    // explicitly keeps that behaviour and silences React Router's "No HydrateFallback" warning.
    HydrateFallback: () => null,
    children: [
      { index: true, element: <Home /> },
      { path: "experience", lazy: lazyPage(pageLoaders.experience) },
      { path: "work", element: <Navigate to="/experience" replace /> },
      { path: "projects", lazy: lazyPage(pageLoaders.projects) },
      { path: "resume", lazy: lazyPage(pageLoaders.resume) },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
```

(`import type { ComponentType }` rather than the `React.` namespace: with `verbatimModuleSyntax` there's no global `React` to reference.)

### 4.2 `src/main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { router, pageLoaders } from "@/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);

// Warm lazy chunks after first paint so later navigations are instant
const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
idle(() => Object.values(pageLoaders).forEach((load) => void load()));

if (import.meta.env.DEV) {
  void import("@/lib/validate").then((m) => m.validateContent());
}
```

### 4.3 `RootLayout`

```tsx
type RootLayoutProps = { error?: boolean };

export function RootLayout({ error = false }: RootLayoutProps) {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-fg focus:px-3 focus:py-2 focus:text-sm focus:text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 pb-20 pt-10 sm:pt-16">
        <div key={pathname} className="animate-fade-in motion-reduce:animate-none">
          {error ? <NotFound /> : <Outlet />}
        </div>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
```

### 4.4 `Container`

```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = { as?: ElementType; className?: string; children: ReactNode };

export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-3xl px-5 sm:px-6", className)}>{children}</Tag>;
}
```

### 4.5 `Header`

- `<header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md">`
- `<Container className="flex h-14 items-center justify-between gap-4">`
- Left: `<nav aria-label="Primary">` → `<ul className="flex items-center gap-4 sm:gap-6">` of `NavLink`s from `navigation`:
  - base `text-sm sm:text-[15px] text-muted transition-colors hover:text-fg`
  - active `text-fg font-medium` (className callback; pass `end` for `/`)
  - **must stay on one line at every width; never a hamburger.** At 320px the 4 labels plus the toggle need about 307px of the 280px available. They fit from 375px up. So the `ul` is always `overflow-x-auto` with a hidden scrollbar, and it only actually scrolls when the links don't fit:
    - `ul`: `-mx-1 p-1 scroll-px-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`, so a scroll container doesn't clip the 4px focus ring;
    - each link: `onFocus={(e) => e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" })}`. Browsers don't scroll a *partly* visible focused element into view;
    - `<nav>` gets `min-w-0`, links `whitespace-nowrap`, and the toggle `shrink-0`.
    - **Step 16 addition:** on every `pathname` change, scroll the active link (`aria-current="page"`) into view with `scrollIntoView({ block: "nearest", inline: "nearest" })`. Use the default instant behaviour, or `behavior: "smooth"` only when `prefers-reduced-motion` isn't `reduce`. It must never scroll the page vertically (the header is sticky at the top, so `block: "nearest"` is a no-op; verify it). This fixes "Resume" staying clipped at 320px after navigating to `/resume`.
- Right: `<ThemeToggle />`.
- Optional hairline `border-b border-border/60` only once scrolled, via an IntersectionObserver on a 1px sentinel at the top of `<main>` (no scroll listeners).

### 4.6 `ThemeToggle`

- `button`, `type="button"`, `className="relative grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg"` + focus ring.
- `aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}`.
- Sun + moon icons (`react-icons/lu`: `LuSun`, `LuMoon`) stacked in the same grid cell (`[grid-area:1/1]`), crossfaded with `transition-[opacity,transform] duration-300`; the inactive icon gets `scale-75 rotate-45 opacity-0`.

### 4.7 `Footer` — very minimal

```tsx
export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col-reverse items-center gap-4 py-8 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted">© {new Date().getFullYear()} {site.name}</p>
        <SocialLinks size="sm" />
      </Container>
    </footer>
  );
}
```

Nothing else — no nav columns, no quotes, no "built with".

**Step 16 change (decided by the owner):** move `border-t border-border` off `<footer>` onto an inner element inside `<Container>`, e.g. `<Container><div className="flex flex-col-reverse items-center gap-4 border-t border-border py-8 sm:flex-row sm:justify-between">…</div></Container>`. Not on the Container itself (that would include its `px-5 sm:px-6`). The hairline then matches the text width exactly at every size and never reaches the scrollbar gutter.

### 4.8 `SocialLinks`

```tsx
// Read through the declared type so optional fields (label) exist even if no entry sets them.
// (Mapping `socials` directly fails with TS2339 when no entry has a `label`, because `satisfies` keeps literal shapes.)
const links: readonly Social[] = socials;

type SocialLinksProps = { size?: "sm" | "md"; className?: string };

export function SocialLinks({ size = "md", className }: SocialLinksProps) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-1", className)}>
      {links.map(({ platform, url, label }) => {
        const meta = getSocial(platform);
        const Icon = meta.icon;
        const name = label ?? meta.label;
        const external = url.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" };
        return (
          <li key={url}>
            <a
              href={url}
              aria-label={name}
              title={name}
              {...external}
              className={cn(
                "grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg",
              )}
            >
              <Icon aria-hidden className={size === "sm" ? "size-4" : "size-4.5"} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
```

Both sizes use a **36px** (`size-9`) hit area, the minimum tap target (CLAUDE.md, §9). `size` changes only the glyph: `sm` = 16px (`size-4`), `md` = 18px (`size-4.5`).
`flex-wrap` guarantees no overflow even with many socials at 320px.

**Phase 3 acceptance**
- [ ] All routes render inside the layout; `/work` → `/experience`; `/nope` → 404 with header/footer.
- [ ] Route change scrolls to top; back button restores scroll position.
- [ ] Header on one line at 320px.
- [ ] Footer: one row on `sm+`, stacked + centered on mobile.

---

## 5. Phase 4 — Shared UI

### 5.1 `Section`

```tsx
type SectionProps = { title?: string; action?: ReactNode; className?: string; children: ReactNode };

export function Section({ title, action, className, children }: SectionProps) {
  return (
    <section className={cn("mt-16 sm:mt-20", className)}>
      {title && (
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
```

### 5.2 `PageHeader` (used by Experience / Projects / Resume / 404)

`type PageHeaderProps = { title: ReactNode; subtitle?: ReactNode; className?: string }`. A `<header className="mb-10 sm:mb-12">` with the `<h1>` at page-title scale plus `break-words` (long titles wrap at 320px), then an optional `<p className="mt-3 text-[15px] leading-relaxed text-muted">` subtitle.

### 5.3 `Reveal` — staggered enter (CSS only)

```tsx
type RevealProps = { as?: ElementType; step?: number; className?: string; children: ReactNode };

export function Reveal({ as: Tag = "div", step = 0, className, children }: RevealProps) {
  return (
    <Tag
      className={cn("animate-fade-up motion-reduce:animate-none", className)}
      style={{ animationDelay: `${Math.min(step, 6) * 60}ms` }}
    >
      {children}
    </Tag>
  );
}
```

Wrap top-level page blocks (hero = 0, bio = 1, socials = 2, sections = 3…). Do not wrap every list item.

### 5.4 `TechChip`

```tsx
type TechChipProps = { name: string };

export function TechChip({ name }: TechChipProps) {
  // Direct registry read (same as getTechIcon): entries are module-level components, so identity is stable
  const Icon: IconType | undefined = TECH_ICONS[toKey(name)];
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-subtle px-2.5 py-1 text-xs font-medium text-fg/80">
      {Icon && <Icon aria-hidden className="size-3.5 shrink-0" />}
      <span className="whitespace-nowrap">{name}</span>
    </li>
  );
}
// parent: <ul className="flex flex-wrap gap-2">
```

Why not `getTechIcon(name)`: calling a function that returns a component during render fails `pnpm lint` (`react-hooks/static-components`, "component is created during render"), even though the registry entries are stable. A property read passes, the same pattern `SocialLinks` uses with `meta.icon`. `getTechIcon` stays exported for non-render use.

### 5.5 `StatusBadge`

```tsx
type StatusBadgeProps = { children?: ReactNode };

export function StatusBadge({ children = "Working" }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
      </span>
      {children}
    </span>
  );
}
```

### 5.6 `ExternalLink`

Extends `ComponentProps<"a">`. `group inline-flex items-center gap-1 text-sm font-medium text-fg underline-offset-4 hover:underline` + the standard focus ring + `LuArrowUpRight` (`size-3.5 shrink-0`, `aria-hidden`) with `transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5`. Adds `target="_blank" rel="noopener noreferrer"` automatically when `href` starts with `http`; caller props are spread after, so they can override.

### 5.7 `CopyEmail` + `useCopyToClipboard`

- `src/hooks/useCopyToClipboard.ts` returns `{ copied, copy }`. `copy(text): Promise<boolean>` uses `navigator.clipboard.writeText` and resolves `false` when the API is missing or rejects. `copied` resets after 1500ms; the timer is cleared on re-copy and on unmount.
- `CopyEmail`: a `rounded-lg` bordered button (`border border-border px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-subtle` + focus ring) showing `site.email` and a copy icon. On success the copy icon crossfades to a check (`text-accent`): both icons sit in one grid cell (`[grid-area:1/1]`), the hidden one gets `scale-75 opacity-0`, `transition-[opacity,transform] duration-200`. If `copy()` resolves `false`, fall back to `window.location.href = "mailto:…"`.
- `aria-label="Copy email address {email}"` (contains the visible text, WCAG 2.5.3), `title="Copy email"`.
- Visually hidden `<span aria-live="polite">` announces "Email copied" (empty otherwise).
- Long emails: `truncate` on the text, inside `min-w-0` parents (`flex min-w-0` wrapper, `min-w-0 max-w-full` button).

### 5.8 `RichText` + `src/lib/richText.ts`

Owner-written strings (`site.bio[]`, `experience.highlights[]`, `project.description`) support exactly two markers:

| Write | Renders |
|---|---|
| `**text**` | `<strong className="font-medium text-fg">` |
| `[label](url)` | a link: `text-fg underline underline-offset-4 decoration-border transition-colors hover:decoration-fg` + focus ring |

- `src/lib/richText.ts` is a pure tokenizer: `parseRichText(input): RichToken[]` with `RichToken = text | bold | link`. One regex, `/\*\*([^*\s](?:[^*]*[^*\s])?)\*\*|\[([^\]
]+)\]\(([^()\s]+)\)/g`; adjacent text merges.
- `RichText({ text })` maps tokens to React nodes and returns a fragment, so wrap it in a `<p>`/`<li>`. **Never `dangerouslySetInnerHTML`.** HTML in the input is shown as literal text.
- Anything that isn't a complete, well-formed marker renders as plain text: `**unclosed`, `** spaced **`, `[](url)`, a URL with spaces or parentheses.
- No nesting (no link inside bold), no italics, no headings, no lists.
- **Link schemes** (`getLinkKind`):
  - `http(s)://host` → `<a target="_blank" rel="noopener noreferrer">`;
  - `/path` → router `<Link>`;
  - `mailto:` → plain `<a>`;
  - **anything else** (`javascript:`, `data:`, `//host`, relative paths) → the label as plain text.
- Numbers are never bolded automatically. Writing guidance lives in the `experience.ts` header and CLAUDE.md's owner table: lead with the result, at most one bold metric/outcome per bullet, not every bullet needs one, real numbers only.

---

## 6. Phase 5 — Pages

Every page renders its own `<title>` and `<meta name="description">` (React 19 hoists them):

```tsx
<title>{`Projects — ${site.name}`}</title>
<meta name="description" content={`Projects by ${site.name}.`} />
```

Home title: `` `${site.name} — ${site.role}` ``; Home description: `site.tagline`, falling back to `` `${site.name}, ${site.role}.` ``.

### 6.1 Home (`/`)

Each block in `<Reveal step={n}>`:

1. **Hero** — a row with the avatar and the name/role block **side by side at all widths** (the Reveal is `flex items-center gap-4 sm:gap-5`; never stacked):
   - avatar: `size-16 shrink-0 rounded-full bg-subtle object-cover sm:size-20`, `alt=""` (the name is right beside it), `width={80} height={80}`, `fetchPriority="high"`, not lazy;
   - name/role block, `min-w-0 flex-1`: name (`<h1>`, page-title scale, `break-words`), then a `mt-3 flex flex-wrap items-center gap-x-2 gap-y-1` row (meta scale) with `<p className="mr-2">{role · location}</p>` + `<CopyEmail />`;
   - if `site.avatar` is null, the image is omitted and the name/role block leads alone, flush with the content edge.
2. **Bio** — `site.bio` paragraphs, each `<p><RichText text={paragraph} /></p>`, body scale, `mt-8 max-w-prose space-y-3` (the Reveal itself carries the classes).
3. **Socials** — `mt-6`, `<SocialLinks className="-ml-2" />` (aligns icon glyphs with the text edge).
4. **Experience** — `Section title="Experience"` (no header action). First `site.home.experienceLimit` of `sortExperience(experience)` as **`preview`** `ExperienceItem`s (§6.2), laid out exactly like the Experience page: `divide-y divide-border`, each item wrapped in `py-8 first:pt-0 last:pb-0` (the same visible rhythm; `last:pb-0` lets the link or the next section set the gap below). Below the list, a `Link` to `/experience` reading **"View all experience →"**, shown **whenever there is any experience** (the section itself hides when there is none), because tech, links and the remaining highlights only live on that page. Action-link classes (`ACTION`, shared with "View all projects →"): `mt-8 inline-block text-sm font-medium text-muted transition-colors hover:text-fg` + focus ring.
5. **Featured projects**: `Section title="Featured projects"` (no header action). It renders the first `site.home.projectLimit` (3) `featured` projects as a **list, not cards**, with the same rhythm as the Experience preview: `divide-y divide-border`, each row wrapped in `py-8 first:pt-0 last:pb-0`.
   - **`ProjectRow`** (`src/components/projects/ProjectRow.tsx`) is an `<article>` holding:
     - `ProjectHeader` (below);
     - then the description, `<p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted"><RichText … /></p>`.
   - The row has no image, tech chips or highlights.
   - Below the list, **"View all projects →"** (`Link` to `/projects`, `ACTION` classes) appears **only when `projects.length` is greater than the number shown**.
   - The section is hidden if no project is featured.
6. **Skills** — `grid gap-x-6 gap-y-4 sm:grid-cols-[8rem_1fr]`: group label (`text-sm text-muted sm:pt-1`, centred on the first chip row) + chip list (`-mt-2 sm:mt-0 flex flex-wrap gap-2`, so a stacked label sits 8px above its chips on mobile).

Reveal steps 0–5 in this order. Sections with no data (no jobs, no featured projects, no skills, empty bio) render nothing.

### 6.2 `ExperienceItem` + `CompanyLogo`

```tsx
type ExperienceItemProps = {
  item: Experience;
  /** Home only: header + the first site.home.highlightLimit highlights; no tech, links or duration */
  preview?: boolean;
  /** Company heading level: "h3" under a Section h2 (Home), "h2" on the Experience page (directly under the h1) */
  headingAs?: "h2" | "h3";
};
```

Two modes, one design. The Experience page passes `headingAs="h2"` and shows everything. Home passes `preview` (the heading stays `h3` under the Section's h2). There is no expand/collapse anywhere: no chevron, no panel, no `useId`, no `inert`, no layout animation.

In `preview` mode the item reads `site.home.highlightLimit` itself (typed as `Site["home"]` so the limit isn't narrowed to the literal) and renders `highlights.slice(0, max(0, limit))`.

**`CompanyLogo`** (`src/components/experience/CompanyLogo.tsx`). Every item **always** shows a tile, so rows align whether or not a logo exists:

```tsx
type CompanyLogoProps = { company: string; logo?: string };

const TILE = "grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-border sm:size-12";

export function CompanyLogo({ company, logo }: CompanyLogoProps) {
  if (logo) {
    return (
      <div className={cn(TILE, "bg-logo")}>
        <img src={logo} alt="" width={48} height={48} loading="lazy" decoding="async" className="size-full object-contain p-1.5" />
      </div>
    );
  }
  return (
    <div aria-hidden className={cn(TILE, "bg-subtle text-sm font-semibold text-muted")}>
      {company.trim().charAt(0).toUpperCase()}
    </div>
  );
}
```

`alt=""` and `aria-hidden` because the company name is right next to the tile.

**Layout:** `flex gap-4` → `[tile][content: min-w-0 flex-1]`. Everything (title row, labels, chips, bullets, links) sits in the content column, so all of it shares one left edge.

```
<article class="flex gap-4">
  <CompanyLogo company={company} logo={logo} />
  <div class="min-w-0 flex-1">
    <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <div class="min-w-0">
        <{headingAs} class="flex flex-wrap items-center gap-2 text-base font-medium sm:text-lg">
          {url ? <a href={url} target="_blank" rel="noopener noreferrer" class="break-words … focus ring">{company}</a> : <span class="break-words">{company}</span>}
          {isCurrent(item) && <StatusBadge />}
        </{headingAs}>
        <p class="text-[15px] text-muted">{[role, type].filter(Boolean).join(" · ")}</p>
      </div>
      <div class="shrink-0 text-sm text-muted tabular-nums sm:text-right">
        <p>{formatRange(start, end)}{duration && <span class="hidden sm:inline"> · {duration}</span>}</p>   // duration = preview ? "" : formatDuration(start, end) — "" (future start) → no stray "·"
        {meta && <p>{meta}</p>}         // meta = [location, mode].filter(Boolean).join(" · ")
      </div>
    </div>

    {details}
  </div>
</article>
```

**Details.** Each block renders only if its data exists, and each has `mt-4`:

1. **Technologies & Tools** (full mode only): label `<p className="text-sm font-medium text-muted">Technologies &amp; Tools</p>`, then `<ul className="mt-2 flex flex-wrap gap-2">` of `TechChip`s.
2. **What I've done:** the same label style, then `<ul className="mt-2 space-y-2 text-[15px] leading-relaxed text-muted">` with `<li className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:size-1 before:rounded-full before:bg-muted/60"><RichText text={h} /></li>`.
3. **Links** (full mode only): `<ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">` of `<li><ExternalLink href={url}>{label}</ExternalLink></li>`.

The details render directly under the title row. There's no `border-t`, because the list's `divide-y` already separates rows.

**Preview mode (Home only):** the same tile and title/date row (duration hidden), then the first N highlights as the **same bullet list**, `mt-4` directly under the header and **without the "What I've done" label** (it's the only block, so the label adds nothing). No tech chips, no links row. No highlights, or `highlightLimit: 0` → just the header.

Missing optional fields must render nothing: no empty rows, no stray "·", no empty labels.

### 6.3 Experience (`/experience`)

- `PageHeader` "Experience" + subtitle `` `${totalExperience(items)} of experience.` `` (`lib/dates.ts`, computed from the earliest start, never hard-coded; omitted when the list is empty). Description: `` `Work experience of ${site.name}, ${site.role}.` ``.
- `sortExperience(experience)` → full `ExperienceItem`s (`headingAs="h2"`) in `divide-y divide-border`, each `py-8 first:pt-0`. Every block shows, with its label. Home's preview list uses the same wrapper classes.

### 6.4 Projects (`/projects`)

- `PageHeader` "Projects" + subtitle "Things I've built, with links to the live sites and source code." Description: `` `Projects by ${site.name}.` ``.
- `grid gap-5 sm:grid-cols-2`, cards `headingAs="h2"`.
- **`ProjectLinks`** (`src/components/projects/ProjectLinks.tsx`), used on Home rows and Projects cards. Props: `project`, `className?`.
  - **It renders only the links the project has,** packed together, in the fixed order GitHub (`FaGithub`) · YouTube (`FaYoutube`) · Live (`LuGlobe`). There are no placeholders and no shared slots.
  - With no links it renders nothing, so the title block gets the full row width.
  - The container is `ml-auto flex shrink-0 justify-end gap-1`. **The group sits flush right:** the last icon's 36px box always ends at the content's right edge. On Home that's the same x as the Experience date column; on a card it's the card's inner padding edge.
  - **A link:** `<a>` with `grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg` plus the focus ring, `target="_blank" rel="noopener noreferrer"`, and `aria-label` and `title` like `"GitHub: Project One"` / `"Live site: Project One"`. The icon is `size-4 aria-hidden`.
- **`ProjectHeader`** (`src/components/projects/ProjectHeader.tsx`) is the shared title row for `ProjectRow` and `ProjectCard`. Props: `project`, `headingAs?: "h2" | "h3"` (default `"h3"`).
  - The row is `flex items-start justify-between gap-3`.
  - **Left** is a `flex min-w-0 flex-wrap items-baseline gap-x-3` block. It holds the title heading (item-title scale, `min-w-0 break-words`) and the year (meta scale; it wraps below the title when space is short).
    - The title links to `getTitleHref(project)` (`_blank`, `noopener noreferrer`, hover underline and focus ring).
    - With no links, the title is plain text.
  - **Right** is `<ProjectLinks className="-my-1.5 sm:-my-1" />`. The negative margins centre the 36px icons on the first title line (24px, or 28px from `sm`) without making the row taller.
  - **The icons stay on the title row at 320px;** the title wraps beside them.
- `ProjectCard` (`src/components/projects/ProjectCard.tsx`) props: `project` and `headingAs?: "h2" | "h3"` (`"h2"` on the Projects page, so headings don't skip, same as `ExperienceItem`). The old `compact` variant is removed (Home uses `ProjectRow`).
  - `article.group flex flex-col overflow-hidden rounded-lg border border-border transition-colors hover:border-fg/20`
  - Image (optional): wrapper `overflow-hidden bg-subtle aspect-video`; `img` `size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] motion-reduce:transition-none`, `width={1280} height={720} loading="lazy" decoding="async"`, `alt={title}`.
  - Body `flex flex-1 flex-col p-4 sm:p-5`:
    - `ProjectHeader` (title + year on the left, `ProjectLinks` on the right);
    - the description `mt-2` (body scale, `<p><RichText text={description} /></p>`, §5.8);
    - tech chips `mt-4 flex flex-wrap gap-2`.

    The text "Live" / "Source" links are gone, replaced by the icon links in the title row.
  - No whole-card anchor (avoids nested links). The title links via `getTitleHref` (live ?? github ?? youtube).
  - Placeholder `public/projects/project-one.webp` (neutral 1280×720 grey) exists so the sample data doesn't 404; the owner replaces it.

### 6.5 Resume (`/resume`)

The resume PDF lives in Google Drive, shared as "Anyone with the link → Viewer". `site.resume.driveUrl` holds the share link, and every URL is derived from its file ID. To update the resume, upload a new version in Drive (Manage versions); the link stays the same.

`src/lib/resume.ts`:

```ts
const DRIVE_ID_RE = /\/d\/([\w-]+)|[?&]id=([\w-]+)/;

export type ResumeLinks = { preview: string; view: string; download: string };

/** File ID from ".../file/d/<ID>/..." or "...?id=<ID>"; null if neither is present. */
export const getDriveId = (url: string): string | null => {
  const m = DRIVE_ID_RE.exec(url);
  return m?.[1] ?? m?.[2] ?? null;
};

export const getResumeLinks = (url: string): ResumeLinks | null => {
  const id = getDriveId(url);
  if (!id) return null;
  return {
    preview: `https://drive.google.com/file/d/${id}/preview`,
    view: `https://drive.google.com/file/d/${id}/view`,
    download: `https://drive.google.com/uc?export=download&id=${id}`,
  };
};
```

Page (`const links = getResumeLinks(site.resume.driveUrl)`):

- `PageHeader` "Resume", subtitle `Updated ${formatMonth(site.resume.updated)}`.
- **`links` is null** (placeholder or malformed link): render only "Resume coming soon." at body scale. No buttons, no iframe. (The dev validator warns about this, see §3.10.)
- Action row `flex flex-wrap gap-3`. Both links use `target="_blank" rel="noopener noreferrer"`:
  - **Download** → `links.download`, primary: `h-10 px-4 rounded-lg bg-fg text-bg text-sm font-medium inline-flex items-center gap-2 transition-opacity hover:opacity-90`, with a leading `LuDownload` icon (`size-4 shrink-0`, `aria-hidden`)
  - **Open in Google Drive** → `links.view`, secondary: same size, `border border-border hover:bg-subtle transition-colors`, with a trailing `LuArrowUpRight` icon (`size-4 shrink-0`, `aria-hidden`)
  - Both carry the standard focus ring. The shared classes live in a `BUTTON` constant in `Resume.tsx`, combined with `cn()`. At 320px the two buttons wrap onto two rows (119 + 12 + 192px > 280px); that's expected.
- Meta description: `` `Resume of ${site.name}, ${site.role}.` ``
- Preview iframe on **all** screen sizes, with a centred "Loading preview…" behind it so the box is never blank while it loads:

  ```tsx
  <div className="relative mt-8 overflow-hidden rounded-lg border border-border bg-subtle">
    <p aria-hidden className="absolute inset-0 grid place-items-center text-sm text-muted">Loading preview…</p>
    <iframe
      src={links.preview}
      title="Resume preview"
      loading="lazy"
      allow="autoplay"
      className="relative block aspect-[1/1.414] max-h-[85dvh] w-full"
    />
  </div>
  ```

  The wrapper carries `mt-8`, the border, the radius and `bg-subtle` instead of the iframe; `overflow-hidden` clips the iframe to the rounded corners. An iframe paints its own background over anything behind it, so `bg-subtle` on the iframe would hide the loading text. The Drive viewer covers the text once it loads. `block` removes the inline baseline gap under the iframe.

### 6.6 NotFound

`PageHeader` "404" / "This page doesn't exist." + `Link` "Go home →" (`text-sm font-medium text-fg underline-offset-4 hover:underline` + focus ring). Meta description: "This page doesn't exist." Rendered inside normal header/footer.

**Phase 5 acceptance**
- [ ] One `<h1>` per page; heading levels don't skip.
- [ ] `<title>` updates on every route (check the tab).
- [ ] Removing any optional field from any item leaves no gaps or stray separators.
- [ ] 1 job / 0 featured projects → sections hide or adapt gracefully (no empty headings, no "View all projects" when nothing more; "View all experience" shows whenever there's any experience).
- [ ] Very long company name / role / email / URL wraps without overflow at 320px.
- [ ] Experience rows align: logo tiles and letter tiles are the same size, and every text block shares the content column's left edge.
- [ ] Rich text renders `**bold**` and `[label](url)` only; broken markers show as plain text.

---

## 7. Phase 6 — Motion & polish

Allowed motion (nothing else):

| Where | Effect | How |
|---|---|---|
| Route change | content fades in 0.4s | keyed wrapper `animate-fade-in` |
| Page load | sections rise 8px + fade, 60ms stagger | `<Reveal step>` |
| Links / icons | color 150ms | `transition-colors` |
| Arrow links | arrow nudges ↗ 2px | `group-hover:translate-*` |
| Project image | scale 1.02 over 500ms | `transition-transform` |
| Theme toggle | sun/moon crossfade + rotate | `transition-[opacity,transform] duration-300` |
| Copy email | copy ↔ check icon crossfade, 200ms | `transition-[opacity,transform] duration-200` |
| Current job | pinging dot | `animate-ping`, hidden under reduced motion |
| Theme switch (optional Step 19) | dawn/dusk clip reveal, 650ms | View Transitions API (§7.1) |

Durations: 150–200ms hover/press, 300ms state toggles (theme icon), 400–600ms enter, 650ms for the Step 19 theme transition. No `transition-all`, no scroll listeners, everything off with reduced motion. **No layout-property animation anywhere** (no width/height/`grid-template-rows`/top/left). Don't set `scroll-behavior: smooth` globally (fights ScrollRestoration).

Polish: consistent focus rings; inverted `::selection`; SVG favicon monogram that reads on light and dark tabs (use a `prefers-color-scheme` media query inside the SVG).

### 7.1 Dawn/dusk theme transition — OPTIONAL, Step 19, branch `feat/theme-transition`

Built last, on its own branch, only if the owner wants it. **The owner creates the branch**, since Claude never runs git commands that change the repo. Claude checks `git branch --show-current` first and stops if it isn't `feat/theme-transition`. Until it's merged, View Transitions are not allowed anywhere (CLAUDE.md).

**Effect** (View Transitions API, whole page, centre origin; the light snapshot is always the moving one):
- **Light → dark ("dusk"):** the *old* light snapshot shrinks into the centre, revealing dark underneath.
- **Dark → light ("dawn"):** the *new* light snapshot grows out of the centre, over the old dark one.
- 650ms, `cubic-bezier(0.65, 0, 0.35, 1)`. `ellipse(75% 75%)` covers the corners of any viewport.

**CSS** (`src/index.css`, plain CSS outside `@theme`):

```css
/* Dawn/dusk theme transition (§7.1). Inert unless html[data-theme-transition] is set. */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
html[data-theme-transition="dusk"]::view-transition-old(root) {
  z-index: 2;
  animation: theme-dusk 650ms cubic-bezier(0.65, 0, 0.35, 1) both;
}
html[data-theme-transition="dawn"]::view-transition-new(root) {
  z-index: 2;
  animation: theme-dawn 650ms cubic-bezier(0.65, 0, 0.35, 1) both;
}
@keyframes theme-dusk {
  from { clip-path: ellipse(75% 75% at 50% 50%); }
  to   { clip-path: ellipse(0% 0% at 50% 50%); }
}
@keyframes theme-dawn {
  from { clip-path: ellipse(0% 0% at 50% 50%); }
  to   { clip-path: ellipse(75% 75% at 50% 50%); }
}
```

**JS** (`ThemeContext.toggleTheme`; `flushSync` comes from `react-dom`, so no new dependency):

```tsx
const transitioning = useRef(false);

const toggleTheme = useCallback(() => {
  if (transitioning.current) return; // ignore clicks while a transition runs
  const next: Theme = getDomTheme() === "dark" ? "light" : "dark";
  const commit = () => {
    applyTheme(next); // still adds .no-transitions for one frame
    storeTheme(next);
    flushSync(() => setTheme(next)); // DOM must be final before the "new" snapshot is taken
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof document.startViewTransition !== "function" || reduce) {
    commit(); // instant switch, exactly as before
    return;
  }

  const root = document.documentElement;
  root.dataset.themeTransition = next === "dark" ? "dusk" : "dawn";
  transitioning.current = true;
  const vt = document.startViewTransition(commit);
  void vt.finished.finally(() => {
    delete root.dataset.themeTransition;
    transitioning.current = false;
  });
}, []);
```

Rules:
- Keep `.no-transitions`, so colour transitions don't lag inside the new snapshot.
- The OS-theme `change` listener stays instant: no transition.
- No API support, or reduced motion → instant switch.
- Only the toggle button triggers it.
- Never use View Transitions for route changes.

---

## 8. Phase 7 — Performance

Targets (prod, mobile Lighthouse): **Performance ≥ 95, CLS < 0.02, LCP < 1.8s, initial JS ≤ 140 KB gzip (hard cap).**

- Home eager; other pages lazy route chunks, warmed on idle.
- `react-icons`: named imports only. The **full `SOCIAL_ICONS` and `TECH_ICONS` registries are kept on purpose**, so the owner can add socials or skills by editing data only. `getSocial()`/`getTechIcon()` look icons up by string, so every registered icon ships, used or not. That's why the budget is above the original ~110 KB:
  - Step 8 (owner): raised to 130 KB, at 114.2 KB with the full social registry.
  - Consolidation pass after Step 9 (owner): raised to **140 KB, as a hard cap**, once `TechChip` on the eager Home page pulled in all of `TECH_ICONS` (+15.7 KB; 131.3 KB measured).

  **If the cap is exceeded later, the fix is code-splitting** (e.g. lazy-load a below-the-fold Home section or the tech-icon registry, keeping chip sizes reserved so nothing shifts). **Never raise the cap again, and don't trim the registries.**
- Images: WebP/AVIF at ≤ 2× display size. Avatar ≤ 30 KB, project images ≤ 120 KB. Always `width`/`height`.
- Avatar preloaded in `index.html` (LCP element).
- No layout shift on theme toggle, route change, or font load.
- `backdrop-blur` only on the header.

---

## 9. Phase 8 — Responsive, a11y & cross-browser QA

At **320, 375, 414, 768, 1024, 1440, 1920px**, light and dark:

- [ ] No horizontal scroll (`document.documentElement.scrollWidth === window.innerWidth`).
- [ ] Header on one line; active nav state correct.
- [ ] Dates stack under titles on mobile, right-aligned on `sm+`.
- [ ] Chips, socials, buttons wrap cleanly.
- [ ] Project grid: 1 column < 640px, 2 columns ≥ 640px; cards in a row align.
- [ ] Project link icons: only the links a project has, packed in the order GitHub · YouTube · Live, flush right, so the last icon ends at the content's right edge (on Home, aligned with the Experience date column); no empty placeholders; a project with no links gets a full-width title row.
- [ ] Resume: Drive preview iframe at every width without overflow (capped at `85dvh`); buttons wrap.
- [ ] Tap targets ≥ 36px (social icons, theme toggle); no hover-only information.
- [ ] Experience: logo and letter tiles the same size at every width; title row, labels, chips, bullets and links share the content column's left edge.
- [ ] Home shows the first N highlights (`site.home.highlightLimit`), matching the Experience page style (same tiles, title/date rows, bullets, `divide-y` spacing); "View all experience →" is always shown when there's experience.
- [ ] Rich-text links: visible focus; external ones open in a new tab; `/path` ones navigate client-side.
- [ ] iOS Safari: no white flash, sticky header OK, `dvh` correct with toolbar.
- [ ] Keyboard: skip link, full Tab order, focus always visible.
- [ ] OS reduced-motion on → no animation.
- [ ] 200% zoom → readable, no overlap.

---

## 10. Phase 9 — Deploy

SPA fallback for deep links:

- **Vercel** — `vercel.json`:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
  ```
- **Netlify** — `public/_redirects`: `/*  /index.html  200`
- **Cloudflare Pages** — SPA works by default (don't add `404.html`).

Build settings: install `pnpm install --frozen-lockfile`, build `pnpm build`, output `dist`. Add `"packageManager": "pnpm@<your version>"` to `package.json` so hosts use pnpm.

Add `public/robots.txt` and a static `public/sitemap.xml` with the 4 routes.

---

## 11. Owner's quick reference (copy into README.md)

```text
Add a job          → src/data/experience.ts   append { company, role, start: "YYYY-MM", end: null | "YYYY-MM", … }
Company logo       → public/logos/name.svg     then logo: "/logos/name.svg" on the job (square .svg/.webp; omit → letter tile)
Links under a job  → src/data/experience.ts   links: [{ label: "Case study", url: "https://…" }]
Highlights order   → src/data/experience.ts   order by importance; the first N (site.home.highlightLimit) appear on Home
Bold / links       → bio, highlights, project descriptions: **bold** and [label](url) only.
                     Lead with the result; at most ONE bold metric/outcome per bullet; real numbers only.
Add a project      → src/data/projects.ts     append { title, description, tech, links, featured }
Project links      → src/data/projects.ts     links: { github?, youtube?, live? } (all optional; omit a key instead of "")
Add/remove social  → src/data/socials.ts      add/remove { platform: "leetcode", url }
Add a skill        → src/data/skills.ts       add "Name" to a group
Update resume      → upload a new version in Google Drive via Manage versions; the link stays the same (bump site.resume.updated)
Bio / email / name → src/data/site.ts
New icon support   → src/lib/icons.ts         one line in SOCIAL_ICONS or TECH_ICONS
```

---

## 12. Build order (for Claude Code)

> The live, session-sized step list is **`PROGRESS.md`**. Work from it, one step per session. The phase list below is the overview only.

1. [ ] Phase 1 — audit, deps, alias, tokens, `index.html`, ThemeContext
2. [ ] Phase 2 — types, data files, `dates.ts`, `icons.ts`, `validate.ts`
3. [ ] Phase 3 — router, `main.tsx`, RootLayout, Container, Header, ThemeToggle, Footer, SocialLinks
4. [ ] Phase 4 — Section, PageHeader, Reveal, TechChip, StatusBadge, ExternalLink, CopyEmail, RichText
5. [ ] Phase 5 — Home, Experience (ExperienceItem full + preview, CompanyLogo), Projects, Resume, NotFound (+ titles/meta)
6. [ ] Phase 6 — motion + polish
7. [ ] Phase 7 — performance pass
8. [ ] Phase 8 — responsive / a11y QA
9. [ ] Phase 9 — deploy config, robots, sitemap, README
10. [ ] Optional — dawn/dusk theme transition (§7.1), on branch `feat/theme-transition`

After each phase: `pnpm build` and `pnpm lint` must pass. Report what changed and what the owner must supply (avatar, the resume's Google Drive share link, company logos, project images, real data).

### Future (only if asked)
- Multiple roles under one company (promotions) via optional `roles: []`.
- Project filter by tech.
- MDX blog.