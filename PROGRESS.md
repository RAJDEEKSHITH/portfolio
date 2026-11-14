# PROGRESS.md

Session memory for Claude Code. Each session: read this file, do the **first unchecked step only**, verify, tick it, update **Handoff notes**, commit, stop. See `CLAUDE.md`, under "Session workflow".

Each step lists the `IMPLEMENTATION.md` sections to read. Read only those.

---

## Handoff notes

_Overwrite this section at the end of every step._

- **Last completed step:** Step 1 — Project setup
- **What was done:** Audited the scaffold against §2.1. Installed `react-router-dom@7.18.5`, `react-icons@5.7.0`, `@fontsource-variable/hanken-grotesk@5.3.0`, `@fontsource-variable/jetbrains-mono@5.3.0` (`@types/node@24` was already present). Set up the `@/` → `src/` alias in Vite and tsconfig and checked it in both (a temporary `@/lib/…` import built OK; a bad `@/` path failed `tsc`). Removed the template boilerplate. Created the folder structure from CLAUDE.md → Architecture (`.gitkeep` in each empty folder so git tracks it). `main.tsx` renders a plain `<p>Hello</p>`.
- **Files created/changed:** `vite.config.ts` (alias, double quotes), `tsconfig.app.json` (`paths`, explicit `"strict": true`), `src/main.tsx` (Hello placeholder), `README.md` (short stub; the full guide comes in Step 17), `package.json` + `pnpm-lock.yaml`. Deleted: `src/App.tsx`, `src/assets/{hero.png,react.svg,vite.svg}`, `public/icons.svg`. Added: `src/{data,types,lib,hooks,context,pages}/.gitkeep`, `src/components/{layout,ui,experience,projects}/.gitkeep`.
- **Decisions / deviations from spec:**
  - **No `baseUrl` in `tsconfig.app.json`.** TypeScript 6.0.3 rejects it with error TS5101 (deprecated). `paths` alone works because it resolves relative to the tsconfig. Use this in place of the §2.3 snippet.
  - Added `"strict": true` explicitly. TS 6 turns it on by default, but the template didn't list it.
  - Kept `public/favicon.svg` (the Vite logo) so `/favicon.svg` doesn't 404. Step 14 replaces it with the monogram.
  - `src/index.css` is still just `@import "tailwindcss";`. Step 2 writes the tokens.
  - The scaffold uses newer versions than the spec assumed: Vite 8 (Rolldown), `@vitejs/plugin-react` 6, ESLint 10, TS 6. They all work, nothing to change.
- **Owner needs to provide:** real content in `src/data/*`, `public/avatar.webp`, `public/resume.pdf`, project images (can come later; placeholders are fine)
- **Known issues / TODO:**
  - Git on Windows warns about LF→CRLF. If you want LF everywhere (the Prettier default), add `.gitattributes` with `* text=auto eol=lf`. I didn't add it; ask if you want it.
  - Delete the `.gitkeep` files as real files land in each folder.

---

## Steps

### Foundation

- [x] **Step 1: Project setup**
  Read: §2.1, §2.2, §2.3
  Audit `package.json` (React 19, TS, Tailwind v4, pnpm). Install deps. Set up the `@/` alias in Vite + `tsconfig.app.json`. Delete Vite boilerplate. Create the empty folder structure from `CLAUDE.md` → Architecture.
  **Done when:** `pnpm build` passes; `@/` imports resolve; no boilerplate left; app renders a plain "Hello" placeholder.

- [ ] **Step 2: Design tokens + no-flash theme**
  Read: §2.4, §2.5
  Write `src/index.css` (tokens, `@theme`, keyframes, base layer, `.no-transitions`, reduced motion). Write `index.html` (theme script, meta, OG, favicon link). Import the fonts in `main.tsx`.
  **Done when:** placeholder uses `bg-bg text-fg`; toggling `.dark` on `<html>` in devtools switches colors; a hard reload with the OS in dark mode shows no white flash; fonts load from the bundle.

- [ ] **Step 3: Theme context + helpers**
  Read: §2.6, §2.7
  `src/lib/theme.ts`, `src/context/ThemeContext.tsx`, `src/lib/cn.ts`. Wrap the app in `ThemeProvider`. Add a temporary test button that toggles the theme.
  **Done when:** the button toggles and the choice persists after reload; with no stored choice, the site follows OS theme changes live; no transition flicker while switching.

### Data layer

- [ ] **Step 4: Types + data files**
  Read: §3.1 to §3.7
  `src/types/content.ts` and all `src/data/*.ts` with schema comment headers and placeholder content.
  **Done when:** `pnpm build` passes; `mode: "remote"` (wrong case) causes a TS error (test it, then revert); typing `platform: "` in socials autocompletes.

