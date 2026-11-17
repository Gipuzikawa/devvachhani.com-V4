# Status

Current update (2026-11-17): Sanity Phase 0 is implemented and locally verified,
including a real development draft-isolation smoke test and 36 automated tests.
Browser/staging acceptance remains open. Vercel is selected, not deployed.
Content migration has not begun. See [evidence](../sanity/verification.md).

See `docs/project_status.md` for the full, detailed shipped-features log — this file tracks the
higher-level picture only.

## Built

- Vite + React + TypeScript scaffold; six real routes (Home, About, Work, Work/:slug, Writing,
  Writing/:slug) behind a persistent nav/footer shell.
- Full design-token system ported from the original Claude Design export.
- A typed GSAP motion-hook layer (`useReveal`, `useStagger`, `useParallax`, `usePinned`,
  `useFocusZoom`) plus a reactive-text hook set (`useSplitReveal`, `useDecode`, `useInkResolve`,
  `useMagnetic`), all routed through `src/motion/core.ts`.
- Two signature pages: the F-35 project timeline (`/work/rc-f35-vtol`) and the article reading page
  (`/writing/f35-development-update`).
- Real content for 3 projects, About copy/facts/skills/principles, in `src/data/content.ts`.

## Not yet built

- **Project detail pages for the other two projects** (guest registration system, DCS companion
  app) — deliberately deferred until a reusable template is derived from the F-35 page.
- **Real article content** — the one existing article and the F-35 build log are labelled
  placeholder text; real essays haven't been written yet.
- **Deployment** — Vercel is selected; staging and custom-domain DNS remain open.
- **Browser/staging acceptance** — automated Phase 0 tests pass; the browser matrix remains open.
- **A real favicon/brand mark** — currently the default Vite placeholder.
- **Homepage animation rework** — revisit the hero and home-page choreography as a focused design pass.
- **Sanity content migration** — Phase 0 foundation is implemented; portfolio domain migration begins in Phase 1.

## Open items

- TODO: staging Vercel verification plus domain/DNS.
- TODO: whether/when to author real long-form essays, and in what content shape (structured TS
  blocks currently; a Markdown-authoring pipeline was explored but is not present on this branch).
- TODO: finish Phase 0 browser/staging acceptance and human review before starting Phase 1.
- TODO: define the intended outcome for the homepage animation rework before designing it.
