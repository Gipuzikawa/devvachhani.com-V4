# Project Status

Current handoff: [Sanity session handoff](sanity/session-handoff.md). Phase 0/1
implementation is covered by PRs #11–#13; acceptance limits are recorded separately
in [verification](sanity/verification.md). PR #14 integrated Phase 2 at d388558.

## Home and the editable hero

Studio’s Home singleton controls three lines of hero text and emphasis, calls to
action, section copy and ordered project references. Home still reads the shared
facts selected in About. See the [Phase 4 progress log](sanity/phase-4-migration.md).

## About and shared Home facts — 2026-11-24

Phase 3 connects About and Home’s selected facts to one development singleton.
PR #15 merged at `b221438`. See the [progress log](sanity/phase-3-migration.md).

## Historical checkpoint: Articles and Writing — 2026-11-17

Writing/article routes read Sanity through registered typed queries and revision-keyed
views. Restricted Portable Text preserves rich marks/lists, safe links, stable TOC
anchors, drop cap, placeholder figures/notice and the six-minute example override.
The guarded Phase 2 importer targets development only. There are 100 passing tests;
build and live verification results and limitations are in the verification record.
About (Phase 3) is next, after this PR receives human review and merges.

## Historical checkpoint: project page integration — 2026-11-17

Task 1.2 connects Work and project detail pages to Sanity with typed queries,
strict adapters, ID-based discipline filters and revision-keyed animated views.
Loading/failure/incomplete preview states are distinct from successful missing
slugs. Figures preserve placeholder plates or use responsive hotspot/crop images
with separate alt text. Session polling no longer replays page motion. Tests now
total 65; browser/staging acceptance and observed CDN invalidation timing remain
open. The fresh origin publish/draft/exit workflow passed. No production cutover is included.

## Historical checkpoint: project import foundation — 2026-11-17

Phase 1.1 adds project/Work schemas, source snapshots and guarded import tooling.
Seven development records are imported; a live rerun created zero records and
reported zero differences. Tests now total 46. Task 1.2 will connect page reads;
the portfolio still uses static content. See [inventory](sanity/content-inventory.md)
and [evidence](sanity/verification.md).

## Historical checkpoint: Sanity Phase 0 — 2026-11-17

Studio, generated types, published transport, authenticated preview API and preview
controls are implemented. Project `oir24qey` has public development/production
datasets. The real development HTTP smoke test passes; 36 automated tests pass.
Portfolio pages still use static content pending Phase 1. Browser authentication,
iframe-cookie and staging checks remain open; Phase 0 is not fully accepted.
See [verification](sanity/verification.md). Vercel is selected but no deployment
has been performed.

## Shipped

The original UI browser/performance evidence below predates the Sanity migration.
It is not evidence that the new async CMS/browser matrix has passed.

