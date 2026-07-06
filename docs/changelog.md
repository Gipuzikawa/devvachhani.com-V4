# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Focus-zoom cycle on the F-35 production timeline (`useFocusZoom` hook): each milestone card zooms into focus — scale and ink scrub up as it approaches the 60% read line, landing at full scale at the same moment its spine node stamps cobalt — holds completely static through the reading band (body copy never moves while read), then recedes and dims once read, handing focus to the next card. Transform/opacity only; skipped under reduced motion (cards render at final state).

- The "set & print" reactive-text signature (the kinetic pass): serif display text is *set* — it rises into place from behind per-line masks (`useSplitReveal`, GSAP SplitText) — and mono labels are *printed* — they scramble-settle through catalogue glyphs (`useDecode`, GSAP ScrambleText). Both plugins ship free inside the existing gsap install; zero new dependencies.
- `useInkResolve` hook — a lead paragraph's lines sit faint and resolve to full ink as the read line sweeps them (color-only, no reflow). Used on the About lead and the F-35 closing reflection.
- `useMagnetic` hook — cursor lean for small interactive atoms (hero CTA, nav CTA); fine-pointer hover devices only, static on touch and under reduced motion.
- `--ease-spring` token (mirrored as `EASE.spring`) — a one-overshoot settle for stamps and magnetic returns.
- Home hero set-piece: the metas print, every headline character sets into its line, and scrolling away peels the lines upward at different rates while the hero fades — the split reverts to plain text once settled.
- Work index set-piece: filter and Rows/Grid switches are FLIP morphs (surviving cards glide to their new positions; entering/leaving cards fade through), and card index numbers print in on entrance.
- Cobalt hairline route sweep across the top of the viewport on navigation (enter-only transitions preserved; on article pages it lands on the same line as the reading-progress bar). The wordmark tick re-stamps on every route change.
- F-35 page escalation: timeline dates print the first time their node activates (once only), nodes stamp with the spring ease, pinned spec values scramble under the reader's scrub, milestone titles set line-by-line, and the closing reflection ink-resolves.
- Article page (kept quiet — it's a reading page): the title and pull quotes set line-by-line, the mono meta prints; body paragraphs remain untouched and the reading-progress/TOC reduced-motion exception is preserved.
- `SectionHeading` now carries the signature itself: its meta line prints, its title sets, and its rule draws across the page.

- `CLAUDE.md` and `docs/{architecture,changelog,project_status}.md` for AI-assisted development going forward.
- Motion core (`src/motion/core.ts`): single GSAP plugin-registration point, token-mirrored durations/eases (registered as `CustomEase` curves so CSS and GSAP share the literal same curves), and the one JS-side `prefers-reduced-motion` check.
- Typed entrance hooks: `useReveal` (per-item scroll entrance) and `useStagger` (orchestrated group entrance with re-run-on-state-change support).
- Enter-only route transition (`RouteTransition` in the layout shell) — incoming pages fade + rise; deliberately no exit choreography.
- `@gsap/react` dependency — all GSAP lifecycle now runs through `useGSAP()` (StrictMode-safe cleanup).
- `--dur-hero` motion token for line-mask/hero-scale entrances.
- Project verify skill (`.claude/skills/verify/`) documenting how to drive the app in a browser, including reduced-motion emulation.
- F-35 project detail page (`/work/rc-f35-vtol`): scroll-driven vertical production timeline (cobalt progress spine, nodes that activate at the read line, per-milestone figures), pinned "hold and reveal" final-product section with a scrubbed spec table, and a reflections section — populated from `Placeholders/Example_Project.md` with an explicit placeholder-content notice. The page is the template other projects will be derived from.
- `usePinned` hook — pin-and-hold choreography (desktop-only, static below 900px and under reduced motion).
- `Figure` component — archival figure plate that reserves its aspect ratio; renders an honest empty-plate placeholder until a real image exists.
- Richer project content model (`ProjectDetail`, `ProjectMilestone`, `FigureData` types; `projectDetails` in `content.ts`).
- Article reading page (`/writing/f35-development-update`): scroll-linked reading-progress hairline, sticky mini-TOC whose active section tracks the read line (kept under reduced motion — it's information, not decoration), cobalt drop cap, ruled pull quote, parallax figure plates. Body paragraphs deliberately never animate — motion must not fight reading.
- Typed article content model (`ArticleBlock` union + `ArticleDetail`) — structured TS blocks rather than Markdown, so the reactive features bind to a first-class contract with no parser dependency.
- Writing index now lists the placeholder article via `ArticleCard` (wired to the reading page), replacing the "Forthcoming" plate; the "on the desk" list remains.
- Shell motion: one-off nav entrance on first load (wordmark settles, cobalt tick stamps in, index links follow) and a once-per-visit footer reveal — both in the shared entrance vocabulary.

### Changed

- Branching workflow: PRs now merge onto the `development-Area` integration branch instead of directly onto `main`; `main` receives merges from `development-Area` only (documented in `CLAUDE.md`'s Repository Etiquette).
- Migrated the Claude Design prototype export to a real Vite + React + TypeScript app.
- Replaced the prototype's single-page hash-router with real routes (`/`, `/about`, `/work`, `/writing`) via React Router.
- Ported the design tokens, the 9 core components, and the GSAP scroll-motion hooks from the compiled design-system bundle.
- Ported personalized content (projects, about copy, principles, planned writing) from the prototype's hand-authored data.
- Migrate all page animations (Home hero timeline, Home/About/Work/Writing reveals) onto the new motion foundation; grids now enter as choreographed staggered groups instead of per-item triggers firing simultaneously.
- Hero and reveal tweens now use the design-token ease curves (`ds-emph` etc.) instead of the approximate `expo.out`.
- `ProjectCard` and `ArticleCard` navigate with a React Router `Link` instead of a raw `<a>`, so card → detail navigation stays in the SPA (no full reload, route transition plays). `Button` and `TextLink` do the same for internal (`/…`) hrefs while keeping native anchors for hash/external links.
- Fonts are self-hosted woff2 (latin subset) in `public/fonts/` instead of the Google Fonts CDN — zero external requests at runtime.
- `RouteTransition` calls `ScrollTrigger.refresh()` on route change so persistent triggers (the footer reveal) stay honest against the new page height.
- Motion core registers SplitText, ScrambleText and Flip (still the single registration point) and re-exports them so plugin access always routes through the core; adds `DECODE_CHARS` (the shared scramble character well) and `cssToken()` for tweens needing literal token colors.
- Pages no longer wrap `SectionHeading` in their own reveal — the component animates itself (the Work page's filter changes also no longer re-run the entrance stagger; the FLIP morph carries the transition instead).
- Bundle cost of the kinetic pass: +17.2 KB gzip (135.1 → 152.3), all of it the three GSAP plugins + hook code; measured 120 FPS with zero >50 ms long tasks scrolling the full F-35 timeline.

### Fixed

- Work page: changing the discipline filter or Rows/Grid layout no longer re-fires every card's scroll reveal from scratch — the visible set re-enters as one quick staggered group.

### Removed

- `useScrollReveal` hook and the dependency-free `Reveal` component — the two parallel entrance systems are consolidated into the single GSAP hook layer (`useReveal`/`useStagger`).

## [0.0.0] — Claude Design prototype

### Added

- Original handoff bundle from claude.ai/design: `Home.dc.html` (single-page prototype, 4 hash-routed views), a compiled design system (`designSystem/_ds_bundle.js` + design tokens), and a generic starter UI kit with placeholder content. Preserved as-is in `design-export/`.
