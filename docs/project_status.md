# Project Status

## Shipped

- Vite + React + TypeScript scaffold, building and type-checking cleanly (`npm run build`, `npx tsc -b --noEmit`).
- Six real routes: Home, About, Work, Work/:slug (project detail), Writing, Writing/:slug (article reading page) — persistent nav + footer shell.
- Design tokens ported and wired up (fonts, colors, typography, spacing, effects, base reset).
- 9 core components ported (`Button`, `TextLink`, `Tag`, `SectionHeading`, `ProjectCard`, `ArticleCard`, `SiteNav`, `SiteFooter`), plus `Figure` (archival figure plate). The original 9th, `Reveal`, was retired when the motion foundation landed (see below).
- Motion foundation: `src/motion/core.ts` (single GSAP plugin registration, token-mirrored `DUR`/`EASE` constants backed by `CustomEase` curves, one central `prefers-reduced-motion` check) + typed hooks `useReveal`/`useStagger`/`useParallax`/`usePinned`, all running through `@gsap/react`'s `useGSAP()`. The old `useScrollReveal` hook and dependency-free `Reveal` component are retired — one entrance system now.
- F-35 project detail page (`/work/rc-f35-vtol`): scroll-driven vertical timeline (cobalt spine draws with reading position, nodes/dates activate at the read line, parallax figure plates), pinned final-product hold with scrubbed spec table, reflections grid. Verified in a real browser at desktop + 375px mobile (no pin, static content) and under emulated reduced motion; unknown slugs redirect to `/work`; zero console errors.
- Article reading page (`/writing/f35-development-update`): scroll-linked reading-progress hairline, sticky mini-TOC with deterministic active-section tracking (correct under instant jumps, kept under reduced motion as information), cobalt drop cap, ruled pull quote, parallax figures; Writing index lists the article via `ArticleCard`. Same browser verification matrix as the project page.
- Cohesion + performance pass: nav entrance and footer reveal in the shared vocabulary; all internal navigation (cards, buttons, text links) is SPA `Link`-based; fonts self-hosted (latin woff2, zero external runtime requests). Measured on the heaviest page (F-35 timeline): ~100 FPS with zero >50ms long tasks while scrolling every scrub; zero console errors across all six routes.
- Scroll-entrance motion on all four pages (hero line-reveal timeline on Home; staggered group entrances for grids; per-item reveals for lists) plus an enter-only route transition. Verified in a real browser: animations play, settle clean (no residual inline styles), survive rapid filter clicking, and fully degrade to static content under emulated `prefers-reduced-motion`; zero console errors.
- Work page: discipline filter (All/Embedded/Software/AI) + Rows/Grid layout toggle.
- Real content: 3 projects (RC F-35 VTOL, corporate guest registration, DCS companion app), About copy/facts/skills/principles, "on the desk" planned-writing list.
- Verified in a real browser: all 4 routes render correctly (fonts/colors/layout match the original design), filter/toggle interactions work, zero console errors.

## Not yet built (intentionally deferred, not forgotten)

- **Article content is placeholder.** The reading page (`/writing/:slug`) is built and wired (see Shipped), but its one article is clearly-labelled lorem from `Placeholders/Example_Article.md` — the real essays still need to be written. Swapping in a real essay means replacing the `articleDetails` blocks in `content.ts`.
- **Project detail pages exist only for the F-35** (deliberate — the user will derive a reusable template from it before the other two projects get pages). Its content is clearly-labelled lorem placeholder from `Placeholders/Example_Project.md`; the real build log still needs to be written. Cards for the other two projects still link to `/work`.
- **No deployment/hosting target chosen.** `npm run build` produces a static `dist/` — needs a host (Vercel/Netlify/Cloudflare Pages/etc.) and a decision on custom-domain DNS.
- **No contact form** — the footer's `Contact` link is a plain `mailto:` link, matching the original design.
- **No tests.** Nothing automated beyond `tsc` type-checking.
- **No real favicon/brand mark** — currently the default Vite placeholder. The design system explicitly says "no logo supplied, don't invent one" — needs a real asset from the user, or an explicit decision to keep the plain wordmark-only brand with no favicon glyph.
