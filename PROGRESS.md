# PROGRESS.md

Session memory for Claude Code. Each session: read this file, do the **first unchecked step only**, verify, tick it, update **Handoff notes**, suggest a commit message, stop. Never commit; the owner commits manually. See `CLAUDE.md`, under "Session workflow".

Each step lists the `IMPLEMENTATION.md` sections to read. Read only those.

---

## Handoff notes

_Overwrite this section at the end of every step._

- **Last completed step:** Step 10 — Experience item + Experience page. Step 11 (Project card + Projects page) is next.
- **Files created:**
  - `src/components/experience/CompanyLogo.tsx`: as in §6.2. The logo tile is `bg-logo` with `alt=""`; the monogram tile is `bg-subtle` and `aria-hidden`.
  - `src/components/experience/ExperienceItem.tsx` has both modes:
    - full (default);
    - `expandable`: chevron, `useId` panel, `inert`, grid-rows accordion.

    It also takes `headingAs` (default `"h3"`). All details blocks follow §6.2.
- **Files changed:**
  - `src/lib/dates.ts`: new `totalExperience(list)`, the time since the earliest start, which feeds the page subtitle.
  - `src/pages/Experience.tsx`: the real page. It has:
    - `PageHeader` with the subtitle "1 yr 4 mos of experience." (computed);
    - `<meta name="description">`;
    - a `divide-y divide-border` list, each row `py-8 first:pt-0`, using `headingAs="h2"`.
  - `IMPLEMENTATION.md`:
    - §3.8: `totalExperience` added to the code block;
    - §6.2: the duration line now uses a guarded `duration` variable;
    - §6.3: the subtitle and description text are spelled out.
  - Deleted `src/components/experience/.gitkeep`.
- **Verified with headless Chrome against dev** (320, 375, 768 and 1440px, light and dark, via a CDP script in the session scratchpad):
  - **Order and badge:** Company A (current, "Working" badge) comes before Company B.
  - **Duration:** "· 11 mos" is `display:none` below `sm` and inline from 768px up.
  - **Tiles:**
    - 40×40 below `sm`, 48×48 from `sm` up;
    - the logo tile is `rgb(255,255,255)` in light and `rgb(244,244,245)` in dark;
    - the monogram "C" sits on `bg-subtle`;
    - the img has `alt=""`, 48/48, lazy, async and `object-contain p-1.5`, and loads (no 404).
  - **Content column:**
    - every title, label, chip list, bullet list and links row shares one left edge (76px at 320, 417px at 1440);
    - the only other x position is the right-aligned date column on `sm+`.
  - **Labels:** both labels use `text-sm font-medium text-muted`.
  - **RichText:**
    - one `<strong>` with the metric;
    - the inline "write-up" and the "Case study" `ExternalLink` both get `_blank` and `noopener noreferrer`;
    - the links row has `mt-4 flex flex-wrap gap-x-4 gap-y-2`.
  - **No `border-t`** on the Experience page. The only bordered elements are the tiles, the chips and the StatusBadge.
  - **Headings** go h1 → h2 → h2. No chevrons on the Experience page.
  - **Overflow:** no horizontal overflow at any width.
  - **Console:** only the expected Drive-link `[content]` warning. No errors, no key warnings, no HTTP ≥ 400.
  - **`expandable` was checked on a temporary render on Home** (since reverted; `Home.tsx` matches its backup and `git status` shows no change). It used 2 real items plus a details-less item with a very long company name:
    - the chevron is 36×36 with a `size-4` icon, and the h3 stays 24px tall;
    - `aria-expanded`, `aria-controls` and "Show/Hide details for …" all update;
    - `rotate` goes `90deg` when open, over 0.3s;
    - the panel animates `grid-template-rows 0.3s` from 0px to about 396px; mid-animation at 120ms it was 360px high at opacity 0.59;
    - closed panels are `inert`, height 0 and opacity 0. The Tab order skips their links; once opened, "write-up" and "Case study" join the Tab order after the chevron;
    - focus rings inside an open panel aren't clipped (the outline box is ≥ 0px inside the overflow box on every side);
    - **reduced motion:** all three transitions become `1e-05s`, so it opens instantly;
    - the details-less item has no chevron and no panel, and its long name wraps at 320 and 375px with no overflow;
    - panel order: `border-t` divider, then Technologies & Tools, then What I've done, then links;
    - no duration in `expandable` mode.
  - `pnpm build` and `pnpm lint` are clean. Greps for raw colours, `transition-all` and `dangerouslySetInnerHTML` in the new files: none.
- **Bundle:** **132.3 KB** gzip initial JS (395.0 KB raw), within the 140 KB cap. The Experience lazy chunk is 2.2 KB gzip.
- **Step 10 deviations (small, already in the spec):**
  - **The duration span renders only when `formatDuration` is non-empty,** so a future start date can't leave a stray "·".
  - **The role/type line is guarded with `subtitle &&`.** `role` is required, so it always shows in practice.
  - **The company `<a>`/`<span>` gets `min-w-0`,** so a long single-word name can wrap inside the flex heading. The `<a>` also has `underline-offset-4 hover:underline` plus the focus ring (the spec only said "…").
