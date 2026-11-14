# PROGRESS.md

Session memory for Claude Code. Each session: read this file, do the **first unchecked step only**, verify, tick it, update **Handoff notes**, suggest a commit message, stop. Never commit; the owner commits manually. See `CLAUDE.md`, under "Session workflow".

Each step lists the `IMPLEMENTATION.md` sections to read. Read only those.

---

## Handoff notes

_Overwrite this section at the end of every step._

- **Last completed step:** Step 9 — Shared UI primitives, followed by a **consolidation pass**: docs synced with owner decisions A–I, plus a code audit. No new step was started; Step 10 is next.
- **Docs changed in the consolidation pass:**
  - **CLAUDE.md:**
    - **Architecture:** `ui/RichText`, `experience/CompanyLogo`, `lib/richText.ts` and `public/logos/` added, plus a RichText rule (never `dangerouslySetInnerHTML`, never auto-bold).
    - **Tokens:** `bg-logo` added to the token list.
    - **Animation rules:**
      - the single layout exception (accordion `grid-template-rows`);
      - a 300ms state-toggle duration;
      - View Transitions allowed only for Step 19, once merged.
    - **Owner table:** company logo, links under a job, bold/links writing guidance, and an "Update resume" row. Name/bio/email are split from resume.
    - **Definition of done #7:** initial JS ≤ 140 KB gzip, hard cap.
    - **Checked and unchanged:** the "Plugins, skills & MCP servers" section and the never-commit rule.
  - **IMPLEMENTATION.md:**
    - **§1:** new rows for formatted text, company logos, the Home accordion and the bundle cap.
    - **§2–§4, catching up with the code:**
      - §2.3: no `baseUrl`, explicit `strict`;
      - §2.4: `@source not` and the `--logo` token;
      - §2.5: avatar preload commented out;
      - §4.1: `HydrateFallback` and `import type { ComponentType }`;
      - §4.3: skip-link focus ring;
      - §4.6: toggle `shrink-0`.
    - **§3:**
      - §3.1 types: `ExperienceLink`, `logo?`, `links?`, rich-text notes;
      - §3.2, §3.5, §3.6: data headers and the new placeholder data;
      - §3.10: two new validator checks, plus a Phase 2 acceptance item.
    - **§4.5 and §4.7:** "Step 16" notes for the nav scroll-into-view and the footer hairline.
    - **§5:** §5.2 PageHeader, §5.4 TechChip lint-safe code, §5.5 `StatusBadgeProps`, §5.6 ExternalLink and §5.7 CopyEmail as built. **New §5.8 RichText.**
    - **§6:**
      - §6.1: Home bio uses RichText; the experience list uses `expandable` items with `space-y-8`, replacing `space-y-6`, which broke CLAUDE.md's spacing rule;
      - **§6.2, rewritten:** `CompanyLogo`, the `[tile][content]` layout, labelled detail blocks, the links row, the accordion, and `expandable`/`headingAs` replacing `compact`;
      - §6.3: Experience page uses `headingAs="h2"`, labelled blocks and no `border-t`;
      - §6.4: RichText descriptions;
      - §6.5: border and `overflow-hidden` move onto the iframe wrapper.
    - **§7:** motion table plus durations line. **New §7.1, the dawn/dusk Step 19 spec.**
    - **§8:** 140 KB hard cap; if it's exceeded, code-split.
    - **§9:** new QA boxes for tap targets, tiles, accordion and rich-text links.
    - **§11:** quick-reference lines.
    - **§12:** RichText, CompanyLogo and the optional phase; "resume PDF" becomes "Drive link"; "View Transitions" comes off the Future list.
  - **PROGRESS.md:**
    - Step 9 now includes RichText.
    - New "Done when" items in **Steps 10, 11, 12, 13, 14, 15 and 16** (see below).
    - **New Step 19** (optional, on its own branch).
    - **New "Ideas / later" section** at the bottom.
- **Code changed in the consolidation pass:**
  - `src/index.css`: `--logo` (`#ffffff` light, `#f4f4f5` dark) and `--color-logo`.
  - `src/types/content.ts`: `ExperienceLink`, `Experience.logo?`, `Experience.links?`, and rich-text doc comments on `bio`, `highlights` and `description`.
  - **`src/data/experience.ts`, new header with the writing guidance:**
    - Company A has a logo, one **bold** metric, an inline `[link](url)`, a plain bullet and `links`;
    - Company B has none of them.
  - Data headers: `projects.ts` and `site.ts` mention rich text.
  - **New `public/logos/company-a.svg`:** a neutral placeholder, so Step 10 won't 404.
  - **`src/lib/validate.ts`** warns when:
    - `logo` doesn't match `/^\/logos\/[^/]+\.(svg|webp)$/`;
    - a `links[].url` is empty.
  - **New `src/lib/richText.ts`** (pure tokenizer: `parseRichText`, `getLinkKind`) and **`src/components/ui/RichText.tsx`**.
  - The temporary Step 9 preview on Home also shows a "Rich text" section. **Step 12 replaces the whole preview.**
