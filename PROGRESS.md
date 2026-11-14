# PROGRESS.md

Session memory for Claude Code. Each session: read this file, do the **first unchecked step only**, verify, tick it, update **Handoff notes**, suggest a commit message, stop. Never commit; the owner commits manually. See `CLAUDE.md`, under "Session workflow".

Each step lists the `IMPLEMENTATION.md` sections to read. Read only those.

---

## Handoff notes

_Overwrite this section at the end of every step._

- **Last completed step:** Step 6 — Router + RootLayout + page stubs
- **What was done:**
  - Added `src/router.tsx` (§4.1): a data router with Home and NotFound loaded eagerly, Experience, Projects and Resume as lazy chunks, `/work` redirecting to `/experience`, and `*` showing the 404 inside the layout.
  - Replaced `src/main.tsx` with its final version (§4.2): `ThemeProvider` wraps `RouterProvider`, lazy chunks are warmed when the browser is idle, and the dev-only validator call is kept.
  - Added `RootLayout` (§4.3: skip link, `<main id="main">`, a fade-in keyed on the path, `ScrollRestoration`) and `Container` (§4.4).
  - Added five page stubs (`Home`, `Experience`, `Projects`, `Resume`, `NotFound`). Each renders a `<title>` and a page-title-scale `<h1>` inside `<Container>`.
  - Deleted the Step 3 test button.
- **Files created/changed:** new `src/router.tsx`, `src/components/layout/{RootLayout,Container}.tsx` and `src/pages/{Home,Experience,Projects,Resume,NotFound}.tsx`. Replaced `src/main.tsx`. Deleted `src/components/ui/ThemeTest.tsx`, `src/pages/.gitkeep` and `src/components/layout/.gitkeep`. No temporary code is left; a `grep` for `TEMPORARY`/`ThemeTest`/test ids comes back empty.
- **Verified:**
  - `pnpm build` and `pnpm lint` are clean. The build output has the lazy chunks `Experience-*.js`, `Projects-*.js` and `Resume-*.js`, about 0.3 KB each.
  - **Headless Chrome, 10 checks, all pass in production (`vite preview`) and dev (StrictMode):**
    - **Routes:** `/`, `/experience`, `/projects` and `/resume` each show the right `<h1>` and tab title, inside `<main id="main">` with the skip link present.
    - **Redirect:** `/work` ends up at `/experience`.
    - **404:** `/nope` and `/experience/deep/nope` show the "404" h1 and the "Page not found — …" title inside the layout.
    - **Warm-up:** while sitting on Home, the browser fetched all 3 lazy chunks once idle (prod only).
    - **Scroll:** clicking a real `<Link>` from a page scrolled to 800px lands on the new page at the top. The back button returns to the old page at 800px.
  - **Console:** production logged nothing. Dev showed only the expected `[content]` Drive-link warning.
  - **Not checked:** the scroll test used a temporary `<Link>` (since removed) because there's no nav yet. Step 7 should click the real header links once.
- **Decisions / deviations from spec:**
  - **`HydrateFallback: () => null` on the root route in `router.tsx`.** It's not in §4.1. Without it, React Router logs `No HydrateFallback element provided to render during initial hydration` on the first load of every lazy route (`/experience`, `/projects`, `/resume`, `/work`), in production too. React Router already renders nothing while the chunk loads (I checked its source), so declaring it changes no behaviour; it only removes the warning. IMPLEMENTATION.md §4.1 is not updated; tell me if you want it there.
  - **There's no Header or Footer in `RootLayout` yet.** Steps 7 and 8 build them, and `RootLayout` has `{/* <Header /> — Step 7 */}` and `{/* <Footer /> — Step 8 */}` where they go. Until then there's no nav and no theme toggle on screen; the theme still follows the OS or the stored choice.
  - The NotFound title is `Page not found — ${site.name}`; §6.6 doesn't specify one. The stubs don't render a `<meta name="description">` yet, because Step 6 asks for only a `<title>` and an `<h1>`. §6 requires one on every page, so add them when the pages are built (Steps 10 to 13).
  - **Two `<title>` tags end up in `<head>`:** the static one from `index.html` and React's. React puts its own first, so `document.title` is always the page's (checked on every route).
  - `errorElement: <RootLayout error />`, as in §4.1, also shows the "404" page if a page throws while rendering, which is misleading for a crash. That's how the spec has it; flagging it only.
  - **`src/lib/resume.ts` was created in Step 4, before Step 13.** The validator uses `getDriveId`. Step 13 only needs to build the page that uses it.
  - **The resume iframe uses a wrapper, as agreed with the owner (§6.5).** `mt-8` and `bg-subtle` sit on a wrapper `div`, because an iframe's own background would hide the "Loading preview…" text behind it.
  - **Owner rule (CLAUDE.md "Plugins, skills & MCP servers"):** never install, enable or invoke plugins, skills or MCP servers unless asked in that session. IMPLEMENTATION.md and the `src/index.css` tokens are the only design authority. The frontend-design plugin is enabled in the owner's user-level settings and must not be used. None has been used so far.
  - From Step 5: the validator logs one `console.warn` call with a bulleted list, and assigns the data to its declared types before checking.
  - From Step 4: the data-file comment headers go slightly beyond the spec (required/optional lists, allowed `mode`/`type` values, Drive sharing instructions).
  - From Step 3: `eslint.config.js` allows the `useTheme` export via `allowExportNames`.
  - From Step 2: `@source not "../*.md";` in `index.css` stops Tailwind generating classes from the docs. The avatar preload in `index.html` is commented out until `public/avatar.webp` exists.
  - From Step 1: no `baseUrl` in `tsconfig.app.json` (TS 6 rejects it with TS5101; `paths` alone works). `"strict": true` is set explicitly. `public/favicon.svg` is still the Vite logo until Step 14.
