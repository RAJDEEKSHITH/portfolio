# PROGRESS.md

Session memory for Claude Code. Each session: read this file, do the **first unchecked step only**, verify, tick it, update **Handoff notes**, suggest a commit message, stop. Never commit; the owner commits manually. See `CLAUDE.md`, under "Session workflow".

Each step lists the `IMPLEMENTATION.md` sections to read. Read only those.

---

## Handoff notes

_Overwrite this section at the end of every step._

- **Last completed step:** Step 8 — Footer + SocialLinks
- **What was done:**
  - Added `src/components/ui/SocialLinks.tsx` (§4.8): a wrapping `ul` of round icon links, built from `socials.ts` via `getSocial()`. The `aria-label` and `title` come from the data `label` or the registry label. `http` links get `target="_blank" rel="noopener noreferrer"`; `mailto:` gets neither. Icons are `aria-hidden`.
  - Added `src/components/layout/Footer.tsx` (§4.7): `border-t`, with `© {year} {site.name}` and `<SocialLinks size="sm" />`. It's one row from `sm` up, and stacked and centred below that (socials above the ©). Nothing else.
  - `RootLayout` renders `<Footer />`, so the layout is now complete: skip link, Header, main, Footer.
  - `src/lib/validate.ts` now accepts its own hot updates in dev (see Decisions).
- **Files created/changed:** new `src/components/ui/SocialLinks.tsx` and `src/components/layout/Footer.tsx`; changed `src/components/layout/RootLayout.tsx` and `src/lib/validate.ts`.
- **Verified:**
  - `pnpm build` and `pnpm lint` are clean.
  - **Headless Chrome, 14 checks, all pass in production and dev (StrictMode):**
    - **Every width:** at 320, 375, 414 and 639px the footer is stacked and centred, socials above the ©. At 640, 768, 1024, 1440 and 1920px it's one row, © left and socials right. At every width the socials stay on one row, the footer sits at the bottom of the viewport on a short page, there's a 1px top border, and no horizontal overflow.
    - **Data:** all 7 socials appear in data order, with the right labels and hrefs.
    - **Icons:** each link's SVG path is compared with the react-icons export rendered separately in Node, and every one is the right icon.
    - **Link attributes:** `target`/`rel` are correct for http and absent for `mailto:`.
    - **Size and focus:** every icon link is 36×36, and Tab focus shows the 2px ring.
  - **Live editing while `pnpm dev` runs (5 checks, all pass):**
    - Appending `{ platform: "foo", url }` to `socials.ts` showed an 8th link with the **generic FaLink icon** and the label "Link".
    - Deleting the youtube line removed it.
    - Restoring the file brought back the original 7.
    - All of that happened as a **hot update, with no page reload**, and the validator re-ran each time; the unknown-platform warning appeared and then cleared. The file was restored, and `git status` confirms it matches the committed version.
  - **Screenshots:** 320 and 1440px in light and dark all look right. On desktop the icon row lines up with the theme toggle above.
  - **Console:** production logged nothing. Dev showed only the expected `[content]` warning. No validator or HMR code is in `dist`.
