# PROGRESS.md

Session memory for Claude Code. Each session: read this file, do the **first unchecked step only**, verify, tick it, update **Handoff notes**, suggest a commit message, stop. Never commit; the owner commits manually. See `CLAUDE.md`, under "Session workflow".

Each step lists the `IMPLEMENTATION.md` sections to read. Read only those.

---

## Handoff notes

_Overwrite this section at the end of every step._

- **Last completed step:** Step 20, Adaptive Home for zero experience (spec from the owner, now IMPLEMENTATION.md §6.7). All required steps (1–17) plus Step 20 are done. Still optional: 18 (Hallmark audit, only if installed) and 19 (dawn/dusk theme transition, on `feat/theme-transition`, only if asked).
- **Commit state:** Steps 17 and 20, the projects-list change and the `/projects` fix are all committed. Uncommitted: the real-content change, the `TechTag` change and the heading/spacing/copy-email pass, all below.
- **Owner change after Step 20 (no step ticked): heading hierarchy, a single spacing rhythm and inline copy-email.** Uncommitted, on top of the `TechTag` change. It supersedes every spacing value quoted in the older notes below.
  - **Heading hierarchy.** `Section` h2 is now `text-xl sm:text-2xl font-semibold tracking-tight text-fg` (20/24px), between the h1 (30/36) and item titles (16/18). The h1 and item titles are unchanged.
  - **Spacing rule: inside an item < between items < between sections.** All values are in the CLAUDE.md "Spacing rule" and the IMPLEMENTATION.md §5.1 table.
    - `main`: `pt-8 sm:pt-12 pb-16 sm:pb-20`.
    - `Section`: `mt-14 sm:mt-16`; heading → content `mb-5 sm:mb-6`.
    - List items on Home, Experience and Projects: `py-6 first:pt-0 last:pb-0`. The Experience and Projects pages gained `last:pb-0`.
    - Inside an item:
      - title → description `mt-1.5`;
      - tags, bullets and links `mt-3`, and the experience detail blocks `mt-3`;
      - bullets `space-y-1.5`;
      - a small label → its content (`Technologies & Tools`, `What I've done`) `mt-1.5`. **My call:** the spec didn't name this gap, so I matched the Skills label → tags gap.
    - Hero: bio `mt-6`, socials `mt-5`.
    - "View all … →": `mt-5`.
    - Skills: `gap-y-5 sm:gap-y-3`, with the stacked group at `gap-1.5`. **My call:** I kept 20px between groups below `sm`, because the spec only set `gap-y-3` for `sm+`.
    - **Left as is:** `PageHeader` `mb-10 sm:mb-12`. The spec didn't list it, and it's page-level, not a one-off.
    - **Resume:** buttons → preview went from `mt-8` to `mt-5 sm:mt-6`. That was the only one-off value left; it now matches the section heading → content gap.
  - **CopyEmail is inline text.**
    - An unstyled button: `text-muted hover:text-fg transition-colors` + focus ring + `focus-visible:transition-none`.
    - The email plus a `size-3.5` icon, `gap-1.5`.
    - The check stays for 1.5s, with an `aria-live` "Email copied" (unchanged hook).
    - On Home it's the third item of the meta line: role · location · email.
  - **Deviation (clean wrapping):** the spec asked for `flex flex-wrap gap-x-2 gap-y-1`.
    - With `·` as its own flex item, a wrapped line at 320px started or ended with a dangling dot.
    - So each item leads with its own 16px `·` box, which looks the same as `gap-x-2` on both sides of a dot.
    - The line is `-ml-4` and clipped with `[clip-path:inset(-0.5rem_-0.5rem_-0.5rem_0.75rem)]`, which hides the separator of whichever item starts a line. The clip edge is 4px outside the content edge, so the email's focus ring stays fully visible.
    - The rest is as specified: `gap-y-1` and the `min-w-0` + `truncate` email. Documented in §6.1.
  - **Socials stay in the hero and the footer.** The reason is now in IMPLEMENTATION.md §4.7 (the footer is the only social access off Home), with a cross-reference in §6.1.
  - **Files changed:**
    - `Section.tsx`, `CopyEmail.tsx`, `RootLayout.tsx`, `BulletList.tsx`;
    - `ProjectItem.tsx`, `ProjectRow.tsx`, `ExperienceItem.tsx`;
    - `Home.tsx` (the meta line + spacing), `Experience.tsx`, `Projects.tsx`, `Resume.tsx`.
  - **Docs:**
    - CLAUDE.md: the type scale (section heading), and a "Spacing rule" that replaces the old spacing line;
    - IMPLEMENTATION.md:
      - §4.3, which shows the `main` padding in code;
      - §4.7 (socials reasoning), §5.1 (code + hierarchy + spacing table), §5.7 (inline CopyEmail);
      - §6.1 (meta line, hero, Skills; also removed 5 stale leftover Skills lines that contradicted the current layout), §6.2, §6.3, §6.4;
      - §6.5 and §6.7, whose code had the old values;
      - the §7 focus note (CopyEmail is now `text-muted`);
      - §9 (heading hierarchy, spacing rule and meta-line checks).
  - **Verified with headless Chrome against your `pnpm dev` on :5173.** I checked that its modules were current first. Widths 320/768/1440, light and dark.
    - **Pages:** Home, `/projects` and `/resume` with your data. Home and `/experience` again with `HEAD`'s 2 placeholder jobs, loaded temporarily. `experience.ts` was then restored byte-for-byte (same SHA-256 as before).
    - **Measured gaps:**
      - inside an item: 6 / 12px;
      - between items: 24 + 1 + 24px;
      - between sections: 56px, 64px from `sm`; heading → content 20 / 24px;
      - "View all" 20px; hero → bio 24px; bio → socials 20px;
      - Skills: 6/20px stacked, 12px rows from `sm`;
      - `main` padding: 32/64px, and 48/80px from `sm`.
    - **Headings:** h1 30/36, h2 20/24, item titles 16/18.
    - **Meta line:**
      - At 320 it's 3 lines (role / location / email), with no visible separator at any line start. The email is truncated (`rajdeekshith2912@gmail…`), as the spec allows.
      - From 768 it's one line, with both separators visible.
      - Keyboard Tab + Enter copies the real address, swaps to the check and announces "Email copied"; both reset after 1.5s.
      - The focus ring is fully visible.
    - No horizontal overflow and no console output.
  - `pnpm build` + `pnpm lint` are clean. **Initial JS 121.21 KB gzip** (`index` 116.01 + shared 5.20).
