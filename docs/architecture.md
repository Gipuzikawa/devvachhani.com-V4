# Architecture

## Layers

```
Pages (src/pages/)
  ↓ composes
Components (src/components/{ui,cards,layout,motion}/)
  ↓ animated by
Hooks (src/hooks/) + motion core (src/motion/core.ts) — GSAP + ScrollTrigger
  ↓ styled with
Design tokens (src/styles/) — CSS custom properties
  ↓ fed by
Data (src/data/content.ts) — static TypeScript, no backend/CMS
```

## Routing

React Router with real, crawlable routes: `/` (Home), `/about`, `/work`, `/work/:slug` (project detail — unknown slugs redirect to `/work`), `/writing`, `/writing/:slug` (article reading page — unknown slugs redirect to `/writing`). A single persistent `Layout` (`src/components/layout/Layout.tsx`) renders `SiteNav` + the routed page + `SiteFooter` — the footer is always mounted so the nav's `Contact` link can jump to `#contact` with a plain in-page anchor, no route change needed.

`ScrollToTop` resets scroll position on route change (but not on hash-only navigation, so `#contact` still scrolls smoothly instead of snapping).

## Components

- `components/ui/` — `Button`, `TextLink`, `Tag`, `SectionHeading`: the core primitives, ported 1:1 from the original design system's compiled output (`design-export/designSystem/_ds_bundle.js`). Plus `Figure`, an archival figure plate that reserves its aspect ratio (empty-plate placeholder until a real image exists).
- `components/cards/` — `ProjectCard`, `ArticleCard`.
- `components/layout/` — `SiteNav`, `SiteFooter`, `Layout`, `ScrollToTop`.
- `components/motion/` — `RouteTransition`: enter-only page transition wrapping the routed `Outlet`. (The old dependency-free `Reveal` wrapper was retired when the motion foundation landed — two parallel entrance systems was one too many; the GSAP hook layer is the single system now.)

## Motion

`src/motion/core.ts` is the foundation everything animates through. It is the **only** place that calls `gsap.registerPlugin` (ScrollTrigger, CustomEase, useGSAP); it exports `DUR`/`EASE`/`REVEAL_RISE` constants that mirror the CSS motion tokens in `src/styles/tokens/effects.css` (the token eases are registered as named `CustomEase` curves — `ds-out`, `ds-in-out`, `ds-emph` — so CSS transitions and GSAP tweens share the literal same curves); and it exports `prefersReducedMotion()`, the single JS-side reduced-motion check. Rules for anything new: register plugins in core only, draw timing from `DUR`/`EASE` only (add a CSS token first if a new value is needed), and consult `prefersReducedMotion()` instead of calling `matchMedia` directly — reduced-motion users get content in its final state, never gated.

All GSAP lifecycle runs through `@gsap/react`'s `useGSAP()` (StrictMode-safe cleanup, scoped selector queries) — no manual `useEffect` + `gsap.context()`.

The hook layer (`src/hooks/`):

- `useReveal` — canonical per-item scroll entrance: each `[data-reveal]` descendant of the ref'd container fades+rises as *it* crosses the viewport. For vertical lists and long flows.
- `useStagger` — orchestrated group entrance: the container's direct children enter as one staggered sequence when the *container* crosses the viewport. For grids/rows. Accepts `dependencies` to re-run on state change (the Work page's filter uses this to re-enter the visible set).
- `useParallax` — scrub-linked vertical drift; used on the project page's milestone figures.
- `usePinned` — pin-and-hold: the ref'd section pins through a scroll range while a scrubbed timeline (added via its `build` callback) plays. Desktop-only by design (`min-width: 900px`); below that, and under reduced motion, nothing pins and content renders in final state. Used by the project page's final-product section.

Page-specific choreography (the project page's timeline spine draw + node activation, the article page's reading progress + active-TOC tracking, the Home hero) lives in per-page `useGSAP` blocks, composed from the same `DUR`/`EASE` vocabulary — hooks for the reusable patterns, inline timelines for one-off design moments.

**Reduced-motion nuance on the article page:** the reading-progress bar and active-TOC tracking are *not* gated on `prefersReducedMotion()` — they are information about reading position, not decoration, and the bar is scrub-linked so it only moves as far as the reader scrolls. Entrances/parallax degrade to static as everywhere else. Body paragraphs never animate at all: motion must not fight the act of reading.

The Home hero runs a one-off `useGSAP` timeline (line-mask reveal + staggered meta/CTA fade) directly in `Home.tsx` — the reference for the "designed" feel.

**Route transitions:** the original `.dc.html` prototype animated page swaps with a 3-direction disperse-out/slide-in transition (it was a hash-router SPA). That was deliberately dropped with real routes; what exists now is a deliberately *enter-only* transition (`RouteTransition` in `Layout`): the incoming page fades+rises over `--dur-slow`, no exit choreography (exit animations delay navigation). It is keyed by pathname so same-component navigations (e.g. between two future project slugs) still re-enter.

## Design tokens

`src/styles/tokens/*.css` are a direct copy of `design-export/designSystem/tokens/*.css` (colors, typography, spacing, effects, fonts, base reset). `src/styles/tokens.css` mirrors the original `styles.css` `@import` list. `src/styles/global.css` holds page-shell rules that lived inline in the original `Home.dc.html` (`scroll-behavior: smooth`, `::selection`, canvas background).

## Data

`src/data/content.ts` holds the real, personalized content (ported from `Home.dc.html`'s `renderVals()`, not the generic Lorem-ipsum placeholder kit): the 3 real projects, About facts/skill groups/principles, the "on the desk" planned-writing list, and shared nav/footer props. There is no backend or CMS — adding content means editing this file.

`articleDetails` (same file) holds article bodies as **typed blocks** (`ArticleBlock`: paragraph / heading / figure / pullquote) rather than Markdown — the reading page's reactive features (TOC, progress, figure triggers) bind to a first-class content contract, and no parser dependency is needed. The one existing article is transcribed from `Placeholders/Example_Article.md` (plus section headings and a pull quote added for the TOC/set pieces to bind to) and carries `status: 'placeholder'`.

`projectDetails` (same file) holds the per-project detail-page content (`ProjectDetail` in `types.ts`: intro, tool groups, skills, month-dated milestones with figures, final-product specs, reflections). Currently only the F-35 entry exists, transcribed from `Placeholders/Example_Project.md` — its body copy is deliberately lorem and the page carries a `status: 'placeholder'` notice so it is never presented as real work. A project card links to its detail page only when its `ProjectData.slug` is set.

## Not yet built

See `docs/project_status.md` for the full list — most notably, there's no `Article` page yet since no real essays exist (Writing is a "Forthcoming" state, matching the original design).