- Vite + React + TypeScript scaffold, building and type-checking cleanly (`npm run build`, `npx tsc -b --noEmit`).
- Six real routes: Home, About, Work, Work/:slug (project detail), Writing, Writing/:slug (article reading page) — persistent nav + footer shell.
- Design tokens ported and wired up (fonts, colors, typography, spacing, effects, base reset).
- 9 core components ported (`Button`, `TextLink`, `Tag`, `SectionHeading`, `ProjectCard`, `ArticleCard`, `SiteNav`, `SiteFooter`), plus `Figure` (archival figure plate). The original 9th, `Reveal`, was retired when the motion foundation landed (see below).
- Motion foundation: `src/motion/core.ts` (single GSAP plugin registration, token-mirrored `DUR`/`EASE` constants backed by `CustomEase` curves, one central `prefers-reduced-motion` check) + typed hooks `useReveal`/`useStagger`/`useParallax`/`usePinned`, all running through `@gsap/react`'s `useGSAP()`. The old `useScrollReveal` hook and dependency-free `Reveal` component are retired — one entrance system now.
- F-35 project detail page (`/work/rc-f35-vtol`): scroll-driven vertical timeline (cobalt spine draws with reading position, nodes/dates activate at the read line, parallax figure plates, and a per-card focus-zoom cycle via `useFocusZoom` — cards zoom into focus at the read line, hold static while read, recede after), pinned final-product hold with scrubbed spec table, reflections grid. Verified in a real browser at desktop + 375px mobile (no pin, static content) and under emulated reduced motion; unknown slugs redirect to `/work`; zero console errors.
- Article reading page (`/writing/f35-development-update`): scroll-linked reading-progress hairline, sticky mini-TOC with deterministic active-section tracking (correct under instant jumps, kept under reduced motion as information), cobalt drop cap, ruled pull quote, parallax figures; Writing index lists the article via `ArticleCard`. Same browser verification matrix as the project page.
- Cohesion + performance pass: nav entrance and footer reveal in the shared vocabulary; all internal navigation (cards, buttons, text links) is SPA `Link`-based; fonts self-hosted (latin woff2, zero external runtime requests). Measured on the heaviest page (F-35 timeline): ~100 FPS with zero >50ms long tasks while scrolling every scrub; zero console errors across all six routes.
- Scroll-entrance motion on all four pages (staggered group entrances for grids; per-item reveals for lists) plus an enter-only route transition. Verified in a real browser: animations play, settle clean (no residual inline styles), survive rapid filter clicking, and fully degrade to static content under emulated `prefers-reduced-motion`; zero console errors.
- The kinetic pass (Round 2): the "set & print" reactive-text signature site-wide — serif display text rises from behind per-line masks (`useSplitReveal`/SplitText), mono labels scramble-settle (`useDecode`/ScrambleText) — plus `useInkResolve` (scrubbed per-line ink resolve on lead paragraphs), `useMagnetic` (fine-pointer cursor lean), self-animating `SectionHeading` (meta prints, title sets, rule draws), the per-character Home hero with scrub-linked recede, FLIP-morphing Work filters/layouts, F-35 timeline dates that print on activation + spec values that scramble under the pinned scrub, a cobalt route sweep, and the re-stamping wordmark tick. Zero new dependencies (all three plugins ship in gsap 3.15); +17.2 KB gzip; measured 120 FPS with zero >50 ms long tasks on the F-35 timeline; verified in a real browser across all six routes, including the reduced-motion matrix (all content at final state) and rapid filter-click stress; zero console errors.
- Work page: discipline filter (All/Embedded/Software/AI) + Rows/Grid layout toggle.
- Real content: 3 projects (RC F-35 VTOL, corporate guest registration, DCS companion app), About copy/facts/skills/principles, "on the desk" planned-writing list.
- Verified in a real browser: all 4 routes render correctly (fonts/colors/layout match the original design), filter/toggle interactions work, zero console errors.

## Not yet built (intentionally deferred, not forgotten)

- **Article content is placeholder.** The reading page (`/writing/:slug`) still labels its example honestly. Author real essays in Sanity Studio; keep existing heading IDs stable.
- **Project detail pages exist only for the F-35** (deliberate — the user will derive a reusable template from it before the other two projects get pages). Its content is clearly-labelled lorem placeholder from `Placeholders/Example_Project.md`; the real build log still needs to be written. Cards for the other two projects still link to `/work`.
- **Vercel deployment pending.** Combined frontend/Studio build and routing are configured; staging and custom-domain DNS remain open.
- **No contact form** — the footer's `Contact` link is a plain `mailto:` link, matching the original design.
- **Acceptance pending.** Current automated checks total 100 tests; browser/staging and observed primed CDN invalidation timing remain open.
- **No real favicon/brand mark** — currently the default Vite placeholder. The design system explicitly says "no logo supplied, don't invent one" — needs a real asset from the user, or an explicit decision to keep the plain wordmark-only brand with no favicon glyph.
- **Homepage animation rework** — the current hero set-piece and home-page choreography need a dedicated redesign brief before implementation.
- **Remaining Sanity migration** — Work/project and Writing/article reads use Sanity. About, Home and settings/shell remain for Phases 3–5; production import/cutover is Phase 6.
