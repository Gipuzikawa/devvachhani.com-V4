# Status

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
- **Deployment** — no host or custom-domain DNS chosen.
- **Automated tests** — nothing beyond `tsc` type-checking.
- **A real favicon/brand mark** — currently the default Vite placeholder.
- **Homepage animation rework** — revisit the hero and home-page choreography as a focused design pass.
- **Sanity CMS** — replace hand-authored TypeScript content with a Sanity-backed editorial workflow; planning is underway.

## Open items

- TODO: hosting decision (Vercel/Netlify/Cloudflare Pages or similar) plus domain/DNS.
- TODO: whether/when to author real long-form essays, and in what content shape (structured TS
  blocks currently; a Markdown-authoring pipeline was explored but is not present on this branch).
- TODO: approve the Sanity content model and integration design before implementation.
- TODO: define the intended outcome for the homepage animation rework before designing it.
