# PROGRESS.md

Session memory for Claude Code. Each session: read this file, do the **first unchecked step only**, verify, tick it, update **Handoff notes**, suggest a commit message, stop. Never commit; the owner commits manually. See `CLAUDE.md`, under "Session workflow".

Each step lists the `IMPLEMENTATION.md` sections to read. Read only those.

---

## Handoff notes

_Overwrite this section at the end of every step._

- **Last completed step:** Step 9 — Shared UI primitives
- **What was done:**
  - New in `src/components/ui/`:
    - `Section.tsx` (§5.1): copied from the spec as written.
    - `PageHeader.tsx` (§5.2): takes `title`, plus optional `subtitle` and `className`. Renders a `<header>` with `mb-10 sm:mb-12`, then the `<h1>` at page-title scale (plus `break-words`, so long titles wrap at 320px), then an optional subtitle `<p>` at body scale with `mt-3`.
    - `Reveal.tsx` (§5.3): copied from the spec as written.
    - `TechChip.tsx` (§5.4), with one change (see Decisions).
    - `StatusBadge.tsx` (§5.5): copied from the spec as written.
    - `ExternalLink.tsx` (§5.6): extends `ComponentProps<"a">` and adds `target`/`rel` only when `href` starts with `http`. Caller props are spread after those defaults, so a caller can override them. The `LuArrowUpRight` (`size-3.5`) nudges up and right on hover (`transition-transform duration-200`). It has the standard focus ring.
    - `CopyEmail.tsx` (§5.7): a `rounded-lg` bordered button showing `site.email` (`truncate`, inside `min-w-0` parents), and a copy icon that crossfades to a check (`text-accent`) using the same `[grid-area:1/1]` technique as ThemeToggle, opacity/scale only, 200ms. A visually hidden `aria-live="polite"` span says "Email copied". The button has `aria-label="Copy email address {email}"`, which contains the visible text (WCAG 2.5.3), and `title="Copy email"`. If `copy()` returns false, it falls back to `window.location.href = "mailto:…"`.
  - New `src/hooks/useCopyToClipboard.ts`: returns `{ copied, copy }`. `copy(text)` resolves `true` or `false`: `false` when `navigator.clipboard?.writeText` is missing or rejects. `copied` resets after 1500ms. The timer is cleared on re-copy and on unmount.
  - **The stub pages now use `PageHeader`** (Experience, Projects, Resume and NotFound), replacing their bare `<h1>`. Those uses are permanent.
  - **`Home.tsx` holds a TEMPORARY Step 9 preview:** Reveal steps 0 to 3, StatusBadge, ExternalLink (http and relative), CopyEmail, and a Section with a "View all" action and every skill as a TechChip. **Step 12 replaces all of it.**
  - Deleted `src/components/ui/.gitkeep` and `src/hooks/.gitkeep`.
- **Files created/changed:**
  - New: the 7 UI files above and `src/hooks/useCopyToClipboard.ts`.
  - Changed: `src/pages/{Home,Experience,Projects,Resume,NotFound}.tsx`.
- **Verified:**
  - `pnpm build` and `pnpm lint` are clean.
  - **Headless Chrome, 19 checks, all pass in production and dev (StrictMode):**
    - **Every width (320, 375, 414, 768, 1024, 1440 and 1920px):** no horizontal overflow, and every chip and the email button stay inside the viewport. 18 chips render; "Zustand" is text-only, as expected, and the rest have icons.
    - **Long emails:** at 320px a 66-character email truncates with an ellipsis.
    - **ExternalLink:** `target`/`rel` are set for http and absent for `/projects`. The arrow is `aria-hidden`.
    - **CopyEmail:**
      - the clipboard gets `you@example.com`;
      - the copy icon goes to opacity 0 and the check to 1;
      - the live region reads "Email copied";
      - after 1.5s everything resets, and the live region is empty again.
    - **CopyEmail fallbacks:** with `writeText` rejecting, and with no `navigator.clipboard` at all, a navigation to `mailto:you@example.com` is requested and nothing claims "copied". In headless Chrome the second `mailto:` launch logs "user gesture is required"; that's Chrome throttling external-protocol launches, not the code. The navigation was requested both times.
    - **Focus:** Tab reaches Website, the email button and "View all", and each shows the 2px ring with a 2px offset.
    - **Reduced motion:** the ping is `display: none` while the static dot still shows, and Reveal's animation is `none`.
    - **Normal motion:** the ping animates, and the Reveal delays are 0, 60, 120 and 180ms.
    - **PageHeader:** each of `/experience`, `/projects`, `/resume` and `/nope` has exactly one `h1` at page-title scale, a bottom margin of 48px at 1440px, and the right tab title.
  - **Screenshots:** 320 and 1440px in light and dark look right.
  - **Console:**
    - production: nothing from the app;
    - dev: only the expected `[content]` Drive-link warning, with no key warnings and no React errors.
