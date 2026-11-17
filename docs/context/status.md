# Status

Current update (2026-11-17): Sanity Phases 0–2 are implemented; 100 automated
tests, builds, lint and credential scans passed at the last implementation check.
Work/project and Writing/article pages use Sanity; Home/About/shell domains remain
static. Real origin draft/publish/exit checks pass. Primed CDN invalidation timing,
browser/iframe/reduced-motion checks and Vercel staging remain open. No production
deployment or dataset cutover has occurred. See [evidence](../sanity/verification.md)
and [session handoff](../sanity/session-handoff.md).

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
- Three projects, three disciplines and Work settings imported into Sanity development;
  a rerun created zero records and reported zero differences. F-35 detail is enabled;
  the other two projects remain archive-only. Articles/Writing now use Sanity;
  About/Home/shell copy remains static.

## Not yet built

- **Project detail pages for the other two projects** (guest registration system, DCS companion
  app) — deliberately deferred until a reusable template is derived from the F-35 page.
- **Real article content** — the one existing article and the F-35 build log are labelled
  placeholder text; real essays haven't been written yet.
- **Deployment** — Vercel is selected; staging and custom-domain DNS remain open.
- **Acceptance checks** — browser/staging checks and observed primed CDN invalidation
  timing remain open; DOM tests do not verify actual GSAP/browser behavior.
- **A real favicon/brand mark** — currently the default Vite placeholder.
- **Homepage animation rework** — revisit the hero and home-page choreography as a focused design pass.
- **Remaining Sanity domains** — Phase 3 About, Phase 4
  Home, Phase 5 settings/shell; Phase 6 production import and cutover.

## Open items

- TODO: staging Vercel verification plus domain/DNS.
- TODO: author real long-form essays in Studio's restricted Portable Text editor.
- TODO: investigate the stale primed CDN query and finish the outstanding browser/
  staging matrix. Phase 3 About is next after the Phase 2 PR is reviewed and merged.
- TODO: define the intended outcome for the homepage animation rework before designing it.