- **Owner change after Step 20 (no step ticked): `TechTag` replaces `TechList` everywhere** (Home Skills, project tech, experience tech). Uncommitted, on top of the real-content change below.
  - **Supersedes the `TechList` decision.** The dot-separated list, its `::after` separator and the `@supports` alt-text CSS are all gone. `src/components/ui/TechList.tsx` was never committed, so it simply no longer exists. A `grep` for `TechList`/`TechChip`/the separator classes in `src/` is empty.
  - **Files created:** `src/components/ui/TechTag.tsx`.
    - An `<li>` with `rounded-md border border-border bg-subtle px-2 py-0.5 text-[13px] leading-6 font-medium whitespace-nowrap text-fg/85`.
    - No icon and no hover.
    - Callers render the parent `<ul className="flex flex-wrap gap-1.5">`.
  - **Files changed:**
    - `Home.tsx`, Skills: `grid gap-x-6 gap-y-5 sm:grid-cols-[10rem_1fr]`;
      - each group is `<div className="flex flex-col gap-2 sm:contents">`, with the label `text-sm font-semibold text-fg sm:pt-1` and the tag `ul`;
      - `sm:items-baseline` is gone.
    - `ProjectItem.tsx`: the tags are `mt-3`, directly under the description and before the bullets, rendered only when there is tech; preview rows have none.
    - `ExperienceItem.tsx`: the tags are `mt-2`, under the kept "Technologies & Tools" label.
  - **Label alignment decision:** `sm:pt-1` puts the label's text on the text line of the first tag row. Measured baseline offsets: −0.23px at 4px, +0.78px at 5px, +1.78px at 6px, so `pt-1` is the closest value on the spacing scale; centres differ by 0.5px. No `items-start` is needed: the label (24px with its padding) is always shorter than a tag row (29px), so nothing stretches.
  - **Docs:**
    - IMPLEMENTATION.md: §1, §3.7, the §3.9 note, the Phase 2 line, §5.4 (rewritten for `TechTag`), §6.1, §6.2, §6.4, §6.7 wording, §8, §9, §11, §12;
    - CLAUDE.md: the stack line, the `ui/` list, the type scale (skill label, tech tags), the radius rule (`rounded-md` tags), flex-wrap wording, and the "Add a skill" owner row;
    - README: the quick reference and the Skills note.
  - **Verified in headed Chrome at 320/768/1440 × light/dark,** against your `pnpm dev` on :5173 (Home, /projects) and against a scratch copy with `HEAD`'s 2 placeholder jobs on :5181 (/experience). Your data files were not touched, and the copy's server and junction were removed afterwards.
    - **Tags:** 29px tall, 13px/24px, weight 500, 6px radius, 6px gaps. Every tag is one line, including "Server-Sent Events", "GitHub Actions" and "TanStack Query", and none overflows its row. No `:hover` rule matches.
    - **Borders, measured contrast:** light is 1.15:1 against the fill and 1.22:1 against the page; dark is 1.19:1 and 1.33:1. Screenshots confirm they're visible but subtle in both themes.
    - **Skills:** labels are 14px weight 600 in `fg`. "Databases & Caching" is one line at every width. At 320 each label sits 8px above its tags and groups are 20px apart.
    - **Projects:** the tags sit 12px under the description and 16px above the bullets, left-aligned, on all 3.
    - **Experience:** the tags sit 8px under the label.
    - **Home preview rows:** no tags.
    - No overflow and no console output.
  - `pnpm build` + `pnpm lint` are clean. **Initial JS 121.11 KB gzip** (`index` 115.91 + shared 5.20), 0.07 KB less than with `TechList`.
