# Status

Phase 3 (2026-11-24) connects About and the shared Home facts to Sanity alongside
Work and Writing. The remaining Home and shell content stays static. The project
is at the Phase 3 review gate. See the [verification record](../sanity/verification.md)
and [session handoff](../sanity/session-handoff.md) for measured service results
and outstanding browser and staging checks.

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
  the other two projects remain archive-only. Writing, article pages, About and Home’s
  selected facts use Sanity.

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
- **Remaining Sanity domains** — Phase 4 Home (shared About facts already migrated), Phase 5 settings/shell; Phase 6 production import and cutover.

## Open items

- TODO: staging Vercel verification plus domain/DNS.
- TODO: author real long-form essays in Studio's restricted Portable Text editor.
- TODO: finish the outstanding browser and staging matrix. Phase 4 Home follows human review and merge of Phase 3.
- TODO: define the intended outcome for the homepage animation rework before designing it.