- **Decisions / deviations from spec:**
  - **The `sm` icon links are `size-9` (36px), not `size-8`.** §4.8's `sm` uses `size-8` (32px), but CLAUDE.md requires icon links to be at least `size-9` and §9 requires tap targets of at least 36px. Now `sm` and `md` differ only in icon size (`size-4` vs `size-4.5`, the canonical form of `size-[18px]`).
  - **SocialLinks reads `socials` through its declared type** (`const links: readonly Social[] = socials`). With §4.8's code verbatim, TypeScript fails with `TS2339: Property 'label' does not exist` (checked), because no placeholder entry sets `label` and `satisfies` keeps the literal shapes.
  - `{...(!isMail && {...})}` became an `external` object (`{}` for mailto, otherwise `target`/`rel`) spread onto the `<a>`. The behaviour is the same and it reads more clearly.
  - **`validate.ts` accepts its own hot updates** (`import.meta.hot.accept((next) => next?.validateContent())`). It's not in the spec. Without it, editing **any** `src/data/*` file did a full page reload in dev: `validate.ts` imports every data file but is loaded from `main.tsx`, which can't hot-reload. Now data edits are hot updates and the warning refreshes live. It's dev-only, and Vite removes `import.meta.hot` from builds.
  - From Step 7:
    - **The nav doesn't fit at 320px, so the spec's own fallback is in use.** §4.5 says 4 labels plus the toggle fit at 320px, but measured they need about 307px of the 280px available (links 207px, gaps 3×16px, header gap 16px, toggle 36px). At 375px they fit with 44px to spare. As §4.5 prescribes for overflow, the `ul` is `overflow-x-auto` with a hidden scrollbar (`[scrollbar-width:none]` plus `[&::-webkit-scrollbar]:hidden`), never a hamburger. **At 320px "Resume" shows cut off as "Resu" until you swipe or Tab to it.** Three small additions make that fallback work:
      - `p-1 -mx-1 scroll-px-1` on the `ul`, so a scroll container doesn't clip the 4px focus ring;
      - `shrink-0` on the toggle, which was being squeezed to 33px;
      - an `onFocus` on each link calling `scrollIntoView({ block: "nearest", inline: "nearest" })`. Chrome won't scroll a partly visible focused element into view on its own; this was measured, and without it "Resume" stayed clipped.
      - **Owner's call, still open:** the alternative is tighter spacing at the base size only (`gap-2` between links and `gap-3` before the toggle). It fits at 320px, but with about 1px to spare, so any label or font change would break it.
    - **The hairline border once scrolled (optional in §4.5) is not built.** Ask if you want it.
    - **The skip link has the standard focus ring** (`focus-visible:outline-2 outline-offset-2 outline-fg`). §4.3's classes left it with the browser default ring.
    - **The crossfade works despite `.no-transitions`.** `applyTheme()` forces its style flush before React swaps the icon classes, and `.no-transitions` comes off in the next animation frame, before that frame's style recalculation. Don't add a forced reflow (for example reading `offsetHeight`) after `setTheme`, or the crossfade will stop.
    - In `Header`: `min-w-0` on `<nav>` and `whitespace-nowrap` on links. The toggle icons use `size-4.5` (18px).
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
  - **⚠ Bundle budget exceeded: the initial JS is now 114.2 KB gzip (350 KB raw), against Step 15's ~110 KB target.** It was 103.1 after Step 7, so Step 8 added 11.1 KB.
    - **Cause:** `getSocial()` looks icons up by string at runtime, so the bundler must keep **all 19** `SOCIAL_ICONS`, not just the 7 in use. Several brand logos are large: CodeChef 7.4 KB and Kaggle 3.6 KB of SVG path data, GeeksforGeeks 1.6 KB.
    - **Tree-shaking does work:** none of the `TECH_ICONS` are in the bundle yet (checked with SVG-path probes).
    - **It will get worse.** The Home page (eager, Step 12) uses `TechChip`, which makes all of `TECH_ICONS` reachable: about 35 entries, including PostgreSQL 5.3 KB and React 3.0 KB of paths.
    - **Options for Step 15 (owner's call):**
      - (a) Raise the budget. The CSS-only motion and the lazy pages already keep the site fast.
      - (b) Trim the registries to the icons actually used. That's simple, but adding a platform then means one line in `icons.ts`, which is already the documented workflow.
      - (c) Load the icon registries with a dynamic `import()`. Nothing shifts if the icon boxes are fixed-size, but it adds complexity.
      - (d) Load the `/projects`, `/experience` and `/resume` pages lazily, and the footer socials too. That's not recommended, because the footer is on every page.
  - At 320px, after you navigate to `/resume`, the active "Resume" link stays partly scrolled out of view, since nothing scrolls the nav on route change, only on focus. That's cosmetic, and Step 16 (responsive QA) can decide whether it matters.
  - **The `[content]` warning prints once per full page load, and again after each hot data edit** (the validator re-runs on new content). Client-side navigation doesn't re-run it.
  - At 1440px the footer's top border stops about 15px short of the right edge. That's the space `scrollbar-gutter: stable` (§2.4) reserves for the scrollbar, and it's where the scrollbar is drawn in a normal desktop browser. It's expected.
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

- [x] **Step 8: Footer + SocialLinks**
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