- **Owner change after Step 20 (no step ticked): real content, `experience = []`, text-only tech chips.** Uncommitted (Step 20 itself is committed).
  - **Data:**
    - `experience.ts` → `[] satisfies Experience[]` (header kept, plus a "No jobs yet?" line), so Home runs in the Step 20 projects-first mode;
    - `projects.ts` → Hookrelay, DeployBench, Storiffy, all `featured`, 4 highlights each (≤ 1 bold per bullet); the header now explains what Home shows in each mode;
    - `skills.ts` → 6 groups (Languages, Backend, AI & LLMs, Databases & Caching, Cloud & DevOps, Frontend), 37 skills.
  - **⚠ Project links are placeholders:** the spec said `<url>` / `<demo url>`, so I used `https://github.com/yourhandle/{hookrelay,deploybench,storiffy}`, `https://www.youtube.com/watch?v=your-demo-id` and `https://storiffy.example.com`, with a `// TODO` above the array. Real URLs must be pasted in before launch.
  - **Text-only chips** (superseded: chips → `TechList` → `TechTag`; the icon removal still stands):
    - `TechChip` has no icon (classes unchanged except `gap-1.5`; `whitespace-nowrap` moved onto the `li`; still 25px tall);
    - `icons.ts` lost `TECH_ICONS`, `getTechIcon`, 23 `Si*` imports and `FaAws`, and `toKey` is now module-private;
    - `SOCIAL_ICONS` and the `ProjectLinks` icons are untouched;
    - no dead code: a `grep` for `TECH_ICONS`/`getTechIcon` in `src/` is empty, and lint is clean.
  - **Bug found and fixed (`Home.tsx`):** "Databases & Caching" wraps to 2 lines in the 8rem label column from `sm`, which made its grid row taller. The stretched `flex-wrap` chip list then stretched its flex line, so those chips rendered **44px tall**. Fix: `items-start` on the Skills grid. All 37 chips are now 25px, and every label's first line is centred within 1.2px of its first chip row.
  - **Docs:**
    - IMPLEMENTATION.md: §1 (bundle row), §3.6 (a shipped-data note), §3.7, §3.9, the Phase 2 acceptance line, §5.4, §6.1 (`items-start`), §8 (registry history + new size), §9 (a Skills check), §11;
    - CLAUDE.md: the stack line, the owner table (Add a skill, social icon row) and DoD #7 ("never trim `SOCIAL_ICONS`");
    - README: the quick reference and the Skills note.
  - **Verified in headed Chrome against your `pnpm dev` on :5173** (its modules checked as current first), at 320/768/1440 × light/dark:
    - **Nav:** Home · Projects · Resume.
    - **Home:** Projects then Skills only. Hookrelay, DeployBench and Storiffy each show 2 bullets (the first ones), with the bold metrics and 0 chips. There's no "View all projects →" (3 of 3 shown). Link icons end at the content edge (300/729/1072).
    - **Redirect:** `/experience` → `/projects` (full reload).
    - **Nav click to Projects:** client-side, 3 items.
    - **`/projects`:** 4/4/4 bullets, 11/11/9 chips; GitHub+YouTube, GitHub+YouTube, GitHub+Live.
    - **Skills:** 37 text chips, 0 SVGs, all 25px. At 320 the labels are one line, stacked; from `sm` only "Databases & Caching" wraps (2 lines, inside 128px).
    - No overflow and no console output.

    Screenshots checked.
  - `pnpm build` + `pnpm lint` are clean. **Initial JS 121.11 KB gzip** (`index` 115.91 + shared 5.20), **down 14.62 KB** from 135.73.
  - `public/logos/company-a.svg` is now unused (there's no experience); delete it or keep it for later.
- **Step 20, files created:** `src/lib/content.ts`. It's the single source of truth:
  - `hasExperience`, `hasProjects`;
  - `showProjectsPage = hasExperience || hasProjects`;
  - `getVisibleNav()`;
  - `getHomeProjects()`.
- **Step 20, files changed:**
  - `Home.tsx`: `firstProjects = hasExperience ? [] : getHomeProjects()`.
    - A new "Projects" section at Reveal step 3 with `<ProjectItem preview />` rows and "View all projects →" when there are more.
    - The "Featured projects" section is gated on `hasExperience`.
    - Reads experience through `allJobs: readonly Experience[]`.
  - `ProjectItem.tsx`: `preview` prop (the first `highlightLimit` highlights, no chips).
  - `Header.tsx`: maps `getVisibleNav()`.
  - `Experience.tsx`: `<Navigate to={showProjectsPage ? "/projects" : "/"} replace />` when `!hasExperience`; reads through `allJobs`.
  - `Projects.tsx`: `<Navigate to="/" replace />` when `!showProjectsPage`; reads through `work`.
  - Docs:
    - IMPLEMENTATION.md: §4.1, §4.5, §6.1, §6.4 (`preview`), the new §6.7, §9 (3 QA cases), §11;
    - CLAUDE.md: the `lib/` list, the derived-values rule, and a "No jobs yet" owner-table row;
    - README: the quick-reference line;
    - this file: Step 20 is rewritten and ticked.
- **Step 20, decisions (all in §6.7):**
  1. **The hard rule beats item 1's literal "minus /projects when !hasProjects".** Hiding `/projects` whenever `projects = []` would change today's behaviour for an owner with jobs but no projects. So `/projects` is hidden and redirected only when **both** lists are empty (`showProjectsPage`).
  2. **The redirects are rendered inside the lazy pages, not in `router.tsx`.** If the router imported `content.ts`, every `src/data/*` edit would become a full reload in dev, because `router.tsx` isn't a React Refresh boundary; that would undo §3.10's hot updates. The URLs behave the same and `router.tsx` is untouched; `/work` chains through.
  3. **`getHomeProjects()`:** the featured projects if any are featured, otherwise the first projects in array order; capped at `projectLimit`. It doesn't pad featured projects with unfeatured ones. The normal Home's "Featured projects" logic is untouched.
  4. **Reveal:** the "Projects" section takes step 3 and Skills keeps step 5, as "stays as is" asked; there's a 60ms gap where step 4 would be.
  5. **Description in preview rows is not clamped** (the spec says "description (RichText)", mirroring the Experience preview); Home's `ProjectRow` still clamps to 2 lines in normal mode.
  6. The idle chunk warm-up still loads the Experience chunk (0.43 KB gzip) in zero-experience mode; not special-cased.
- **Bug found and fixed during verification:** with `experience = [] satisfies Experience[]` the array is typed `never[]`, so `pnpm build` failed in Home/Experience (`item.company` on `never`). The same happened in Projects with `projects = []`. All three pages now read the data through the declared types (`readonly Experience[]` / `readonly Project[]`, the pattern Home already used). **Both empty states now type-check with no other edit.**
- **Verified, in headed (real) Chrome via DevTools at 320 and 1440px, light and dark:**
  - **Normal data (≥ 1 job):** compared against a baseline served from `HEAD` (+ your `skills.ts`).
    - **Byte-identical `<main>` and nav DOM** on `/`, `/experience`, `/projects`, `/resume` at both widths (16/16).
    - Same Home sections, nav and Reveal delays (0–300ms).
    - `/work` → `/experience`. Nav clicks and "View all projects →" work client-side.
    - Re-run against **your `pnpm dev` on :5173**: also 16/16 identical, no console output.
  - **`experience = []`:**
    - the nav is Home · Projects · Resume;
    - Home has Projects (2 featured rows, bullets 2/1 with `highlightLimit` 2, 0 chips, "View all projects →") and then Skills; no Experience or Featured section;
    - `/experience` and `/work` land on `/projects` after a full reload and after in-app navigation (history push + popstate, same document);
    - no console output.
  - **`experience = []` + `projects = []`:** the nav is Home · Resume; Home is hero, bio, socials, Skills; `/experience`, `/work` and `/projects` all land on `/` (full reload and in-app); no console output.
  - No overflow in any state.

  Screenshots checked. (One full-page capture at 320 showed the sticky header over the hero. That was a stitching artifact taken mid-animation; a viewport capture shows `scrollY` 0, header at 0 and h1 at 96, and the layout is correct.)
- **Temporary data states:** `experience.ts`/`projects.ts` were backed up, swapped only while the test server was stopped, then restored: `sha256sum -c` OK, `cmp` identical, and `git status` shows no change to either file. Your :5173 server serves the restored data and the new code: I checked its responses against `?t=` cache-busted ones, and the only differences are the `?t=` strings.
- `pnpm build` + `pnpm lint` are clean in all three states. **Initial JS 135.73 KB gzip** (`index` 130.53 + shared 5.20), up 0.23 KB; Experience chunk 0.43 KB, Projects 0.40 KB.
- **Earlier, committed:**
  - **Step 17:** `vercel.json` + `public/_redirects` (both kept), static `robots.txt`/`sitemap.xml` on `https://yourdomain.com`, `packageManager: pnpm@12.4.2` (pnpm also pinned itself in `pnpm-lock.yaml`), README owner guide. The duplicate `<meta name="description">` is left as is: the static one in `index.html` is a fallback for no-JS crawlers.
  - **Projects list:** cards became `ProjectItem` + `BulletList`; `image`/`year` were removed; projects gained highlights.
  - **The `/projects` blank-page fix:** a stale Vite dev server had cached an empty `Projects.tsx`; no code change.
- **⚠ Still to check on a real iPhone (from Step 16):** no white flash on load in dark mode, the sticky header while the toolbar collapses, and `85dvh` on the Resume preview.
- **Earlier performance numbers (Step 15, for reference):** CLS 0 on every cold load, LCP 1.56–1.96s under mobile throttling. Not a Lighthouse score: run `pnpm build && pnpm preview` → Chrome DevTools → Lighthouse → Mobile for the real one.
- **Session note:** killing `pnpm dev`/`preview` leaves the Vite child listening; free it with `Get-NetTCPConnection -LocalPort <port> -State Listen | % { Stop-Process -Id $_.OwningProcess -Force }`. Ports 5199, 5180 and 4199 are free; your own `pnpm dev` on 5173 was left running.
- **Owner decisions (final; don't reopen):**
  1. **After Step 8:** the three Step 8 deviations are accepted and documented (36px social icon links; `links: readonly Social[]`; `validate.ts` hot-accept). The 320px nav keeps the horizontal-scroll fallback (§4.5 has the real measurements).
  2. **Consolidation pass, bundle:** initial JS **≤ 140 KB gzip, a hard cap** (supersedes Step 8's 130 KB). If it's exceeded later, **code-split; never raise it again, and keep the full `SOCIAL_ICONS` registry.** (`TECH_ICONS` was deleted by the owner in the real-content pass after Step 20: chips are text-only.) Recorded in §8, CLAUDE.md DoD #7 and Step 15.
  3. **Consolidation pass, accordion: superseded after Step 13.** The owner replaced the accordion with the Home preview layout, so the chevron decision no longer applies. Still valid: the Experience page shows the labelled blocks without a `border-t`, and labels are `text-sm font-medium text-muted`.
  4. **Consolidation pass, other fixes:** all the extra fixes are accepted: `baseUrl`, `@source not`, `HydrateFallback`, the skip-link ring, the 300ms state-toggle rule, and safe link schemes in RichText.
  5. **Step 9 deviations accepted and now in the spec:**
     - ~~TechChip's direct registry read~~ (superseded: chips are text-only, no registry);
     - the ExternalLink focus ring;
     - CopyEmail details;
     - `copy()` returning `Promise<boolean>`.
  6. **Step 16:** footer socials `gap-0` below `sm`; ~~the Projects grid keeps equal card heights in a row~~ (superseded after Step 17: the Projects page is now a list); focus rings appear instantly (`focus-visible:transition-none` on `text-muted` controls with `transition-colors`).
- **Decisions / deviations from spec** (everything below is now reflected in IMPLEMENTATION.md):
  - **From Step 20:** `/projects` is hidden only when both lists are empty (hard rule); the redirects are rendered in the lazy pages, not in `router.tsx` (keeps data edits hot); `getHomeProjects()` doesn't pad featured projects; the pages read data through the declared types so `[]` type-checks (all in §6.7).
  - **From Step 10:**
    - the duration span renders only when it is non-empty, so there is no stray "·";
    - the role/type line is guarded;
    - the company `<a>`/`<span>` gets `min-w-0`, and the `<a>` gets a hover underline.

    `totalExperience` was added to `lib/dates.ts` for the page subtitle.
  - **From Step 11** (the card, image and year parts are superseded after Step 17 by the Projects list, §6.4):
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
  - From Step 9: see Owner decisions #5. ~~`getTechIcon` is still exported~~ (deleted with `TECH_ICONS` after Step 20).
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
  - **the real project URLs** in `src/data/projects.ts` (GitHub repos, YouTube demos, the Storiffy live site); they are placeholders now (see the TODO);
  - real content in `src/data/*`;
  - the resume's Google Drive share link in `site.resume.driveUrl` (Share → "Anyone with the link" → Viewer);
  - a real `public/avatar.webp` to replace the placeholder (square, ≥ 160×160, ≤ 30 KB). If you set `avatar: null`, delete the preload line in `index.html`;
  - `public/og.png` (1200×630);
  - **your initial in `public/favicon.svg`** (the `<text>` currently says "Y");
  - real project `highlights` (2–4 bullets each; projects have no images);
  - **real company logos in `public/logos/`** (square `.svg`/`.webp`). Replace `company-a.svg`, or drop `logo` to get a letter tile.

  - **your domain** in `site.url`, `public/robots.txt` and `public/sitemap.xml` (all say `https://yourdomain.com`).

  Placeholders are fine until then. The `<title>`, description and OG text in `index.html` are static placeholders, so edit them by hand to match `site.ts`. The README has the full checklist ("Files to replace before launch").
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
  _Superseded after Step 17: the Projects page is now a list like the Experience page (`ProjectItem`, §6.4); no cards, images or year._

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

- [x] **Step 17: Deploy prep + README**
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

- [x] **Step 20 (optional): Adaptive Home for zero experience**
  Read: §6.7 (spec, from the owner), §4.1, §4.5, §6.1, §6.4
  **Hard rule:** only when `experience.length === 0`. With ≥ 1 job, Home, the nav, the routes and every page behave exactly as now.
  - `src/lib/content.ts`: `hasExperience`, `hasProjects`, `showProjectsPage`, `getVisibleNav()`, `getHomeProjects()`. This is the single source of truth.
  - Home, `!hasExperience`:
    - no Experience section;
    - a "Projects" section right after the socials, with `ProjectItem preview` rows (title + icons, description, the first `highlightLimit` highlights, no chips) in the Experience-preview rhythm;
    - "View all projects →" when there are more;
    - no "Featured projects" section;
    - Skills unchanged.
  - Both lists empty → hero + bio + socials + skills only.
  - Header uses `getVisibleNav()`.
  - `/experience` → `/projects` (or `/`) and `/projects` → `/` when hidden, rendered as `<Navigate replace>` inside the lazy pages; `/work` chains through them.
  - The static sitemap stays.
  - Docs: §4.1, §4.5, §6.1, §6.7, §9, and the CLAUDE.md owner table.
  **Done when:** in a real browser at 320 and 1440px, light and dark, with three temporary data states (normal, `experience = []`, `experience = []` + `projects = []`, restored byte-for-byte afterwards):
  - the nav links are right;
  - the redirects work after a full reload and after in-app navigation;
  - there are no empty sections and no console errors;
  - normal data is unchanged.

  `pnpm build` + `pnpm lint` pass; initial JS is recorded (≤ 140 KB).

---

## Ideas / later

Visual tweaks to review with the owner at Step 16. Add a line here instead of doing it straight away.

_Nothing open._
