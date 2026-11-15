# PROGRESS.md

Session memory for Claude Code. Each session: read this file, do the **first unchecked step only**, verify, tick it, update **Handoff notes**, suggest a commit message, stop. Never commit; the owner commits manually. See `CLAUDE.md`, under "Session workflow".

Each step lists the `IMPLEMENTATION.md` sections to read. Read only those.

---

## Handoff notes

_Overwrite this section at the end of every step._

- **Last completed step:** Step 16 — Responsive + accessibility QA. Step 17 (Deploy prep + README) is next.
- **Step 15 is not committed yet** (it changed only this file), so the next commit holds Steps 15 and 16 unless you split them. Step 15's results, kept here: initial JS 135.24 KB gzip at that point; against `pnpm preview` with mobile throttling (150ms RTT, 1.6 Mbps, CPU 4×): **CLS 0** on every cold load, FCP 1.19–1.56s, **LCP 1.56–1.96s** (8 of 10 loads under 1.8s); no layout shift on theme toggle; navigation shifts are input-flagged (CLS 0); lazy chunks warm on idle; images sized. **Not a Lighthouse score:** run `pnpm build && pnpm preview` → Chrome DevTools → Lighthouse → Mobile to get the real one.
- **Owner decisions taken this step** (asked at the start; also in Owner decisions #6 below):
  - **Footer socials at 320px:** `gap-0` below `sm` (footer only).
  - **Ideas: Projects grid card heights:** accept equal heights (rows stay stretched). Removed from Ideas.
  - **Focus-ring fade:** make rings instant (`focus-visible:transition-none` on the muted controls).
- **Files changed:**
  - **`src/components/layout/Header.tsx`:** `useLocation` + a `ref` on the nav `ul`; `useEffect(…, [pathname])` scrolls the `aria-current="page"` link into view (`block`/`inline: "nearest"`, instant). NavLinks get `focus-visible:transition-none`.
  - **`src/components/layout/Footer.tsx`:** `<footer>` has no border; the hairline (`border-t border-border`) and the row classes moved to a `div` inside `<Container>`.
  - **`src/components/ui/SocialLinks.tsx`:** the gap is `gap-0 sm:gap-1` for `size="sm"` (footer) and `gap-1` for `md` (Home, unchanged); links get `focus-visible:transition-none`.
  - **`ThemeToggle.tsx`, `ProjectLinks.tsx`, `Home.tsx` (`ACTION`):** `focus-visible:transition-none`.
  - **Docs:**
    - **`IMPLEMENTATION.md`:** §4.5 (the active-link effect as built, the ring note), §4.6, §4.7 (snippet + hairline measurements), §4.8 (snippet, the `sm` gap rule and why), §6.1 (`ACTION`), §6.4 (`ProjectLinks` link classes), §7 (focus rings: instant, the trade-off, which controls).
    - **`CLAUDE.md`:** the Accessibility focus line adds the `focus-visible:transition-none` rule.
- **Decision:** the nav effect uses the **instant** scroll (the spec allowed instant, or smooth when motion is allowed). Instant can't fight `ScrollRestoration` and needs no reduced-motion branch.
- **§9 sweep, headless Chrome against dev.** Every width (320, 375, 414, 768, 1024, 1440, 1920), light and dark, all 5 routes. A probe on every page checks:
  - horizontal overflow and any element outside the viewport;
  - overlapping text boxes;
  - header: one line, 56px tall, exactly one correct active link (none on the 404) at `font-weight: 500`, fully visible in the nav strip, toggle inside the header;
  - footer: hairline = Container content box, `<footer>` has no border of its own, socials on one row, and at `sm+` the hairline ends line up with © and the last icon;
  - icon-only controls ≥ 36×36.

  Page-specific checks:
  - **Experience:** tiles 40px below `sm`, 48px from `sm`; title, labels, chips, bullets and links share the content column's left edge; dates stack under the title below `sm` and are right-aligned from `sm`.
  - **Projects:** 1 grid column below 640px, 2 from 640px; cards in a row have equal heights; icons flush right.
  - **Home:** first N highlights (2 · 1) in the same 15px muted bullets and tiles as the Experience page (3 · 1); no chips or labels; "View all experience →" present; project icon right edge = Experience date right edge (300 at 320px, 1073 at 1440px).
  - **Resume (placeholder):** only "Resume coming soon."

  **Result: 0 issues** in both passes (pass A: default data; pass B: below).
  - **Pass B (temporary `site.ts`**: an internal `[projects](/projects)` and an external `[blog](…)` link in the bio, plus a test Drive link; restored byte-for-byte with `cmp`):
    - Resume at all 7 widths × 2 themes: the iframe is 278×393 at 320px up to 718×765 at 1440/1920 (≤ `85dvh`); buttons are 40px, two rows only at 320px; no overflow;
    - rich-text links: the internal one navigates client-side (same document, no reload), external ones have `_blank` + `noopener noreferrer`, and all three show the 2px `fg` ring on Tab.
  - **Nav at 320px** (real mouse clicks, no test scrolling): Resume → Projects → Experience → Home → Resume; the active link is fully visible every time (`scrollLeft` 27 or 0), `scrollY` 0. A direct load of `/resume` at 320px shows "Resume" fully (screenshot). **Back-navigation:** Home scrolled to 600 → Resume → back → `scrollY` 600 restored, so the effect never scrolls the page.
  - **Footer at 320px on a desktop browser** (classic 15px scrollbar, `clientWidth` 305): socials 252px wide, **one row**. Before: 2 rows.
  - **Focus:** at 1440px, 30 Tab stops on Home; every ring's colour is `fg` on the frame it's focused (no fade); hover still uses `transition-colors` when not focused. **Skip link:** first Tab shows it (119×36 at the top left); Enter → `#main`; next Tab → the first link in main.
  - **200% zoom** (CSS viewport 720, 640 and 512px at 2× DPR) on Home, Experience, Projects and Resume: no overflow, no overlap; screenshot checked.
  - **Reduced motion:** no element with an active animation.
  - Console: only the expected Drive warning (none in pass B, which had a valid link).
- **⚠ Not verifiable here (please check on a real iPhone):** iOS Safari, i.e. no white flash on load in dark mode, the sticky header while the toolbar collapses, and `85dvh` on the Resume preview with the toolbar shown/hidden. Everything it depends on (the inline theme script, `color-scheme`, `min-h-dvh`, `dvh` units) is in place.
- `pnpm build` and `pnpm lint` are clean. **Bundle: 135.33 KB gzip initial JS** (`index` 130.18 + shared chunk 5.15), up 0.09 KB from the nav effect.
- **Session note:** killing `pnpm dev` leaves the Vite child listening; free it with `Get-NetTCPConnection -LocalPort 5199 -State Listen | % { Stop-Process -Id $_.OwningProcess -Force }`. The port is free.
- **Owner decisions (final; don't reopen):**
  1. **After Step 8:** the three Step 8 deviations are accepted and documented (36px social icon links; `links: readonly Social[]`; `validate.ts` hot-accept). The 320px nav keeps the horizontal-scroll fallback (§4.5 has the real measurements).
  2. **Consolidation pass, bundle:** initial JS **≤ 140 KB gzip, a hard cap** (supersedes Step 8's 130 KB). If it's exceeded later, **code-split; never raise it again, and keep the full `SOCIAL_ICONS` and `TECH_ICONS` registries.** Recorded in §8, CLAUDE.md DoD #7 and Step 15.
  3. **Consolidation pass, accordion: superseded after Step 13.** The owner replaced the accordion with the Home preview layout, so the chevron decision no longer applies. Still valid: the Experience page shows the labelled blocks without a `border-t`, and labels are `text-sm font-medium text-muted`.
  4. **Consolidation pass, other fixes:** all the extra fixes are accepted: `baseUrl`, `@source not`, `HydrateFallback`, the skip-link ring, the 300ms state-toggle rule, and safe link schemes in RichText.
  5. **Step 9 deviations accepted and now in the spec:**
     - TechChip's direct registry read;
     - the ExternalLink focus ring;
     - CopyEmail details;
     - `copy()` returning `Promise<boolean>`.
  6. **Step 16:** footer socials `gap-0` below `sm`; the Projects grid keeps equal card heights in a row (no `items-start`); focus rings appear instantly (`focus-visible:transition-none` on `text-muted` controls with `transition-colors`).
- **Decisions / deviations from spec** (everything below is now reflected in IMPLEMENTATION.md):
  - **From Step 10:**
    - the duration span renders only when it is non-empty, so there is no stray "·";
    - the role/type line is guarded;
    - the company `<a>`/`<span>` gets `min-w-0`, and the `<a>` gets a hover underline.

    `totalExperience` was added to `lib/dates.ts` for the page subtitle.
  - **From Step 11:**
    - `ProjectCard` has `headingAs` (h2 on the Projects page);
    - "Live"/"Source" get `aria-label`s like "Live: <title>";
    - the image transition uses the spec easing plus `motion-reduce`;
    - the Projects subtitle is generic UI copy in `Projects.tsx`;
    - `public/projects/project-one.webp` is a placeholder.
  - **From Step 12:** the hero is side by side at all widths; the avatar has `alt=""` and `bg-subtle`; "All projects →" hides when everything is shown; the skills label alignment; `tagline` is used only as the Home meta (all in §6.1).
  - **From Step 13:** the Resume button icons, no `Reveal` on Resume/404, and the 320px button wrap (all in §6.5).
  - **From Step 16:** the active-nav scroll is instant (not smooth); the footer gap rule lives on `SocialLinks size="sm"`, so Home's socials keep `gap-1`.
  - **From Step 14:**
    - the default transition easing token (CLAUDE.md asked for the house easing; Tailwind's default was in use);
    - reduced motion also cancels the two hover transforms instead of letting them snap;
    - the favicon follows the browser/OS colour scheme, not the site toggle (an SVG favicon can't see the page's `.dark` class).
  - **Consolidation pass:**
    - **`ExperienceItem` gets a `headingAs?: "h2" | "h3"` prop.** It isn't one of decisions A–I, but it's needed so the Experience page doesn't jump from h1 to h3, which would fail Phase 5's "heading levels don't skip". Home uses h3 (under the Section's h2); the Experience page uses h2.
    - ~~`expandable` replaces the old `compact` prop~~: superseded after Step 13 by `preview` (§6.2), still a single mode flag.
    - **Inline RichText links get the standard focus ring** in addition to the spec'd link classes.
    - ~~Chevron `-my-1.5` and panel `-mx-1 px-1 pb-1`~~: removed with the accordion after Step 13.
  - From Step 9: see Owner decisions #5. `getTechIcon` is still exported but unused in render code.
  - From Step 8: `{...(!isMail && {...})}` became an `external` object, with the same behaviour.
  - From Step 7:
    - **The 320px nav uses the scroll fallback.** "Resume" shows cut off until you swipe or Tab to it, or navigate to it (Step 16 scrolls the active link into view). `onFocus` calls `scrollIntoView`, and the toggle has `shrink-0`.
    - **The optional scrolled hairline (§4.5) isn't built.** Ask if you want it.
    - **Don't add a forced reflow after `setTheme`,** or the icon crossfade stops.
    - `min-w-0` on `<nav>`, `whitespace-nowrap` on links, and `size-4.5` toggle icons.
  - From Step 6:
    - Two `<title>` tags end up in `<head>`; React's comes first, so the tab title is right.
    - Every page now has its `<meta name="description">` (Step 13 finished Resume and 404). The static description in `index.html` stays first in `<head>`, so each page ends up with two; review it in Step 15 or 17.
    - `errorElement` shows "404" even when a page crashes.
  - From Step 4: `src/lib/resume.ts` exists early, because the validator uses `getDriveId`. The data-file comment headers go beyond the spec.
  - From Step 3: `eslint.config.js` allows the `useTheme` export via `allowExportNames`.
  - **Owner rule (CLAUDE.md "Plugins, skills & MCP servers"):** never install, enable or invoke plugins, skills or MCP servers unless asked in that session. The frontend-design plugin is enabled in the owner's user-level settings and must not be used. None has been used so far.
- **Owner needs to provide:**
  - real content in `src/data/*`;
  - the resume's Google Drive share link in `site.resume.driveUrl` (Share → "Anyone with the link" → Viewer);
  - a real `public/avatar.webp` to replace the placeholder (square, ≥ 160×160, ≤ 30 KB). If you set `avatar: null`, delete the preload line in `index.html`;
  - `public/og.png` (1200×630);
  - **your initial in `public/favicon.svg`** (the `<text>` currently says "Y");
  - project images: replace the placeholder `public/projects/project-one.webp`;
  - **real company logos in `public/logos/`** (square `.svg`/`.webp`). Replace `company-a.svg`, or drop `logo` to get a letter tile.

  Placeholders are fine until then. The `<title>`, description and OG text in `index.html` are static placeholders, so edit them by hand to match `site.ts`.
- **Known issues / TODO:**
  - **Avatar preload on every route:** `index.html` preloads `/avatar.webp` on `/experience`, `/projects` etc. too, where no avatar is shown (≤ 30 KB, and it's cached for Home). It's per spec (§2.5); a static `index.html` can't tell routes apart. Leave it unless Lighthouse flags "preloaded but not used".
  - **Unused JetBrains Mono:** `@fontsource-variable/jetbrains-mono` is imported (§2.2) but no component uses `font-mono`. Browsers never download it, so the only cost is ~1 KB of `@font-face` CSS. Keep it for code snippets later, or drop the import if you don't want it (ask first; it's in the spec).
  - **Expected dev warning:** the single `[content]` warning about the placeholder Drive link appears until a real link is pasted. It prints once per full page load and after each hot data edit.
  - Git on Windows warns about LF→CRLF. Add `.gitattributes` with `* text=auto eol=lf` if you want LF everywhere; ask first.
  - Delete the `.gitkeep` files as real files land in each folder (all folders that had one now have real files).

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

- [x] **Step 9: Shared UI primitives**
  Read: §5.1 to §5.8
  `Section`, `PageHeader`, `Reveal`, `TechChip`, `StatusBadge`, `ExternalLink`, `CopyEmail` + `useCopyToClipboard`. `RichText` + `lib/richText.ts` (§5.8) were added in the consolidation pass after Step 9.
  **Done when:** each component renders on a stub page without errors; copy-email shows the copied state and announces it; StatusBadge ping is hidden with reduced motion.

- [x] **Step 10: Experience item + Experience page**
  Read: §6.2, §6.3, §5.8
  `CompanyLogo`, `ExperienceItem` (both modes: full and `expandable`, plus `headingAs`), the Experience page. Add the page's `<meta name="description">`.
  **Done when:**
  - the full list is sorted correctly, with "Working" on current jobs;
  - the duration shows on `sm+`;
  - removing optional fields leaves no gaps, stray "·" or empty labels;
  - long company names wrap at 320px;
  - **every item shows a tile:**
    - Company A's logo on `bg-logo` (`object-contain p-1.5`, `width`/`height`, lazy, `alt=""`);
    - Company B's monogram "C" on `bg-subtle`;
    - both are the same size (`size-10 sm:size-12`);
  - title row, labels, chips, bullets and links all share the content column's left edge;
  - "Technologies & Tools" and "What I've done" labels use `text-sm font-medium text-muted`;
  - highlights render through `RichText` (the bold metric and the inline link are correct);
  - `links` render as `ExternalLink`s after the bullets in `mt-4 flex flex-wrap gap-x-4 gap-y-2`;
  - no `border-t` on the Experience page;
  - headings go h1 → h2 (`headingAs="h2"`) with no skip;
  - the logo doesn't 404;
  - **`expandable` mode checked on a temporary render** (Home wires it in Step 12):
    - a `size-9` chevron with a `size-4` icon after the company and badge;
    - `aria-expanded`, `aria-controls` (`useId`) and the "Show/Hide details for …" label update;
    - the chevron rotates 90° over 300ms;
    - the panel animates `grid-rows-[0fr]` ↔ `[1fr]` with an opacity fade;
    - `inert` when closed, so its links aren't tabbable;
    - focus rings inside the panel aren't clipped;
    - with reduced motion it opens instantly;
    - **no chevron when an item has no tech, highlights or links**.

- [x] **Step 11: Project card + Projects page**
  Read: §6.4, §5.8
  **Done when:** 1 column on mobile, 2 on `sm+`; cards in a row line up; projects with no image or links still look intentional; no nested anchors; images lazy-load with no layout shift; **descriptions render through `RichText`** (`**bold**` and `[label](url)` work, broken markers show as text); the page has its `<meta name="description">`.

- [x] **Step 12: Home page**
  Read: §6.1, §6.2 (accordion part)
  Hero, bio, socials, expandable experience, featured projects, skills, all wrapped in `Reveal` with stagger. **Replaces the temporary Step 9 preview entirely.**
  **Done when:**
  - limits from `site.home` are respected;
  - "View all" is hidden when nothing more exists;
  - the featured section hides when no project is featured;
  - a null avatar still looks good;
  - the staggered entrance looks subtle and smooth;
  - **the bio renders through `RichText`;**
  - **experience items are `expandable`** (`space-y-8`):
    - all start closed and open independently;
    - the panel shows a `border-t` divider, then Technologies & Tools, then What I've done, then links;
    - no chevron on an item with no details;
  - initial JS is **≤ 140 KB gzip** (record it). If it's over, code-split; don't raise the cap.

- [x] **Step 13: Resume page + 404 page**
  Read: §6.5, §6.6
  Resume comes from Google Drive (`site.resume.driveUrl` → `src/lib/resume.ts`).
  **Done when:** with a real Drive link, "Download" and "Open in Google Drive" both open in a new tab and work; the Drive preview iframe shows at every width (capped at `85dvh`, no overflow at 320px) inside the wrapper (`relative mt-8 overflow-hidden rounded-lg border border-border bg-subtle`, iframe without its own border) with "Loading preview…" visible behind it while it loads; with the placeholder or a malformed link, only "Resume coming soon." shows (no buttons, no iframe); 404 has a working "Go home" link.

### Quality

- [x] **Step 14: Motion + polish pass**
  Read: §7
  Audit every animation against the allowed list (§7 table, including the copy-icon crossfade); remove anything else. Add the SVG favicon. Check focus rings and `::selection`.
  **Done when:** no `transition-all` and no `dangerouslySetInnerHTML` anywhere (`grep`); no layout animation anywhere (`grep` for `grid-template-rows`, `grid-rows`, width/height transitions finds nothing); reduced motion turns everything off; theme switch has no fade lag.

- [x] **Step 15: Performance pass**
  Read: §8
  **Done when:** `pnpm build` output shows initial JS **≤ 140 KB gzip, a hard cap** (owner, consolidation pass; it supersedes Step 8's 130). If it's over, code-split (§8); never raise the cap or trim the icon registries; no layout shift on load, theme switch or navigation; images have dimensions; record the bundle sizes in Handoff notes.

- [x] **Step 16: Responsive + accessibility QA**
  Read: §9
  Go through the whole checklist at every listed width in both themes; fix every issue found.
  Also do these (owner requests, added after Step 8):
  - **Nav: scroll the active link into view on route change.** In `Header`, on every `pathname` change, call `scrollIntoView({ inline: "nearest", block: "nearest" })` on the active `NavLink` (`aria-current="page"`). Respect reduced motion: use the default instant behaviour, or `behavior: "smooth"` only when `prefers-reduced-motion` is not `reduce`. It must never scroll the page vertically. The header is sticky at the top, so `block: "nearest"` is a no-op there; verify it. This fixes "Resume" staying clipped at 320px after navigating to `/resume`.
  - **Footer: move `border-t border-border` off `<footer>` and onto an inner element inside the `<Container>`** (decided by the owner), so the hairline matches the text width exactly at every screen size and never reaches the scrollbar gutter. Don't put it on the Container itself, because that would include its `px-5 sm:px-6` padding. For example, wrap the row in a `<div className="flex … border-t border-border py-8">` inside `<Container>`, keeping the existing flex classes. Check 320, 768 and 1440px in both themes: the line's ends must align with the © text and the last social icon's box.
  - **Footer socials at 320px on desktop browsers** (classic scrollbar gutter) wrap to 2 rows; see Known issues. Decide: tighten the gap below `sm`, or accept the wrap.
  - **Review the "Ideas / later" list** at the bottom of this file with the owner; do only the items they pick.
  **Done when:** every §9 box is satisfied (including the new ones: tap targets ≥ 36px, tile alignment, Home showing the first N highlights in the Experience page style, project link icon columns, rich-text links); the two owner requests above are done and checked; the footer-wrap decision is made; list anything still imperfect in Handoff notes.

- [ ] **Step 17: Deploy prep + README**
  Read: §10, §11
  `vercel.json` and/or `public/_redirects`, `robots.txt`, `sitemap.xml`, `packageManager` field, README with the owner quick reference.
  **Done when:** `pnpm build && pnpm preview` works; deep-linking `/projects` on preview works; README explains how to edit content.

### Optional

- [ ] **Step 18: Design audit (only if the owner installed Hallmark)**
  Run `hallmark audit` on Home, Experience, Projects and Resume. **Report only; don't edit.** Write the punch list into Handoff notes so the owner can pick fixes, which are then done with `fix: …`.

- [ ] **Step 19 (optional, on its own branch): Dawn/dusk theme transition**
  Read: §7.1
  Do this last, and only if the owner asks. **The owner creates `feat/theme-transition` and switches to it first.** Check `git branch --show-current` and stop if it's anything else (never create or switch branches yourself).
  Build the View Transitions dusk/dawn effect exactly as in §7.1: the CSS in `index.css`, then `toggleTheme` in `ThemeContext.tsx`.
  **Done when:**
  - in Chromium (and Safari 18+ / Firefox where supported), light → dark shows **dusk**: the old light page shrinks into the centre. Dark → light shows **dawn**: the new light page grows from the centre. Both run 650ms, `cubic-bezier(0.65,0,0.35,1)`, with no cross-fade, blend or flash;
  - clicks during a transition are ignored, so a double-click gives one switch;
  - with no API support, or with reduced motion on, the switch is instant, exactly as before;
  - an OS theme change, with no stored choice, stays instant;
  - `.no-transitions` is still applied, so no colour lag;
  - the theme persists across reloads; the toggle's aria-label and icon update; focus stays on the toggle;
  - `data-theme-transition` is removed afterwards;
  - `pnpm build` and `pnpm lint` are clean; initial JS ≤ 140 KB; no console errors.

  The owner reviews the branch and merges it. Only after the merge does the CLAUDE.md View Transitions exception apply.

- [ ] **Step 20 (optional): Adaptive Home for zero experience** (parked; don't build)
  - **Scope:**
    - project highlights;
    - a "detailed" `ProjectCard` variant;
    - Home goes projects-first when `experience.length === 0`;
    - `getVisibleNav()` hides empty pages;
    - an `/experience` redirect.
  - Behaviour with ≥ 1 job stays unchanged.
  - **The owner will provide the spec.**

---

## Ideas / later

Visual tweaks to review with the owner at Step 16. Add a line here instead of doing it straight away.

_Nothing open. (Step 16: the Projects grid card-height idea was decided: keep equal heights.)_
