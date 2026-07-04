# Project Status

## Shipped

- Vite + React + TypeScript scaffold, building and type-checking cleanly (`npm run build`, `npx tsc -b --noEmit`).
- Four real routes: Home, About, Work, Writing — persistent nav + footer shell.
- Design tokens ported and wired up (fonts, colors, typography, spacing, effects, base reset).
- 9 core components ported (`Button`, `TextLink`, `Tag`, `SectionHeading`, `ProjectCard`, `ArticleCard`, `SiteNav`, `SiteFooter`, `Reveal`).
- GSAP + ScrollTrigger scroll-reveal motion (`useScrollReveal`) on Home, About, and Work; hero line-reveal timeline on Home.
- Work page: discipline filter (All/Embedded/Software/AI) + Rows/Grid layout toggle.
- Real content: 3 projects (RC F-35 VTOL, corporate guest registration, DCS companion app), About copy/facts/skills/principles, "on the desk" planned-writing list.
- Verified in a real browser: all 4 routes render correctly (fonts/colors/layout match the original design), filter/toggle interactions work, zero console errors.

## Not yet built (intentionally deferred, not forgotten)

- **No `Article` page/route.** The original design kit has a full article-screen template (reading-progress bar, drop cap, pull quote, parallax figure) in `design-export/designSystem/_ds_bundle.js`, but there are no real essays yet — Writing stays in the "Forthcoming" state that the original prototype used. Port it when real content exists; don't build it speculatively.
- **No deployment/hosting target chosen.** `npm run build` produces a static `dist/` — needs a host (Vercel/Netlify/Cloudflare Pages/etc.) and a decision on custom-domain DNS.
- **No contact form** — the footer's `Contact` link is a plain `mailto:` link, matching the original design.
- **No tests.** Nothing automated beyond `tsc` type-checking.
- **No real favicon/brand mark** — currently the default Vite placeholder. The design system explicitly says "no logo supplied, don't invent one" — needs a real asset from the user, or an explicit decision to keep the plain wordmark-only brand with no favicon glyph.
- **Fonts still load from Google Fonts CDN** (`src/styles/tokens/fonts.css`) rather than self-hosted — fine for now, flagged in the original design docs as an optional future optimization.
- **`useParallax` hook exists but is unused** — ported alongside `useScrollReveal` for parity with the original kit, but no page currently has a parallax figure (that's part of the deferred Article page).
