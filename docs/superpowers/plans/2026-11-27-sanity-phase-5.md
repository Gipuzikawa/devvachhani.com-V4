# Sanity Phase 5 execution checklist

Base: PR #16 merged into `development-Area` at `8d0cee2`. Follow the approved
[design](../specs/2026-10-07-sanity-cms-design.md) and
[plan](2026-10-07-sanity-cms.md#phase-5--settings-and-persistent-shell).

## Global constraints

Use only `oir24qey/development` for this phase. Keep the current Vite routes,
tokens, frozen design export, and GSAP conventions. Public reads remain token-free
and CDN-backed. Draft reads use the signed, allowlisted endpoint. Use the guarded
importer with create-missing and leave existing editor content alone. Open the PR
against `development-Area` and wait for human review and merge. Phase 6 starts
on a fresh branch after the merge is verified.

### Task 1 — Site settings data and guarded import

- [x] Add focused tests for frozen-copy parity, safe contact/social destinations,
  ordered and stable social keys, missing and malformed settings, query allowlisting,
  phase confinement, collision handling and create-missing reruns.
- [x] Add the `siteSettings` document, fixed ID `siteSettings` and source key
  `site-settings`. Use distinct fields `wordmark`, `contactEmail`, `footerSignoff`,
  `footerMeta`, `footerColophon`, and optional ordered `socialLinks` with keyed
  `label`/`href` items. Seed one published record from the frozen content and
  SiteFooter snapshots with no asset or reference dependencies. Preserve both
  `#` destinations exactly. Keep Email derived from the validated contact email.
- [x] Share validation across schema, adapter and import. Accept HTTPS social URLs
  and the literal placeholder `#`. Reject malformed URLs, credentials and
  unsafe schemes. Validate a bare mailbox before constructing the mailto href.
  Preserve authored editorial strings. Handle absent optional social links as empty.
- [x] Register the projected singleton query as `siteSettings` in the existing
  typed allowlist and regenerate TypeGen. The adapter returns null for an absent
  singleton and raises the existing incomplete-content error for malformed fields.
  Export a typed view with the editorial fields, stable social keys and email href.
- [x] Extend only the development phase importer to Phase 5. Preserve source
  fixtures and retain the existing lock, manifest, revision and skip semantics.
  Run focused tests and commit.

### Task 2 — Persistent shell and motion

- [x] Test with the real shell and transported settings through all six existing
  route patterns. Cover a single settings request across navigation, refresh,
  stale/late response and perspective transitions, public/preview isolation,
  loading/unavailable/incomplete settings, Contact during load, ordered links,
  contact-derived email, and footer motion cleanup. Test the nav stays mounted
  and entrance does not replay when settings or routes change.
- [x] Load settings in Layout. Give the existing content hook a narrow option for
  a route-independent request identity while preserving existing page identities.
  Keep the nav, outlet and footer anchor mounted and code-own route links, Contact,
  the cobalt tick, and footer styling. Use a functional home link during settings
  load or failure. Present a focused state and retry in the footer without blocking
  the outlet. Keep social placeholders and omit stale draft content when exiting.
- [x] Key the animated footer content by editable presentation values, so changed
  text reinitializes motion and same values keep it mounted. Keep the outer
  `footer#contact` stable, refresh ScrollTrigger after shell layout changes,
  and preserve route animation/scroll behavior. Check native and direct Contact
  anchor behavior. Use existing motion hooks.
- [x] Remove active runtime imports of `src/data/content.ts`. Preserve migration
  and rollback sources. Run shell and regression tests, then commit.

### Task 3 — Studio navigation and Phase 5 verification

- [x] Use a shared singleton list for fixed Structure items and action/template
  protections. Put the five singletons before Projects, Articles and Disciplines.
  Provide Site settings Presentation locations and main document routing for
  editorial routes. Preserve detail availability and validate slug shape and length.
  Check all eight types and the singleton restrictions, then commit.
- [x] Run the focused and full automated checks, TypeGen reproducibility,
  `npm run build:deploy`, and maintained-code lint. Inspect current CLI support
  for a development schema deployment. Use the configured development project for
  a no-write dry run, guarded create-missing and a zero-change rerun.
- [x] Compare token-free origin and CDN settings against the seed. With local
  HTTPS, enter signed preview, verify a revision-guarded disposable singleton
  draft across route entry paths, compare public data, exit and verify unauthorized
  reads. Keep secret and cookie values out of output. Remove only the owned draft.
  Recheck browser access and record what can be verified.
- [x] Update verification, handoff and a short committed progress log. Review
  the complete branch independently. Phase 6 owns staging and production
  cutover. Public route URLs stay the same and need no redirects.
- [x] Push and open [PR #17](https://github.com/Gipuzikawa/devvachhani.com-V4/pull/17) against `development-Area` for human review.
