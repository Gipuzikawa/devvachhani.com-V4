# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `CLAUDE.md` and `docs/{architecture,changelog,project_status}.md` for AI-assisted development going forward.
- Motion core (`src/motion/core.ts`): single GSAP plugin-registration point, token-mirrored durations/eases (registered as `CustomEase` curves so CSS and GSAP share the literal same curves), and the one JS-side `prefers-reduced-motion` check.
- Typed entrance hooks: `useReveal` (per-item scroll entrance) and `useStagger` (orchestrated group entrance with re-run-on-state-change support).
- Enter-only route transition (`RouteTransition` in the layout shell) — incoming pages fade + rise; deliberately no exit choreography.
- `@gsap/react` dependency — all GSAP lifecycle now runs through `useGSAP()` (StrictMode-safe cleanup).
- `--dur-hero` motion token for line-mask/hero-scale entrances.
- Project verify skill (`.claude/skills/verify/`) documenting how to drive the app in a browser, including reduced-motion emulation.

### Changed

- Migrated the Claude Design prototype export to a real Vite + React + TypeScript app.
- Replaced the prototype's single-page hash-router with real routes (`/`, `/about`, `/work`, `/writing`) via React Router.
- Ported the design tokens, the 9 core components, and the GSAP scroll-motion hooks from the compiled design-system bundle.
- Ported personalized content (projects, about copy, principles, planned writing) from the prototype's hand-authored data.
- Migrate all page animations (Home hero timeline, Home/About/Work/Writing reveals) onto the new motion foundation; grids now enter as choreographed staggered groups instead of per-item triggers firing simultaneously.
- Hero and reveal tweens now use the design-token ease curves (`ds-emph` etc.) instead of the approximate `expo.out`.

### Fixed

- Work page: changing the discipline filter or Rows/Grid layout no longer re-fires every card's scroll reveal from scratch — the visible set re-enters as one quick staggered group.

### Removed

- `useScrollReveal` hook and the dependency-free `Reveal` component — the two parallel entrance systems are consolidated into the single GSAP hook layer (`useReveal`/`useStagger`).

## [0.0.0] — Claude Design prototype

### Added

- Original handoff bundle from claude.ai/design: `Home.dc.html` (single-page prototype, 4 hash-routed views), a compiled design system (`designSystem/_ds_bundle.js` + design tokens), and a generic starter UI kit with placeholder content. Preserved as-is in `design-export/`.