- **⚠ Bundle is over budget: 131.3 KB gzip initial JS (392 KB raw), against the ≤ 130 KB budget.**
  - Measured: without the TechChip preview it's 115.6 KB, so `TECH_ICONS` costs 15.7 KB gzip once any eager page renders a TechChip. The rest of Step 9 added about 1.4 KB.
  - **This is real, not caused by the preview:** the Step 12 Home page renders skills as TechChips, so it will land at about 131 KB too.
  - **Owner decision needed before Step 12 or 15.** Options:
    - (a) raise the budget to about 140 KB;
    - (b) lazy-load the skills icons in their own chunk. They'd pop in after first paint unless the space is reserved; chips keep their size if the icon slot is reserved;
    - (c) make Home a lazy route as well. That splits the code but doesn't reduce what the landing page downloads.
  - The owner has said the registries must not be trimmed, so I haven't touched them. I'd suggest (a).
- **Owner decisions, recorded after Step 8. These are final; don't reopen them:**
  1. **All three Step 8 deviations are accepted, and the docs now match the code:**
     - 36px footer icon links: §4.8 updated, with both sizes on `size-9`;
     - the TS2339 fix: §4.8's code now uses `links: readonly Social[]`;
     - the dev hot-update change in `validate.ts`: documented in §3.10.
  2. **Bundle budget raised to ≤ 130 KB gzip for the initial JS** (option a), in §8 and the Step 15 "Done when". **Keep the full `SOCIAL_ICONS` and `TECH_ICONS` registries**, so the owner can add socials and skills freely. Step 15 must not trim them. The current size of 114.2 KB is within budget.
  3. **The 320px nav keeps the horizontal-scroll fallback.** The owner left this one to me. Tighter gaps would fit with only about 1px to spare and break on any label or font change, while the fallback is what §4.5 prescribes, scales to any number of nav items, and has been tested with the keyboard. §4.5 now documents the real numbers (about 307px needed against 280px available at 320px) and the fallback's exact classes and `onFocus`, replacing the old "4 labels + toggle fit" claim.
