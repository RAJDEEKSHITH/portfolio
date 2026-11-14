# CLAUDE.md

Guidance for Claude Code in this repository. Read this fully before making changes. The full build spec is `IMPLEMENTATION.md` — follow it phase by phase.

## Project

A personal developer portfolio. Minimal, typographic, fast, fully responsive, light + dark mode.

Pages: **Home**, **Experience**, **Projects**, **Resume**, plus a 404 page.
All content (experience, projects, skills, socials, site info) is **data-driven** from typed arrays/objects in `src/data/`. The owner edits content only there — never inside components.

## Session workflow (IMPORTANT — read first)

The owner clears context between steps. `PROGRESS.md` is the memory between sessions.

When the owner says **"continue"** (or "next", "go"):
1. Read `PROGRESS.md` (the handoff notes and the first unchecked step). Then read **only** the `IMPLEMENTATION.md` sections that step lists. Don't reread the whole spec.
2. Do **exactly one step**. Don't start the next one, even if it looks small.
3. Verify: `pnpm build` + `pnpm lint` pass, plus the step's "Done when" checks.
4. Update `PROGRESS.md`: tick the step `[x]`, then rewrite **Handoff notes** (what was done, files created or changed, decisions or deviations, anything the owner must provide, known issues).
5. Never run git add, git commit, git push, git reset or any other git command that changes the repo. The owner commits manually. Read-only git (git status, git diff) is fine.
6. Stop and reply with a short summary: what's done, how to see it (`pnpm dev` → which URL), the next step's title, and a suggested commit message (e.g. `step 7: header + theme toggle`) for the owner to use.

Other commands the owner may use:
- **"step N"**: do that specific step (check that the steps it depends on are ticked first).
- **"redo step N"**: rework that step, keeping later steps working.
- **"fix: …"**: fix the described issue only. Note it in Handoff notes; don't tick any step.
- **"status"**: summarize `PROGRESS.md` without changing code.

If a step can't be finished, leave it unticked, write exactly where it stopped in Handoff notes, and tell the owner.

## Stack (fixed — do not change without asking)

