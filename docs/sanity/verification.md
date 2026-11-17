# Phase 0 verification

Status: local implementation verified; browser/deployment acceptance remains open.

## Evidence from 2026-11-17

- 36 automated tests passed: session expiry/tampering/rotation/binding, redirects,
  query restrictions, same-origin exit, failure redaction, helper diagnostic
  protection, published transport and stale-request/draft-exit behavior.
- Frontend, Studio and server type checks passed. Both browser builds passed.
- Combined deploy build passed, including assembly of `dist/studio` and a scan
  confirming neither configured server credential appears in browser output.
  TypeGen regeneration produced identical output. Maintained-code lint passed;
  the frozen export retains pre-existing warnings when included in lint.
- Account-backed HTTPS smoke check passed against project `oir24qey`, development:
  official secret validation, signed session, real unpublished draft reads,
  token-free public exclusion, private/no-store, exit cookie clearing, six portfolio
  deep links, nested Studio and unknown API 404 precedence.
- Browser access host unavailable. No browser sign-in, screenshot, Chrome/Safari
  iframe-cookie, responsive or reduced-motion result is claimed for this change.
- No production import, publishing, Vercel deployment, DNS or branch merge performed.
- `fixtures/content.ts.snapshot` preserves the unchanged active static source for
  later migration/rollback. Studio React was updated to 19.3.1 to satisfy the
  installed Portable Text editor's peer requirement; frontend React is unchanged.

The 2026-10-31 secret-validation failure did not recur with the preview server
running with network access. The current end-to-end HTTP test passes; the old
failure's precise underlying exception was intentionally not logged.

## Remaining acceptance checks

1. On Chrome and Safari, sign into `/studio`, enter Presentation and standalone
   preview, read the unpublished discipline, refresh, expire/re-enter and exit.
2. Verify all six routes at desktop and 375px, normal and reduced motion; exercise
   Work filters/layout, article TOC and Contact. Check console and motion cleanup.
3. On staging Vercel, verify Function bundling, API/Studio/SPA precedence, exact
   origin/env alignment, no-store/noindex headers, Studio registration, and access
   log handling of secret URLs. Test Vercel CLI dev if using that development path.
4. Review the full diff and merge only through a human-reviewed PR into
   `development-Area`. Do not begin Phase 1 on an unmerged phase branch.

## Dependency limitations

The compatible root dependency security fixes from the initial implementation
were applied without forced major upgrades. Sanity Studio's CLI dependency tree
reported upstream advisories; no forced downgrade of Sanity was applied. Consult
the current `npm --prefix studio audit` output before deployment; a browser build
does not demonstrate those build-tool advisories are resolved.
