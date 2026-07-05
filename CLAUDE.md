# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**devvachhani.com** is Dev Vachhani's personal portfolio — a STEM student presenting projects and (eventually) writing to university and research programmes. The site's job is to make curiosity legible: catalogue the work like a scholarly index, then bring it to life with motion.

The app was migrated from a Claude Design (claude.ai/design) prototype export into a real Vite + React + TypeScript codebase. The original export is preserved, untouched, in `design-export/`.

## Tech Stack Overview

- **Framework:** Vite + React 19 + TypeScript
- **Routing:** React Router (real routes: `/`, `/about`, `/work`, `/work/:slug`, `/writing`, `/writing/:slug`)
- **Styling:** plain CSS with custom-property design tokens (no CSS framework) — see Design System below
- **Motion:** GSAP + ScrollTrigger via `@gsap/react`'s `useGSAP()`. `src/motion/core.ts` is the single plugin-registration point (also registers `SplitText`, `ScrambleText`, `Flip`, and re-exports `SplitText`/`Flip` so plugin access always routes through core), exports token-mirrored `DUR`/`EASE` constants (backed by `CustomEase` curves from the CSS tokens) plus `DECODE_CHARS`, and owns the one `prefersReducedMotion()` check — never call `gsap.registerPlugin` or `matchMedia('prefers-reduced-motion')` elsewhere. Entrance hooks: `useReveal` (per-item, for lists), `useStagger` (group, for grids), `useParallax` (scrub drift), `usePinned` (pin-and-hold, desktop-only). Reactive-text signature hooks: `useSplitReveal` (masked line/word/char set via SplitText — split the wrapping line spans, not the parent heading, so `revert()` doesn't orphan elements other tweens target), `useDecode` (mono scramble-settle via ScrambleText), `useInkResolve` (scrubbed color-only resolve, never on body copy), `useMagnetic` (fine-pointer cursor lean, gated via `gsap.matchMedia`). Draw all timing from `DUR`/`EASE`; if a new value is needed, add it to `src/styles/tokens/effects.css` first.
- **Content:** static TypeScript data (`src/data/content.ts`) — no CMS/backend yet

## Design System

- **`design-export/` is frozen, read-only reference.** It's the original Claude Design handoff bundle (`Home.dc.html`, `support.js`, `designSystem/`). Never edit it, never import from it at runtime — it exists so a human or agent can look up "what did the original design intend" without re-deriving it from screenshots.
- **`src/styles/tokens/` is the live copy** consumers actually use — copied from `design-export/designSystem/tokens/`. If a design token value needs to change, edit it here, not in `design-export/`.
- **Component conventions:** components use inline `style` objects referencing `var(--token-name)`, matching the original design system's own components (see `design-export/designSystem/_ds_bundle.js` for the original compiled source if you need to check intent). Don't introduce Tailwind, styled-components, or CSS Modules — stay consistent with the existing pattern.
- **Adding a project or article:** edit `src/data/content.ts`. Don't hardcode content inside page components.
- **No logo/brand mark exists** — the wordmark is plain serif type + a small cobalt `<span>` tick (see `SiteNav`). Don't invent an icon/logo without asking.

## Key Commands

```bash
# Start the dev server (hot reload)
npm run dev

# Type check
npx tsc -b --noEmit

# Production build (runs the type check first)
npm run build

# Preview a production build locally
npm run preview

# Lint
npm run lint
```

## Repository Etiquette

**Branching**

- Always create a feature branch before starting non-trivial changes
- Never commit directly to `main`
- Branch naming: `feature/description` or `fix/description`

**Session start check**

Before writing any code, verify the current branch state:

```bash
git branch --show-current   # confirm you are NOT on main
git status                  # confirm working tree is clean
git log --oneline -3        # confirm last commit is expected
```

If the current branch is `main`, or was already merged, stop and create a new feature branch before proceeding.

**Commits**

- Write clear commit messages describing the *why*, not just the *what*
- Keep commits focused on a single change
- Use titles chore, feat, docs when commiting (e.g. Message 'feat(mvp): implement Units 4-8')


**Pull requests**

- Create PRs for all changes to `main`
- Never force-push to `main`
- On PowerShell, `gh pr create --body "..."` with embedded double quotes gets mangled by PS 5.1's argument parsing — use `gh pr create --body-file <path>` instead
- Include a description of what changed and why
- Merge (or confirm merged) each feature branch into `main` before branching the next phase off of it. Stacking a new branch on top of an unmerged one produces a criss-cross merge chain that's hard to verify afterward. If a next phase must start before the prior PR lands, rebase it onto `main` once that PR merges rather than merging it as a side-chain.

## Coding Style & Standards

- **TypeScript everywhere** — no `any` without an explanatory comment
- **One page per route** in `src/pages/`; shared UI lives in `src/components/{ui,cards,layout,motion}/`
- **Comments explain why, not what** — code should be self-explanatory; comments are for intent
- **No premature abstraction** — build a screen only when there's a real consumer for it. E.g. the `Article`/reading-progress page (`/writing/:slug`) is now built, but its one article is placeholder lorem (see `docs/project_status.md`) pending real essays; project detail pages (`/work/:slug`) exist only for the F-35 until a reusable template is derived from it. Don't build the remaining project pages speculatively — wire them once the template is ready.

## Documentation

- [Architecture](docs/architecture.md) — system design and data flow
- [Changelog](docs/changelog.md) — version history
- [Project Status](docs/project_status.md) — current progress, what's implemented vs. not