- **Owner needs to provide:** real content in `src/data/*`; the resume's Google Drive share link in `site.resume.driveUrl` (Share → "Anyone with the link" → Viewer); `public/avatar.webp`, `public/og.png` (1200×630; `index.html` already points to it), project images. These can come later; placeholders are fine. The `<title>`, description and OG text in `index.html` are static placeholders ("Your Name"), so update them by hand to match `site.ts`.
- **Known issues / TODO:**
  - **The placeholder data points at files that don't exist yet:** `site.avatar` (`/avatar.webp`) and project image `/projects/project-one.webp`. Once Steps 11 and 12 render them they'll 404, showing broken images and console errors. Either add the files, or set `avatar: null` and drop `image` until real assets exist.
  - **Expected dev warning:** until a real Drive link is in `site.resume.driveUrl`, every dev page load shows one `[content]` warning about it, and the Step 13 Resume page will show "Resume coming soon." That's intended, but it means "no console warnings in dev" (Definition of done) only holds once the link is pasted. Treat that single warning as expected when checking later steps.
  - **Bundle budget is getting close:** the initial JS is now **101.4 KB gzip** (319 KB raw) against Step 15's ~110 KB target, and most of the increase is React Router. `dates.ts` and `icons.ts` are still tree-shaken out because nothing rendered imports them yet; they'll add to this in Steps 8 to 12. Keep an eye on it; Step 15 does the real measurement.
  - **Each dev page load prints the `[content]` warning once,** because every full reload re-runs the validator. Client-side navigation doesn't re-run it.
  - Git on Windows warns about LF→CRLF. If you want LF everywhere (the Prettier default), add `.gitattributes` with `* text=auto eol=lf`. I didn't add it; ask if you want it.
  - Delete the `.gitkeep` files as real files land in each folder.

---

## Steps

### Foundation

- [x] **Step 1: Project setup**
  Read: §2.1, §2.2, §2.3
  Audit `package.json` (React 19, TS, Tailwind v4, pnpm). Install deps. Set up the `@/` alias in Vite + `tsconfig.app.json`. Delete Vite boilerplate. Create the empty folder structure from `CLAUDE.md` → Architecture.
  **Done when:** `pnpm build` passes; `@/` imports resolve; no boilerplate left; app renders a plain "Hello" placeholder.

- [x] **Step 2: Design tokens + no-flash theme**
  Read: §2.4, §2.5
  Write `src/index.css` (tokens, `@theme`, keyframes, base layer, `.no-transitions`, reduced motion). Write `index.html` (theme script, meta, OG, favicon link). Import the fonts in `main.tsx`.
  **Done when:** placeholder uses `bg-bg text-fg`; toggling `.dark` on `<html>` in devtools switches colors; a hard reload with the OS in dark mode shows no white flash; fonts load from the bundle.

- [x] **Step 3: Theme context + helpers**
  Read: §2.6, §2.7
  `src/lib/theme.ts`, `src/context/ThemeContext.tsx`, `src/lib/cn.ts`. Wrap the app in `ThemeProvider`. Add a temporary test button that toggles the theme.
  **Done when:** the button toggles and the choice persists after reload; with no stored choice, the site follows OS theme changes live; no transition flicker while switching.

### Data layer

- [x] **Step 4: Types + data files**
  Read: §3.1 to §3.7
  `src/types/content.ts` and all `src/data/*.ts` with schema comment headers and placeholder content.
  **Done when:** `pnpm build` passes; `mode: "remote"` (wrong case) causes a TS error (test it, then revert); typing `platform: "` in socials autocompletes.

- [x] **Step 5: Lib helpers: dates, icons, validator**
  Read: §3.8, §3.9, §3.10
  `dates.ts`, `icons.ts` (verify every react-icons export exists; swap or remove any that are missing), `validate.ts`, and the dev-only call in `main.tsx`.
  **Done when:** build passes; a quick temporary render shows sorted experience with "Present"/durations; an unknown platform triggers one grouped dev warning; nothing is logged in a production build.

### Layout

- [x] **Step 6: Router + RootLayout + page stubs**
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
  Resume comes from Google Drive (`site.resume.driveUrl` → `src/lib/resume.ts`).
  **Done when:** with a real Drive link, "Download" and "Open in Google Drive" both open in a new tab and work; the Drive preview iframe shows at every width (capped at `85dvh`, no overflow at 320px) with "Loading preview…" visible behind it while it loads; with the placeholder or a malformed link, only "Resume coming soon." shows (no buttons, no iframe); 404 has a working "Go home" link.

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