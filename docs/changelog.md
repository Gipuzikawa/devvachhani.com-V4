# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `CLAUDE.md` and `docs/{architecture,changelog,project_status}.md` for AI-assisted development going forward.

### Changed

- Migrated the Claude Design prototype export to a real Vite + React + TypeScript app.
- Replaced the prototype's single-page hash-router with real routes (`/`, `/about`, `/work`, `/writing`) via React Router.
- Ported the design tokens, the 9 core components, and the GSAP scroll-motion hooks from the compiled design-system bundle.
- Ported personalized content (projects, about copy, principles, planned writing) from the prototype's hand-authored data.

## [0.0.0] — Claude Design prototype

### Added

- Original handoff bundle from claude.ai/design: `Home.dc.html` (single-page prototype, 4 hash-routed views), a compiled design system (`designSystem/_ds_bundle.js` + design tokens), and a generic starter UI kit with placeholder content. Preserved as-is in `design-export/`.
