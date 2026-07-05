# Project Status

## Shipped

- Vite + React + TypeScript scaffold, building and type-checking cleanly (`npm run build`, `npx tsc -b --noEmit`).
- Four real routes: Home, About, Work, Writing — persistent nav + footer shell.
- Design tokens ported and wired up (fonts, colors, typography, spacing, effects, base reset).
- 9 core components ported (`Button`, `TextLink`, `Tag`, `SectionHeading`, `ProjectCard`, `ArticleCard`, `SiteNav`, `SiteFooter`, `Reveal`).
- Motion foundation: `src/motion/core.ts` (single GSAP plugin registration, token-mirrored `DUR`/`EASE` constants backed by `CustomEase` curves, one central `prefers-reduced-motion` check) + typed hooks `useReveal`/`useStagger`/`useParallax`, all running through `@gsap/react`'s `useGSAP()`. The old `useScrollReveal` hook and dependency-free `Reveal` component are retired — one entrance system now.
- Scroll-entrance motion on all four pages (hero line-reveal timeline on Home; staggered group entrances for grids; per-item reveals for lists) plus an enter-only route transition. Verified in a real browser: animations play, settle clean (no residual inline styles), survive rapid filter clicking, and fully degrade to static content under emulated `prefers-reduced-motion`; zero console errors.
- Work page: discipline filter (All/Embedded/Software/AI) + Rows/Grid layout toggle.
- Real content: 3 projects (RC F-35 VTOL, corporate guest registration, DCS companion app), About copy/facts/skills/principles, "on the desk" planned-writing list.
- Verified in a real browser: all 4 routes render correctly (fonts/colors/layout match the original design), filter/toggle interactions work, zero console errors.

## Not yet built (intentionally deferred, not forgotten)

- **No `Article` page/route.** The original design kit has a full article-screen template (reading-progress bar, drop cap, pull quote, parallax figure) in `design-export/designSystem/_ds_bundle.js`, but there are no real essays yet — Writing stays in the "Forthcoming" state that the original prototype used. Now explicitly in scope for the animation pass (see `HANDOVER.md` §5b), to be built against clearly-labelled placeholder content from `Placeholders/Example_Article.md`.
- **No per-project detail pages.** Cards link to `/work`; there is no `/work/:slug` route and `ProjectData` has no narrative fields. In scope next (HANDOVER §5a): the F-35 project page with a scroll-driven vertical timeline, built from `Placeholders/Example_Project.md`, to become the template other projects reuse later.
- **No deployment/hosting target chosen.** `npm run build` produces a static `dist/` — needs a host (Vercel/Netlify/Cloudflare Pages/etc.) and a decision on custom-domain DNS.
- **No contact form** — the footer's `Contact` link is a plain `mailto:` link, matching the original design.
- **No tests.** Nothing automated beyond `tsc` type-checking.
- **No real favicon/brand mark** — currently the default Vite placeholder. The design system explicitly says "no logo supplied, don't invent one" — needs a real asset from the user, or an explicit decision to keep the plain wordmark-only brand with no favicon glyph.
- **Fonts still load from Google Fonts CDN** (`src/styles/tokens/fonts.css`) rather than self-hosted — fine for now, flagged in the original design docs as an optional future optimization.
- **`useParallax` hook exists but is unused** — now rebuilt on the `useGSAP` foundation, but no page has a parallax figure yet (earmarked for the Article reading page and project-page figures, both now in scope for the animation pass).