- **Which steps decisions A–I belong to:**
  - **Built now** (their steps are ticked): the token, types, data, validator and RichText.
  - **Docs only** (their steps aren't done yet): CompanyLogo, ExperienceItem and the accordion (Steps 10 and 12), the Resume wrapper (Step 13), Step 16's notes, and Step 19.
  - **Already present, verified:**
    - decision A (Drive resume, `getResumeLinks`, the "coming soon" warning);
    - decision F (36px socials, 320px nav fallback);
    - decision G (Step 16 notes).
- **Audit results:**
  - **Spec vs code:** a script compared every full code block in IMPLEMENTATION.md with its source file, ignoring whitespace and comments. That covers 25 files: `index.css`, `index.html`, theme, context, cn, types, all 6 data files, dates, icons, router, main, RootLayout, Container, Footer, SocialLinks, Section, Reveal, TechChip, StatusBadge and resume. **All match.** The only two differences were the spec lagging behind the code (router's `ComponentType` import, StatusBadge's props type), and the spec was fixed. The code was right per CLAUDE.md. Prose-only sections (Header §4.5, ThemeToggle §4.6, PageHeader §5.2, ExternalLink §5.6, CopyEmail §5.7) were checked by hand and match.
  - **Greps, all clean:**
    - raw palette classes and arbitrary colours: none;
    - `transition-all`: none;
    - `dangerouslySetInnerHTML`: none;
    - `package-lock.json`, `yarn.lock`, `npm-shrinkwrap.json`: none (`pnpm-lock.yaml` only);
    - `resume.pdf`: none, repo-wide;
    - `tailwind.config.*`: none;
    - forbidden dependencies: none;
    - `forwardRef`, `.Provider`, `any`, `@ts-ignore`, `enum`, `useContext`: none;
    - `document.title`, `min-h-screen`: none;
    - `_blank` without `noopener noreferrer`: none.
  - **Tokenizer:** 18/18 cases pass under Node type-stripping. They cover:
    - plain text, bold and two bolds;
    - external, internal and mailto links;
    - `javascript:` → text;
    - `//host` → text;
    - `data:` → text;
    - unclosed `**`;
    - `** spaced **`;
    - `****`;
    - empty label;
    - unclosed `(`;
    - a space in the URL;
    - literal HTML;
    - an empty string.
  - **Headless Chrome against dev:**
    - RichText renders one `<strong class="font-medium text-fg">`;
    - the external link gets `_blank` and `noopener noreferrer`;
    - `/projects` is a client-side `Link` (navigation without a reload was verified);
    - `mailto:` has no target;
    - link classes match the spec, the underline colour equals `--border`, and no raw markers are left in the DOM.
  - **`--logo`/`bg-logo`** resolve to `#ffffff`/`rgb(255,255,255)` in light and `#f4f4f5`/`rgb(244,244,245)` in dark. This was checked with a temporary probe element, since removed.
  - **Validator:** with a temporary `logo: "logo.png"` and `links: [{ label: "Broken", url: "" }]`, both new warnings appear in the single grouped `[content]` warning. The file was restored from a backup, and `Home.tsx` likewise.
  - **Console in dev:** only the expected Drive-link `[content]` warning; no key warnings and no errors.
  - `pnpm build` and `pnpm lint` are clean, with zero warnings.
- **Bundle: 132.2 KB gzip initial JS (394.8 KB raw), within the new 140 KB hard cap.** It was 131.3 after Step 9; RichText, react-router `Link` use and the preview added 0.9 KB. Step 12 will drop the preview but add the real Home (avatar, bio, accordion, featured projects), so record the size again there.
- **Steps that gained new "Done when" items:**
  - **10:** tiles, RichText bullets, labels, links row, `headingAs`, accordion mode;
  - **11:** RichText descriptions;
  - **12:** RichText bio, accordion on Home, removal of the preview, cap;
  - **13:** wrapper border;
  - **14:** motion audit for the accordion, chevron and copy icon, plus a `dangerouslySetInnerHTML` grep;
  - **15:** 140 KB hard cap;
  - **16:** new §9 boxes, the footer-wrap issue, the Ideas list review;
  - **19:** new.
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
    - Pages still lack `<meta name="description">`; add them in Steps 10 to 13.
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
  - Delete the `.gitkeep` files as real files land in each folder (`experience/` and `projects/` still have them).

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

- [ ] **Step 10: Experience item + Experience page**
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