- **Owner decisions (final; don't reopen):**
  1. **After Step 8:** the three Step 8 deviations are accepted and documented (36px social icon links; `links: readonly Social[]`; `validate.ts` hot-accept). The 320px nav keeps the horizontal-scroll fallback (§4.5 has the real measurements).
  2. **Consolidation pass, bundle:** initial JS **≤ 140 KB gzip, a hard cap** (supersedes Step 8's 130 KB). If it's exceeded later, **code-split; never raise it again, and keep the full `SOCIAL_ICONS` and `TECH_ICONS` registries.** Recorded in §8, CLAUDE.md DoD #7 and Step 15.
  3. **Consolidation pass, accordion:**
     - the chevron is `size-9` (36px tap area) with a `size-4` icon (decision E updated);
     - the Experience page shows the labelled blocks without a `border-t`;
     - panel labels are `text-sm font-medium text-muted`.
  4. **Consolidation pass, other fixes:** all the extra fixes are accepted: `baseUrl`, `@source not`, `HydrateFallback`, the skip-link ring, the 300ms state-toggle rule, and safe link schemes in RichText.
  5. **Step 9 deviations accepted and now in the spec:**
     - TechChip's direct registry read;
     - the ExternalLink focus ring;
     - CopyEmail details;
     - `copy()` returning `Promise<boolean>`.
- **Decisions / deviations from spec** (everything below is now reflected in IMPLEMENTATION.md):
  - **Consolidation pass:**
    - **`ExperienceItem` gets a `headingAs?: "h2" | "h3"` prop.** It isn't one of decisions A–I, but it's needed so the Experience page doesn't jump from h1 to h3, which would fail Phase 5's "heading levels don't skip". Home uses h3 (under the Section's h2); the Experience page uses h2.
    - **`expandable` replaces the old `compact` prop** (§6.2), so the item has only one mode flag.
    - **Inline RichText links get the standard focus ring** in addition to the spec'd link classes.
    - **The chevron button has `-my-1.5`,** so its 36px hit area doesn't make the title line taller.
    - **The panel has `-mx-1 px-1` and `pb-1`,** so `overflow-hidden` doesn't clip focus rings.
  - From Step 9: see Owner decisions #5. `getTechIcon` is still exported but unused in render code.
  - From Step 8: `{...(!isMail && {...})}` became an `external` object, with the same behaviour.
  - From Step 7:
    - **The 320px nav uses the scroll fallback.** "Resume" shows cut off until you swipe or Tab to it. `onFocus` calls `scrollIntoView`, and the toggle has `shrink-0`.
    - **The optional scrolled hairline (§4.5) isn't built.** Ask if you want it.
    - **Don't add a forced reflow after `setTheme`,** or the icon crossfade stops.
    - `min-w-0` on `<nav>`, `whitespace-nowrap` on links, and `size-4.5` toggle icons.
  - From Step 6:
    - Two `<title>` tags end up in `<head>`; React's comes first, so the tab title is right.
    - Pages still lack `<meta name="description">`; add them in Steps 10 to 13 (Experience done in Step 10). The static description in `index.html` stays first in `<head>`, so each page ends up with two; review it in Step 15 or 17.
    - `errorElement` shows "404" even when a page crashes.
  - From Step 4: `src/lib/resume.ts` exists early, because the validator uses `getDriveId`. The data-file comment headers go beyond the spec.
  - From Step 3: `eslint.config.js` allows the `useTheme` export via `allowExportNames`.
  - **Owner rule (CLAUDE.md "Plugins, skills & MCP servers"):** never install, enable or invoke plugins, skills or MCP servers unless asked in that session. The frontend-design plugin is enabled in the owner's user-level settings and must not be used. None has been used so far.
- **Owner needs to provide:**
  - real content in `src/data/*`;
  - the resume's Google Drive share link in `site.resume.driveUrl` (Share → "Anyone with the link" → Viewer);
  - `public/avatar.webp` and `public/og.png` (1200×630);
  - project images;
  - **real company logos in `public/logos/`** (square `.svg`/`.webp`). Replace `company-a.svg`, or drop `logo` to get a letter tile.

  Placeholders are fine until then. The `<title>`, description and OG text in `index.html` are static placeholders, so edit them by hand to match `site.ts`.
- **Known issues / TODO:**
  - **Missing placeholder files:** `site.avatar` (`/avatar.webp`) and `/projects/project-one.webp` don't exist yet, so they'll 404 once Steps 11 and 12 render them. Add the files, or set `avatar: null` and drop `image`. The logo placeholder does exist.
  - **Expected dev warning:** the single `[content]` warning about the placeholder Drive link appears until a real link is pasted. It prints once per full page load and after each hot data edit.
  - **Nav at 320px:** after navigating to `/resume`, the active "Resume" link stays partly clipped. **Fixed in Step 16** (scroll-into-view on route change, §4.5).
  - **Footer border at 1440px:** the full-width top border stops about 15px short of the right edge, at the scrollbar gutter. **Fixed in Step 16** (the hairline moves onto an inner element, §4.7).
  - **Footer socials at 320px in desktop Chrome wrap to 2 rows.** The 15px classic scrollbar gutter leaves 265px for 276px of icons; phones, with overlay scrollbars, show 1 row. **Look at it in Step 16:** for example `gap-0` below `sm` (252px), or accept the wrap.
  - **The Step 9 preview on Home is temporary.** Step 12 replaces it.
  - Git on Windows warns about LF→CRLF. Add `.gitattributes` with `* text=auto eol=lf` if you want LF everywhere; ask first.
  - Delete the `.gitkeep` files as real files land in each folder (`projects/` still has one).

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

- [ ] **Step 11: Project card + Projects page**
  Read: §6.4, §5.8
  **Done when:** 1 column on mobile, 2 on `sm+`; cards in a row line up; projects with no image or links still look intentional; no nested anchors; images lazy-load with no layout shift; **descriptions render through `RichText`** (`**bold**` and `[label](url)` work, broken markers show as text); the page has its `<meta name="description">`.

- [ ] **Step 12: Home page**
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

- [ ] **Step 13: Resume page + 404 page**
  Read: §6.5, §6.6
  Resume comes from Google Drive (`site.resume.driveUrl` → `src/lib/resume.ts`).
  **Done when:** with a real Drive link, "Download" and "Open in Google Drive" both open in a new tab and work; the Drive preview iframe shows at every width (capped at `85dvh`, no overflow at 320px) inside the wrapper (`relative mt-8 overflow-hidden rounded-lg border border-border bg-subtle`, iframe without its own border) with "Loading preview…" visible behind it while it loads; with the placeholder or a malformed link, only "Resume coming soon." shows (no buttons, no iframe); 404 has a working "Go home" link.

### Quality

- [ ] **Step 14: Motion + polish pass**
  Read: §7
  Audit every animation against the allowed list (§7 table, including the copy-icon crossfade, accordion and chevron); remove anything else. Add the SVG favicon. Check focus rings and `::selection`.
  **Done when:** no `transition-all` and no `dangerouslySetInnerHTML` anywhere (`grep`); the only layout animation is the accordion's `transition-[grid-template-rows]` (`grep`); reduced motion turns everything off (the accordion and chevron included); theme switch has no fade lag.

- [ ] **Step 15: Performance pass**
  Read: §8
  **Done when:** `pnpm build` output shows initial JS **≤ 140 KB gzip, a hard cap** (owner, consolidation pass; it supersedes Step 8's 130). If it's over, code-split (§8); never raise the cap or trim the icon registries; no layout shift on load, theme switch or navigation; images have dimensions; record the bundle sizes in Handoff notes.

- [ ] **Step 16: Responsive + accessibility QA**
  Read: §9
  Go through the whole checklist at every listed width in both themes; fix every issue found.
  Also do these (owner requests, added after Step 8):
  - **Nav: scroll the active link into view on route change.** In `Header`, on every `pathname` change, call `scrollIntoView({ inline: "nearest", block: "nearest" })` on the active `NavLink` (`aria-current="page"`). Respect reduced motion: use the default instant behaviour, or `behavior: "smooth"` only when `prefers-reduced-motion` is not `reduce`. It must never scroll the page vertically. The header is sticky at the top, so `block: "nearest"` is a no-op there; verify it. This fixes "Resume" staying clipped at 320px after navigating to `/resume`.
  - **Footer: move `border-t border-border` off `<footer>` and onto an inner element inside the `<Container>`** (decided by the owner), so the hairline matches the text width exactly at every screen size and never reaches the scrollbar gutter. Don't put it on the Container itself, because that would include its `px-5 sm:px-6` padding. For example, wrap the row in a `<div className="flex … border-t border-border py-8">` inside `<Container>`, keeping the existing flex classes. Check 320, 768 and 1440px in both themes: the line's ends must align with the © text and the last social icon's box.
  - **Footer socials at 320px on desktop browsers** (classic scrollbar gutter) wrap to 2 rows; see Known issues. Decide: tighten the gap below `sm`, or accept the wrap.
  - **Review the "Ideas / later" list** at the bottom of this file with the owner; do only the items they pick.
  **Done when:** every §9 box is satisfied (including the new ones: tap targets ≥ 36px including the chevron, tile alignment, accordion keyboard and `inert`, rich-text links); the two owner requests above are done and checked; the footer-wrap decision is made; list anything still imperfect in Handoff notes.

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

---

## Ideas / later

Visual tweaks to review with the owner at Step 16. Add a line here instead of doing it straight away.

-