- [ ] **Step 5: Lib helpers: dates, icons, validator**
  Read: §3.8, §3.9, §3.10
  `dates.ts`, `icons.ts` (verify every react-icons export exists; swap or remove any that are missing), `validate.ts`, and the dev-only call in `main.tsx`.
  **Done when:** build passes; a quick temporary render shows sorted experience with "Present"/durations; an unknown platform triggers one grouped dev warning; nothing is logged in a production build.

### Layout

- [ ] **Step 6: Router + RootLayout + page stubs**
  Read: §4.1 to §4.4
  `router.tsx`, final `main.tsx`, `RootLayout`, `Container`. Stub pages (Home, Experience, Projects, Resume, NotFound) that each render only a `<title>` and an `<h1>`. Remove the Step 3 test button.
  **Done when:** all routes work; `/work` redirects to `/experience`; unknown URLs show the 404 inside the layout; the tab title changes per route; scroll resets on navigation; lazy chunks appear in the build output.

- [ ] **Step 7: Header + ThemeToggle**
  Read: §4.5, §4.6
  **Done when:** sticky header with blur; active link state correct (Home isn't active on other pages); toggle animates sun/moon; one line at 320px; keyboard focus visible.

- [ ] **Step 8: Footer + SocialLinks**
  Read: §4.7, §4.8
  **Done when:** footer is one row on `sm+` and stacked/centered on mobile; all socials from data render with correct icons; adding/removing a line in `socials.ts` updates instantly; an unknown platform shows the link icon; `mailto:` doesn't open a new tab.

### Components & pages

- [ ] **Step 9: Shared UI primitives**
  Read: §5.1 to §5.7
  `Section`, `PageHeader`, `Reveal`, `TechChip`, `StatusBadge`, `ExternalLink`, `CopyEmail` + `useCopyToClipboard`.
  **Done when:** each component renders on a stub page without errors; copy-email shows the copied state and announces it; StatusBadge ping is hidden with reduced motion.

- [ ] **Step 10: Experience item + Experience page**
  Read: §6.2, §6.3
  **Done when:** full list sorted correctly with "Working" on current jobs; duration shows on `sm+`; removing optional fields leaves no gaps or stray "·"; long company names wrap at 320px.

- [ ] **Step 11: Project card + Projects page**
  Read: §6.4
  **Done when:** 1 column on mobile, 2 on `sm+`; cards in a row line up; projects with no image or links still look intentional; no nested anchors; images lazy-load with no layout shift.

- [ ] **Step 12: Home page**
  Read: §6.1
  Hero, bio, socials, compact experience, featured projects, skills, all wrapped in `Reveal` with stagger.
  **Done when:** limits from `site.home` are respected; "View all" is hidden when nothing more exists; the featured section hides when no project is featured; null avatar still looks good; the staggered entrance looks subtle and smooth.

- [ ] **Step 13: Resume page + 404 page**
  Read: §6.5, §6.6
  **Done when:** Download and Open work; iframe shows only on `md+`; mobile shows buttons + note; 404 has a working "Go home" link.

### Quality

- [ ] **Step 14: Motion + polish pass**
  Read: §7
  Audit every animation against the allowed list; remove anything else. Add the SVG favicon. Check focus rings and `::selection`.
  **Done when:** no `transition-all` anywhere (`grep`); reduced motion turns everything off; theme switch has no fade lag.

- [ ] **Step 15: Performance pass**
  Read: §8
  **Done when:** `pnpm build` output shows initial JS ≤ ~110 KB gzip; no layout shift on load, theme switch or navigation; images have dimensions; record the bundle sizes in Handoff notes.

- [ ] **Step 16: Responsive + accessibility QA**
  Read: §9
  Go through the whole checklist at every listed width in both themes; fix every issue found.
  **Done when:** every §9 box is satisfied; list anything still imperfect in Handoff notes.

- [ ] **Step 17: Deploy prep + README**
  Read: §10, §11
  `vercel.json` and/or `public/_redirects`, `robots.txt`, `sitemap.xml`, `packageManager` field, README with the owner quick reference.
  **Done when:** `pnpm build && pnpm preview` works; deep-linking `/projects` on preview works; README explains how to edit content.

### Optional

- [ ] **Step 18: Design audit (only if the owner installed Hallmark)**
  Run `hallmark audit` on Home, Experience, Projects and Resume. **Report only; don't edit.** Write the punch list into Handoff notes so the owner can pick fixes, which are then done with `fix: …`.