- **pnpm** — the only package manager. Never run `npm` or `yarn`, never create `package-lock.json` / `yarn.lock`.
- **React 19** + **TypeScript** (strict) on **Vite**.
- **Tailwind CSS v4** (≥ 4.3), CSS-first config via `@import "tailwindcss"`, `@theme`, `@custom-variant` in `src/index.css`. There is **no `tailwind.config.js`** — do not create one.
- **react-router-dom** (v7) data router: `createBrowserRouter` + `RouterProvider`.
- **react-icons** for social + tech icons (named imports only).
- **@fontsource-variable/** packages for self-hosted fonts.

### Explicitly NOT used

- **No Zustand / Redux / any state library.** The only global state is theme → React Context.
- **No Framer Motion / GSAP / any animation library.** Motion = Tailwind utilities + CSS keyframes.
- **No UI kits** (shadcn, MUI, Chakra…), no CSS-in-JS, no `clsx` / `tailwind-merge`.
- **No pets, mascots, cursor followers, custom cursors, particles, sounds, WebGL.**
- **No blog, Ctrl+K search, or analytics** unless the owner asks.
- Do not add any dependency not listed in `IMPLEMENTATION.md` without asking first.

## Plugins, skills & MCP servers

- Never install, enable or invoke plugins, skills or MCP servers unless the owner explicitly asks in that session.
- IMPLEMENTATION.md and the tokens in src/index.css are the only design authority. Design skills may only be used in audit mode, never to change the palette, type scale, spacing, layout or structure.

## Commands

```bash
pnpm install
pnpm dev            # dev server
pnpm build          # tsc -b && vite build — must pass with zero errors/warnings
pnpm preview        # preview production build
pnpm lint           # ESLint
pnpm add <pkg>      # runtime dep
pnpm add -D <pkg>   # dev dep
```

## Architecture

```
src/
  data/          # ← ALL editable content: site, navigation, socials, experience, projects, skills
  types/         # content.ts — shared content types
  lib/           # pure helpers: dates.ts, icons.ts, cn.ts, theme.ts, validate.ts
  hooks/         # useCopyToClipboard.ts
  context/       # ThemeContext.tsx
  components/
    layout/      # RootLayout, Header, Footer, Container
    ui/          # ThemeToggle, SocialLinks, TechChip, Section, StatusBadge, ExternalLink, CopyEmail, Reveal, PageHeader
    experience/  # ExperienceItem
    projects/    # ProjectCard
  pages/         # Home, Experience, Projects, Resume, NotFound
  router.tsx
  main.tsx
  index.css      # Tailwind import, tokens, keyframes
public/          # resume.pdf, avatar.webp, favicon.svg, og.png, robots.txt
```

- Import alias: `@/` → `src/` (e.g. `import { site } from "@/data/site"`).
- Components never hard-code personal content (names, links, dates, bullets). Read from `src/data/`.
- Derived values (sorting, "Present", durations, "Working" badge) are computed in `src/lib/`, never stored in data.
- One component per file. Pages use `export default` (needed for lazy routes); everything else uses named exports.

## TypeScript rules

- `strict` stays on. No `any`, no `@ts-ignore`, no non-null `!` unless provably safe (only allowed for `document.getElementById("root")!`).
- Use `import type { … }` for type-only imports (the template enables `verbatimModuleSyntax`).
- No `enum`s, namespaces, or constructor parameter properties (template enables `erasableSyntaxOnly`). Use union string literals and `as const`.
- Data files are typed with `satisfies` (e.g. `export const projects = [...] satisfies Project[]`) so the owner gets autocomplete + errors without losing literal types.
- Component props: a `type XProps = { … }` right above the component. Extend native props with `ComponentProps<"a">` etc. when passing through.
- Icons are typed with `IconType` from `react-icons`.

## React 19 rules

- Render `<title>` and `<meta name="description">` directly inside page components (React 19 hoists them to `<head>`). No react-helmet, no `document.title` effects.
- `ref` is a normal prop — do not use `forwardRef`.
- Provide context with `<ThemeContext value={…}>` (not `.Provider`), read with `use(ThemeContext)`.
- Keep `StrictMode`. No `useEffect` for derived data — compute during render or with `useMemo` only if measurably expensive.

## Design system rules (strict)

- **Colors: semantic tokens only** — `bg-bg`, `text-fg`, `text-muted`, `bg-subtle`, `border-border`, `text-accent` (and opacity modifiers like `bg-bg/80`). Never use raw palette classes (`text-zinc-500`, `bg-white`, `bg-[#fff]`) in components. This is what keeps light/dark consistent.
- Dark mode is class-based (`.dark` on `<html>`) via `@custom-variant dark`, set before first paint by the inline script in `index.html`.
- **Container:** all page content sits inside `<Container>` = `mx-auto w-full max-w-3xl px-5 sm:px-6`. No other content max-widths.
- **Type scale (do not invent sizes):**
  - Page title: `text-3xl sm:text-4xl font-semibold tracking-tight`
  - Section heading: `text-lg font-semibold tracking-tight`
  - Item title: `text-base sm:text-lg font-medium`
  - Body: `text-[15px] leading-relaxed text-muted`
  - Meta (dates, locations): `text-sm text-muted tabular-nums`
  - Chips/badges: `text-xs font-medium`
- **Spacing:** sections `mt-16 sm:mt-20`; list items `space-y-8` or `divide-y` + `py-8`. Tailwind scale only.
- **Radius:** `rounded-lg` cards/buttons, `rounded-full` chips/badges/icon buttons.
- Icon buttons/links: hit area ≥ `size-9` (36px), always with `aria-label`.

## Responsiveness rules (strict)

- Mobile-first. Base classes target 320px; enhance with `sm:` / `md:`.
- Must render correctly at **320, 375, 414, 768, 1024, 1440, 1920px**. Never any horizontal scroll.
- No fixed pixel widths on content. Flex children holding text get `min-w-0`; long strings get `break-words` or `truncate`.
- Title/date rows: `flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between`.
- Images always have `width`/`height` (or an `aspect-*` wrapper); below-the-fold images get `loading="lazy" decoding="async"`.
- Use `min-h-dvh`, not `min-h-screen`. Lists of chips/icons/buttons always `flex-wrap`.

## Animation rules (strict)

- Animate only `opacity` and `transform`. Never width/height/top/left/box-shadow/filter on large areas.
- Durations: 150–200ms hover/press, 400–600ms enter. Easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Enter animations: `animate-fade-up` via `<Reveal step={n}>`, stagger ≤ 6 steps × 60ms. On mount only — no scroll-triggered reveals.
- Every animation disabled under `prefers-reduced-motion` (`motion-reduce:animate-none`, global CSS guard).
- Never `transition-all`. Use `transition-colors`, `transition-opacity`, `transition-transform`, or explicit `transition-[opacity,transform]`.
- Theme switching adds `.no-transitions` for one frame so the page doesn't fade/lag.

## Accessibility

- Landmarks: `<header>`, `<nav aria-label="Primary">`, `<main id="main">`, `<footer>`. Skip link to `#main`.
- Focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg` on every interactive element.
- Icon-only controls need `aria-label`; decorative icons get `aria-hidden`.
- External links: `target="_blank" rel="noopener noreferrer"` (not for `mailto:`).
- One `<h1>` per page; contrast ≥ 4.5:1 in both themes.

## How the owner edits content (keep this working)

| Task | File | How |
|---|---|---|
| Add a job | `src/data/experience.ts` | Append an object. `end: null` = current job → "Working" badge + "Present". Order doesn't matter (auto-sorted). |
| Add a project | `src/data/projects.ts` | Append an object. `featured: true` shows it on Home. |
| Add/remove a social | `src/data/socials.ts` | Add/remove `{ platform, url }`. Icon picked from `platform` (autocompletes). Unknown platform → generic link icon. |
| Add a skill | `src/data/skills.ts` | Add a string like `"Next.js"` to a group. Known names get an icon; unknown → text-only chip. |
| Name/bio/email/resume | `src/data/site.ts` | Edit fields. |
| Nav items | `src/data/navigation.ts` | Edit array. |
| Support a new icon | `src/lib/icons.ts` | Add one entry to `SOCIAL_ICONS` or `TECH_ICONS`. |

If you change a data shape, update `src/types/content.ts`, the comment header in the data file, and `IMPLEMENTATION.md` §3.

## Definition of done (every task)

1. `pnpm build` and `pnpm lint` pass with no errors or warnings.
2. No console errors/warnings in dev (including key warnings and the content validator).
3. Checked at 320px and 1440px in light and dark; no horizontal overflow.
4. Keyboard-navigable with visible focus.
5. No new dependencies without approval; no raw color classes in components.
6. Content changes still only require editing `src/data/`.

## Style

- Prettier defaults, 2-space indent, double quotes.
- Small functions, early returns. Comment data-file schemas; don't comment obvious code.
- Use the `cn()` helper for conditional classes; keep class strings non-conflicting.