- **Decisions / deviations from spec** (Step 8 and earlier are reflected in IMPLEMENTATION.md; Step 9's aren't yet):
  - From Step 9:
    - **TechChip reads `TECH_ICONS[toKey(name)]` directly instead of calling `getTechIcon(name)`.** The spec code fails `pnpm lint` with `react-hooks/static-components` ("component is created during render"), because the rule can't see that a function's return value is a stable, module-level component, while a property read passes. That's the same pattern SocialLinks already uses with `meta.icon`. The behaviour is the same. `getTechIcon` is still exported; nothing uses it now.
    - **ExternalLink has the standard focus ring,** which §5.6 didn't list. CopyEmail's icon crossfade, `aria-label` and `title` are my own choices, since §5.7 doesn't specify them.
    - **`useCopyToClipboard().copy` returns `Promise<boolean>`,** so CopyEmail can run the `mailto:` fallback.
    - If you accept these, §5.4 to §5.7 can be updated to match. I haven't edited IMPLEMENTATION.md.
  - **The `sm` icon links are `size-9` (36px), not `size-8`.** This meets CLAUDE.md's ≥ `size-9` rule and §9's ≥ 36px tap targets. `sm` and `md` differ only in icon size (`size-4` vs `size-4.5`).
  - **SocialLinks reads `socials` through its declared type** (`const links: readonly Social[] = socials`). The original §4.8 code failed with `TS2339: Property 'label' does not exist` (checked).
  - The `{...(!isMail && {...})}` spread became an `external` object, with the same behaviour.
  - **`validate.ts` accepts its own hot updates** (`import.meta.hot.accept((next) => next?.validateContent())`), so `src/data/*` edits are hot updates instead of full reloads, and the checks re-run. It's dev-only, and Vite strips it from builds.
  - From Step 7:
    - **The nav doesn't fit at 320px, so the spec's own fallback is in use.** §4.5 says 4 labels plus the toggle fit at 320px, but measured they need about 307px of the 280px available (links 207px, gaps 3×16px, header gap 16px, toggle 36px). At 375px they fit with 44px to spare. As §4.5 prescribes for overflow, the `ul` is `overflow-x-auto` with a hidden scrollbar (`[scrollbar-width:none]` plus `[&::-webkit-scrollbar]:hidden`), never a hamburger. **At 320px "Resume" shows cut off as "Resu" until you swipe or Tab to it.** Three small additions make that fallback work:
      - `p-1 -mx-1 scroll-px-1` on the `ul`, so a scroll container doesn't clip the 4px focus ring;
      - `shrink-0` on the toggle, which was being squeezed to 33px;
      - an `onFocus` on each link calling `scrollIntoView({ block: "nearest", inline: "nearest" })`. Chrome won't scroll a partly visible focused element into view on its own; this was measured, and without it "Resume" stayed clipped.
      - **Decided:** keep this fallback (see Owner decisions #3). Tighter gaps were rejected as too fragile.
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
  - **Bundle: 131.3 KB gzip, over the 130 KB budget.** See the ⚠ entry above. It was 114.2 after Step 8 and 115.6 with Step 9 minus the TechChip preview; `TECH_ICONS` adds 15.7 KB. Owner decision needed.
  - At 320px, after you navigate to `/resume`, the active "Resume" link stays partly scrolled out of view, since nothing scrolls the nav on route change, only on focus. **Fix scheduled in Step 16** (scroll the active link into view on route change).
  - **The `[content]` warning prints once per full page load, and again after each hot data edit** (the validator re-runs on new content). Client-side navigation doesn't re-run it.
  - **New, found in Step 9 and present since Step 8: at 320px in desktop Chrome the footer's socials wrap to 2 rows** (6 icons, then the email icon on its own). The classic 15px scrollbar gutter (`scrollbar-gutter: stable`) leaves 265px of content width for 276px of icons (7 × 36px plus 6 × 4px gaps). Phones use overlay scrollbars, so with mobile emulation it's one row (276px fits exactly). Step 8's "one row at every width" was probably measured without the gutter. It's harmless, because the row is `flex-wrap`, but it doesn't look great. **Look at it in Step 16.** For example, `gap-0` below `sm` gives 252px and fits, or accept the wrap. Not changed.
  - At 1440px the footer's full-width top border stops about 15px short of the right edge, at the space `scrollbar-gutter: stable` (§2.4) reserves for the scrollbar. **Fix scheduled in Step 16:** the border moves onto an inner element inside the footer's Container, so it matches the text width and never reaches the gutter.
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

- [x] **Step 9: Shared UI primitives**
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
  **Done when:** `pnpm build` output shows initial JS ≤ 130 KB gzip (raised from ~110 by the owner in Step 8; keep the full icon registries); no layout shift on load, theme switch or navigation; images have dimensions; record the bundle sizes in Handoff notes.

- [ ] **Step 16: Responsive + accessibility QA**
  Read: §9
  Go through the whole checklist at every listed width in both themes; fix every issue found.
  Also do these (owner requests, added after Step 8):
  - **Nav: scroll the active link into view on route change.** In `Header`, on every `pathname` change, call `scrollIntoView({ inline: "nearest", block: "nearest" })` on the active `NavLink` (`aria-current="page"`). Respect reduced motion: use the default instant behaviour, or `behavior: "smooth"` only when `prefers-reduced-motion` is not `reduce`. It must never scroll the page vertically. The header is sticky at the top, so `block: "nearest"` is a no-op there; verify it. This fixes "Resume" staying clipped at 320px after navigating to `/resume`.
  - **Footer: move `border-t border-border` off `<footer>` and onto an inner element inside the `<Container>`** (decided by the owner), so the hairline matches the text width exactly at every screen size and never reaches the scrollbar gutter. Don't put it on the Container itself, because that would include its `px-5 sm:px-6` padding. For example, wrap the row in a `<div className="flex … border-t border-border py-8">` inside `<Container>`, keeping the existing flex classes. Check 320, 768 and 1440px in both themes: the line's ends must align with the © text and the last social icon's box.
  **Done when:** every §9 box is satisfied; the two owner requests above are done and checked; list anything still imperfect in Handoff notes.

- [ ] **Step 17: Deploy prep + README**
  Read: §10, §11
  `vercel.json` and/or `public/_redirects`, `robots.txt`, `sitemap.xml`, `packageManager` field, README with the owner quick reference.
  **Done when:** `pnpm build && pnpm preview` works; deep-linking `/projects` on preview works; README explains how to edit content.

### Optional

- [ ] **Step 18: Design audit (only if the owner installed Hallmark)**
  Run `hallmark audit` on Home, Experience, Projects and Resume. **Report only; don't edit.** Write the punch list into Handoff notes so the owner can pick fixes, which are then done with `fix: …`.