# Portfolio

Personal developer portfolio. React 19, TypeScript, Vite, Tailwind CSS v4, pnpm.

Pages: Home, Experience, Projects, Resume and a 404 page. All content lives in `src/data/`, so you never edit components to change text, links or dates.

## Commands

```bash
pnpm install        # install dependencies (pnpm only, never npm or yarn)
pnpm dev            # dev server
pnpm build          # type-check + production build into dist/
pnpm preview        # serve the production build locally
pnpm lint           # ESLint
```

## Editing content

Everything below is in `src/data/` unless stated otherwise. Each data file starts with a comment describing its fields, and the files are typed, so your editor autocompletes fields and flags mistakes. In dev, a content validator prints one grouped `[content]` warning in the console if something looks wrong (unknown platform, bad dates, broken Drive link…).

```text
Add a job          → src/data/experience.ts   append { company, role, start: "YYYY-MM", end: null | "YYYY-MM", … }
Company logo       → public/logos/name.svg     then logo: "/logos/name.svg" on the job (square .svg/.webp; omit → letter tile)
Links under a job  → src/data/experience.ts   links: [{ label: "Case study", url: "https://…" }]
Highlights order   → src/data/experience.ts   order by importance; the first N (site.home.highlightLimit) appear on Home
Bold / links       → bio, highlights, project descriptions: **bold** and [label](url) only.
                     Lead with the result; at most ONE bold metric/outcome per bullet; real numbers only.
Add a project      → src/data/projects.ts     append { title, description, highlights, tech, links, featured } (no images, no year)
Project highlights → src/data/projects.ts     highlights: ["…"], 2–4 bullets, Projects page only; same rules as Bold / links
Project links      → src/data/projects.ts     links: { github?, youtube?, live? } (all optional; omit a key instead of "")
Add/remove social  → src/data/socials.ts      add/remove { platform: "leetcode", url }
Add a skill        → src/data/skills.ts       add "Name" to a group
Update resume      → upload a new version in Google Drive via Manage versions; the link stays the same (bump site.resume.updated)
Bio / email / name → src/data/site.ts
New icon support   → src/lib/icons.ts         one line in SOCIAL_ICONS or TECH_ICONS
Favicon letter     → public/favicon.svg       change the letter inside <text>…</text> to your initial
```

A few details worth knowing:

- **Current job:** `end: null` shows "Present" and a "Working" badge. Jobs are sorted automatically, so order in the file doesn't matter. Durations are computed for you.
- **Home page limits:** `site.home.experienceLimit`, `projectLimit` and `highlightLimit` in `site.ts`. Projects with `featured: true` appear on Home (the first `projectLimit` of them).
- **Skills:** known names (e.g. `"Next.js"`) get an icon; unknown names show as a text-only chip.
- **Socials:** the icon comes from `platform` (it autocompletes). An unknown platform gets a generic link icon.
- **Nav items:** `src/data/navigation.ts`. Each `to` must match a route in `src/router.tsx`.

### Resume (Google Drive)

1. Upload your PDF to Google Drive → Share → "Anyone with the link" → Viewer → Copy link.
2. Paste it into `site.resume.driveUrl` in `src/data/site.ts` and set `site.resume.updated` (`"YYYY-MM"`).
3. To update later, upload a new version of the same file (Manage versions); the link stays the same. Just bump `updated`.

Until a valid link is set, the Resume page shows "Resume coming soon."

## Files to replace before launch

| File | What |
|---|---|
| `src/data/*.ts` | Your real content (name, bio, email, jobs, projects, skills, socials) |
| `src/data/site.ts` → `url` | Your real domain |
| `index.html` | The static `<title>`, description and OG tags (match `site.ts`). If you change or remove the avatar, update or delete the avatar preload line |
| `public/avatar.webp` | Square, ≥ 160×160, ≤ 30 KB |
| `public/og.png` | Social share image, 1200×630 |
| `public/favicon.svg` | Your initial inside `<text>…</text>` |
| `public/logos/` | Square company logos (`.svg`/`.webp`); remove the placeholder `company-a.svg` |
| `public/robots.txt`, `public/sitemap.xml` | Replace `https://yourdomain.com` with your domain |

## Deploy

Build settings for any host:

- Install: `pnpm install --frozen-lockfile`
- Build: `pnpm build`
- Output directory: `dist`

`package.json` pins `packageManager`, so hosts use pnpm automatically. It's a single-page app, so the host must serve `index.html` for every route (deep links like `/projects`):

- **Vercel:** handled by `vercel.json`.
- **Netlify:** handled by `public/_redirects`.
- **Cloudflare Pages:** works by default. Don't add a `404.html`.

Each host ignores the other's file, so both can stay.

## More

- `CLAUDE.md`: project rules (stack, design system, accessibility, animation).
- `IMPLEMENTATION.md`: the full build spec.
