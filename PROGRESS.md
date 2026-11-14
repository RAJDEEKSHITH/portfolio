# PROGRESS.md

Session memory for Claude Code. Each session: read this file, do the **first unchecked step only**, verify, tick it, update **Handoff notes**, suggest a commit message, stop. Never commit; the owner commits manually. See `CLAUDE.md`, under "Session workflow".

Each step lists the `IMPLEMENTATION.md` sections to read. Read only those.

---

## Handoff notes

_Overwrite this section at the end of every step._

- **Last completed step:** Step 7 — Header + ThemeToggle
- **What was done:**
  - Added `src/components/layout/Header.tsx` (§4.5): a sticky header with `bg-bg/80` and `backdrop-blur-md`, `h-14` inside `Container`. It has `<nav aria-label="Primary">` with `NavLink`s from `navigation.ts` (`end` on `/`; active `font-medium text-fg`, others `text-muted hover:text-fg`) and the toggle on the right.
  - Added `src/components/ui/ThemeToggle.tsx` (§4.6): a 36×36 round button with a dynamic `aria-label`. `LuSun` and `LuMoon` are stacked in one grid cell and crossfade and rotate over 300ms. It shows the **current** theme: the sun in light and the moon in dark.
  - `RootLayout` renders `<Header />`. The footer slot (`{/* <Footer /> — Step 8 */}`) stays for Step 8.
- **Files created/changed:** new `src/components/layout/Header.tsx` and `src/components/ui/ThemeToggle.tsx`; changed `src/components/layout/RootLayout.tsx` (Header, plus the skip link's focus ring).
- **Verified:**
  - `pnpm build` and `pnpm lint` are clean, and there's no `transition-all` anywhere in `src`.
  - **Headless Chrome, 20 checks, all pass in production and dev (StrictMode):**
    - **Every width:** at 320, 375, 414, 768, 1024, 1440 and 1920px the header is one line and 56px tall, with no horizontal page overflow. The nav never runs under the toggle, and the toggle is always 36×36. From 375px up, the nav fits without scrolling.
    - **320px keyboard:** Tabbing through the nav scrolls each link fully into view, with its 4px focus ring inside the scroll box. The page itself doesn't scroll (stays at 600px), and the scrollbar is hidden.
    - **Active state, by clicking the real nav links:** only the current link has `aria-current="page"` and is `fg`/500 weight; the others are muted/400. Home is not active on other pages. Each click also lands at the top of the page, which confirms Step 6's scroll reset with real links.
    - **Sticky:** after scrolling 1500px the header is still at `top: 0`, with `blur(12px)` and an 80%-alpha background.
    - **Toggle:** the `aria-label` and icon are correct in both themes. The crossfade really animates (10 in-between opacity frames over about 450ms). Theme colours (a nav link and the page background) already have their final value on the first frame, so there's no fade.
    - **Keyboard:** Tab goes skip link → Home → Experience → Projects → Resume → toggle, and every stop shows a 2px `solid` focus ring.
  - **Screenshots:** I captured and looked at 320 and 1440px in light and dark, plus 320px dark with "Resume" keyboard-focused (ring fully visible, nav scrolled). Production console: nothing. Dev: only the expected `[content]` warning.
- **Decisions / deviations from spec:**
  - **The nav doesn't fit at 320px, so the spec's own fallback is in use.** §4.5 says 4 labels plus the toggle fit at 320px, but measured they need about 307px of the 280px available (links 207px, gaps 3×16px, header gap 16px, toggle 36px). At 375px they fit with 44px to spare. As §4.5 prescribes for overflow, the `ul` is `overflow-x-auto` with a hidden scrollbar (`[scrollbar-width:none]` plus `[&::-webkit-scrollbar]:hidden`), never a hamburger. **At 320px "Resume" shows cut off as "Resu" until you swipe or Tab to it.** Three small additions make that fallback work:
    - `p-1 -mx-1 scroll-px-1` on the `ul`, so a scroll container doesn't clip the 4px focus ring;
    - `shrink-0` on the toggle, which was being squeezed to 33px;
    - an `onFocus` on each link calling `scrollIntoView({ block: "nearest", inline: "nearest" })`. Chrome won't scroll a partly visible focused element into view on its own; this was measured, and without it "Resume" stayed clipped.
    - **Your call:** the alternative is tighter spacing at the base size only (`gap-2` between links and `gap-3` before the toggle). It fits at 320px, but with about 1px to spare, so any label or font change would break it. Tell me if you prefer that.
  - **The hairline border once scrolled (optional in §4.5) is not built.** It's optional, not in "Done when", and would add an IntersectionObserver plus state. Ask if you want it.
  - **The skip link now has the standard focus ring** (`focus-visible:outline-2 outline-offset-2 outline-fg`). §4.3's classes left it with the browser default ring, and CLAUDE.md requires the ring on every interactive element.
  - **The crossfade works despite `.no-transitions`.** `applyTheme()` forces its style flush before React swaps the icon classes, and `.no-transitions` comes off in the next animation frame, before that frame's style recalculation. So the icons animate while the theme colours switch instantly. Don't add a forced reflow (for example reading `offsetHeight`) after `setTheme`, or the crossfade will stop.
  - Small additions in `Header`: `min-w-0` on `<nav>` (CLAUDE.md: flex children holding text) and `whitespace-nowrap` on links. The toggle icons use `size-4.5` (18px), matching the md social icon size in §4.8.
  - From Step 6: `HydrateFallback: () => null` on the root route silences React Router's "No HydrateFallback" warning without changing behaviour (not added to §4.1). Two `<title>` tags end up in `<head>`; React's comes first, so the tab title is always right. The stubs have no `<meta name="description">` yet; add them in Steps 10 to 13. `errorElement` shows "404" even when a page crashes, as the spec has it.
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
  - **Bundle budget is getting close:** the initial JS is now **103.1 KB gzip** (324 KB raw) against Step 15's ~110 KB target. It was 101.4 after Step 6; the header and toggle added 1.7 KB. `icons.ts` (the socials in Step 8, the tech chips in Steps 9 to 12) and `dates.ts` will add more. Keep an eye on it; Step 15 does the real measurement.
  - At 320px, after you navigate to `/resume`, the active "Resume" link stays partly scrolled out of view, since nothing scrolls the nav on route change, only on focus. That's cosmetic, and Step 16 (responsive QA) can decide whether it matters.
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

- [x] **Step 7: Header + ThemeToggle**
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