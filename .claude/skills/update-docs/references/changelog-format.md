# Changelog Format Rules

`docs/changelog.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html) — see the preamble at the top of
the file itself. Follow these rules exactly when adding entries.

---

## Where new entries go

- All new work lands under the `## [Unreleased]` heading at the top of the file, below the
  preamble.
- If `## [Unreleased]` doesn't exist yet (e.g. right after a release), create it above the
  most recent version heading.
- Never edit or reorder an already-released version section (e.g. `## [0.1.0] — ...`).

## Subsections

Group lines under these `###` subsections, in this order, and only include the ones that
apply:

1. `### Added` — new pages, components, content, capabilities
2. `### Changed` — modifications to existing behavior
3. `### Fixed` — bug fixes
4. `### Removed` — deleted pages, components, or dependencies

## Line style

- One concise bullet per change, imperative mood ("Add the Work page's discipline filter",
  not "Added" or "Adding")
- Describe what it means for the project, not a literal diff summary — reference the
  user-visible or architectural outcome, not file names, unless a file name is the clearest
  way to say it
- Don't restate the same change twice across subsections

## Releasing a version

Only cut `[Unreleased]` into a real version heading (e.g. `## [0.2.0] — 2026-08-01`) when the
user explicitly asks to release/tag a version. Never guess a version bump on your own —
ask if it's unclear whether it should be a patch, minor, or major bump per SemVer.
