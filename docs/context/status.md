# Status

Phase 4 makes Home’s hero, links, section copy and featured projects editable in
Sanity. Its shared facts come from About. Shell settings migrate in Phase 5,
after the Phase 4 PR is reviewed and merged. The [verification record](../sanity/verification.md)
and [session handoff](../sanity/session-handoff.md) track acceptance evidence.

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
  the other two projects remain archive-only. Writing, article pages, About and Home use Sanity.

## Not yet built

- **Project detail pages for the other two projects** (guest registration system, DCS companion
  app) — deliberately deferred until a reusable template is derived from the F-35 page.
- **Real article content** — the one existing article and the F-35 build log are labelled
  placeholder text; real essays haven't been written yet.
- **Deployment** — Vercel is selected; staging and custom-domain DNS remain open.
- **Acceptance checks** — browser visuals, iframe cookies and staging remain open. Dated
  service results are in the verification record.
- **A real favicon/brand mark** — currently the default Vite placeholder.
- **Homepage animation rework** — revisit the hero and home-page choreography as a focused design pass.
- **Remaining Sanity domains** — Phase 5 settings/shell; Phase 6 production import and cutover.

## Open items

- TODO: staging Vercel verification plus domain/DNS.
- TODO: author real long-form essays in Studio's restricted Portable Text editor.
- TODO: finish the outstanding browser and staging matrix.
- TODO: define the intended outcome for the homepage animation rework before designing it.
