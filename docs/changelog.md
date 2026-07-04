# Changelog

## [Unreleased]

- Migrated the Claude Design prototype export to a real Vite + React + TypeScript app. Real routes (`/`, `/about`, `/work`, `/writing`) via React Router, replacing the prototype's single-page hash-router. Design tokens, the 9 core components, and the GSAP scroll-motion hooks were ported from the compiled design-system bundle; personalized content (projects, about copy, principles, planned writing) was ported from the prototype's hand-authored data.
- Added `CLAUDE.md` + `docs/architecture.md` + `docs/project_status.md` (this file's siblings) for AI-assisted development going forward.

## 0.0.0 — Claude Design prototype

- Original handoff bundle from claude.ai/design: `Home.dc.html` (single-page prototype, 4 hash-routed views), a compiled design system (`designSystem/_ds_bundle.js` + design tokens), and a generic starter UI kit with placeholder content. Preserved as-is in `design-export/`.
