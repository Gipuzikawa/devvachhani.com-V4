# Phase 0 execution

Implements Phase 0 of `2026-10-07-sanity-cms.md`; the approved design remains unchanged.

## Scope and order

1. Establish separate root/Studio lockfiles, credential-free environment examples,
   server type checking, deployment composition, and the discipline schema.
2. Generate query types and implement token-free published reads plus an explicit,
   cancellable content boundary. Existing pages retain their static source.
3. Implement Sanity-secret validation, signed one-hour sessions, bounded registered
   queries, same-origin exit, preview refresh/expiry states, and Presentation links.
4. Verify security and async behavior with focused tests, builds, lint, TypeGen
   repeatability, bundle inspection, and browser checks where available.
5. Record account provisioning and real draft/iframe checks separately from local
   evidence. Never use an invented project ID as deployment configuration.

## Concrete implementation choices

- Continue the clean, unmerged `feature/sanity-cms` branch, already based on
  `development-Area`; include its existing design/plan commits in the same review.
- Native Node request/response types keep the four API handlers thin. Server code
  lives outside the frontend; browser and server share only query contracts.
- A host-only `__Host-portfolio-preview` cookie contains an HMAC-authenticated
  project/dataset/drafts binding and expires after one hour. No draft cache or
  local storage. Verify exact payload shape and bounded input sizes.
- Phase 0's discipline check lives inside the authenticated preview panel, without
  adding a public route or changing the Work filter before Phase 1.
- Fail closed for unavailable session verification; public static pages still
  work without CMS environment configuration.
- Browser requests receive only data, mode, and generic errors. Credentials and
  preview secret URLs are never application-logged.
- Studio and frontend build independently; assemble Studio under `dist/studio`
  after the frontend build. Route APIs and Studio before the SPA fallback.

## Live prerequisites

Dev requested a new personally owned Sanity project on 2026-10-31. Provisioning
requires an authenticated Sanity CLI/browser session. Record actual ownership,
entitlements, datasets, origin, and read-token configuration in setup evidence.
Do not claim Phase 0 complete before the real draft-isolation and browser matrix
in the parent plan passes.
