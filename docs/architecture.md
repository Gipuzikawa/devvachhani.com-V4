# Architecture

## Layers

```
Pages (src/pages/)
  ↓ composes
Components (src/components/{ui,cards,layout,motion}/)
  ↓ animated by
Hooks (src/hooks/) — GSAP + ScrollTrigger scroll motion
  ↓ styled with
Design tokens (src/styles/) — CSS custom properties
  ↓ fed by
Data (src/data/content.ts) — static TypeScript, no backend/CMS
```

## Routing

React Router with real, crawlable routes: `/` (Home), `/about`, `/work`, `/writing`. A single persistent `Layout` (`src/components/layout/Layout.tsx`) renders `SiteNav` + the routed page + `SiteFooter` — the footer is always mounted so the nav's `Contact` link can jump to `#contact` with a plain in-page anchor, no route change needed.

`ScrollToTop` resets scroll position on route change (but not on hash-only navigation, so `#contact` still scrolls smoothly instead of snapping).

## Components

- `components/ui/` — `Button`, `TextLink`, `Tag`, `SectionHeading`: the core primitives, ported 1:1 from the original design system's compiled output (`design-export/designSystem/_ds_bundle.js`).
- `components/cards/` — `ProjectCard`, `ArticleCard`.
- `components/layout/` — `SiteNav`, `SiteFooter`, `Layout`, `ScrollToTop`.
- `components/motion/` — `Reveal`: a dependency-free (IntersectionObserver) scroll-entrance wrapper, kept as a fallback pattern per the original design system's own documented intent. Pages currently use the GSAP-backed `useScrollReveal` hook instead, for ScrollTrigger's finer control (once-only triggers, viewport thresholds).

## Motion

`src/hooks/useScrollReveal.ts` and `useParallax.ts` are ported from the original design kit's `gsap-helpers.jsx` (`design-export/designSystem/_ds_bundle.js`), adapted to import `gsap`/`gsap/ScrollTrigger` from npm instead of a CDN `<script>` tag. `useScrollReveal` fades+rises any `[data-reveal]` descendant of the ref'd container as it scrolls into view; `useParallax` is available but not currently used on any page.

The Home page's hero also runs a one-off GSAP timeline (line-reveal + staggered meta/CTA fade) directly in `Home.tsx`, matching the original kit's `HomeScreen` hero animation.

**Known simplification:** the original `.dc.html` prototype animated *page swaps* with a 3-direction disperse-out/slide-in transition, because it was a single-page hash-router with no real navigation. Real routes make that architecture moot — page changes here are a plain route swap with scroll-reveal-on-mount for content, not a custom transition. Revisit only if a bespoke page-transition (e.g. via Framer Motion) is explicitly wanted.

## Design tokens

`src/styles/tokens/*.css` are a direct copy of `design-export/designSystem/tokens/*.css` (colors, typography, spacing, effects, fonts, base reset). `src/styles/tokens.css` mirrors the original `styles.css` `@import` list. `src/styles/global.css` holds page-shell rules that lived inline in the original `Home.dc.html` (`scroll-behavior: smooth`, `::selection`, canvas background).

## Data

`src/data/content.ts` holds the real, personalized content (ported from `Home.dc.html`'s `renderVals()`, not the generic Lorem-ipsum placeholder kit): the 3 real projects, About facts/skill groups/principles, the "on the desk" planned-writing list, and shared nav/footer props. There is no backend or CMS — adding content means editing this file.

## Not yet built

See `docs/project_status.md` for the full list — most notably, there's no `Article` page yet since no real essays exist (Writing is a "Forthcoming" state, matching the original design).
