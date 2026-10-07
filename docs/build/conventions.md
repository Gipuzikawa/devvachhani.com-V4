# Conventions

Read before editing source.

## File layout

- `src/pages/` — one component per route.
- `src/components/{ui,cards,layout,motion}/` — shared UI, grouped by role (primitives, cards, page
  shell, motion wrappers).
- `src/hooks/` — reusable GSAP motion hooks (`useReveal`, `useStagger`, `useParallax`, `usePinned`,
  and the reactive-text hooks — see `docs/architecture.md` for the full list).
- `src/motion/core.ts` — the single GSAP plugin-registration point, timing tokens, and the one
  `prefersReducedMotion()` check. Nothing outside this file calls `gsap.registerPlugin` or
  `matchMedia('prefers-reduced-motion')`.
- `src/styles/tokens/` — the live design-token CSS, copied from `design-export/designSystem/tokens/`.
  Edit here, never in `design-export/`.
- `src/data/content.ts` — all real content (projects, articles, About copy, nav/footer). No CMS.
- `design-export/` — frozen, read-only reference to the original Claude Design handoff. Never
  edited, never imported at runtime.

## Naming

- Components: PascalCase filenames matching the exported component (`ProjectCard.tsx`).
- Hooks: camelCase, `use`-prefixed (`useReveal.ts`).
- Routes/pages: PascalCase matching the page name (`Work.tsx`, `Writing.tsx`).

## Module boundaries

- Pages compose components; components don't import pages.
- Only `src/motion/core.ts` registers GSAP plugins or checks reduced-motion — hooks and components
  consume its exports (`DUR`, `EASE`, `prefersReducedMotion()`), never `matchMedia` directly.
- `design-export/` is import-free from the rest of `src/` — it exists for reference lookup by a
  human or agent, not as a runtime dependency.

## Formatting and lint

- `npm run lint` runs oxlint. Not currently wired to enforce the design-token adherence spec at
  `design-export/designSystem/_adherence.oxlintrc.json` — that file documents intent, treat it as a
  style guide rather than a build gate.
- No Prettier or other formatter configured; match surrounding code style.
