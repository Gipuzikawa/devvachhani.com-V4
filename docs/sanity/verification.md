# Sanity implementation verification

## Phase 1.2 update — 2026-11-17

PR #12 merged into `development-Area` at `ade1c86` on Dev's explicit request;
`feature/sanity-cms` was updated to that merge and reused.

- Work/archive and project detail now read Sanity. Home/About/Writing/article and
  shell domains remain static deliberately. No automatic fallback for migrated pages.
- 65 tests pass: adapter parity, stable numbering/ID filters, empty/error/incomplete
  route states, responsive images/alt text, query bounds, same-mode refresh,
  session polling/expiry/stale responses, plus all earlier import/security tests.
  DOM tests stub motion hooks and do not demonstrate actual GSAP performance.
- Frontend/server/Studio checks, combined deploy build, maintained-code lint,
  TypeGen repeatability and configured-credential bundle scans passed.
- Real development reads resolved the archive and F-35 through the new adapters.
  Unpublished records were excluded from token-free public reads, and archive/detail
  draft overrides resolved through the signed preview API.
- The fresh published origin returned the disposable record after the Actions API
  publication. A primed public CDN query remained stale through 65 polling attempts;
  CDN invalidation timing is **unverified**, not a passing publication check. The
  workflow test flags this with a nonzero exit status instead of silently passing.
- The remaining live checks passed: a subsequent private draft changed preview
  without changing the published origin; Exit cleared the cookie, and unauthenticated
  detail reads returned 401. The shortened diagnostic run still flagged the already
  observed CDN limitation and cleaned up its disposable record.
- Disposable checks use newly owned development IDs only and clean up their own
  published/draft pair. Seeded project/editor documents are never modified.
- Browser host remains unavailable. Chrome/Safari sign-in/iframe cookies,
  desktop/mobile/reduced-motion visuals and Vercel staging remain unverified.
  No production dataset, website deployment or DNS change was performed.

Sanity distinguishes the fresh API from the cached API CDN; this implementation
retains token-free published/CDN reads as designed. The timing observation above
does not establish a cache invalidation SLA. See the official
[API CDN reference](https://www.sanity.io/docs/content-lake/api-cdn).

The earlier task records below describe the state at those checkpoints.

## Phase 1.1 update — 2026-11-17

PR #11 merged into `development-Area` at `abd06cd` on Dev's explicit instruction.
The same `feature/sanity-cms` branch was fast-forwarded to that merge and reused
at Dev's request.

- Project/Work schemas and safe import tooling implemented; source/page snapshots
  and field mappings recorded in `content-inventory.md`.
- 46 tests passed, including ten import/parity/conflict tests. Server/Studio type
  checks passed; TypeGen regenerated 23 schema types and the existing query.
- Development schema deployment succeeded for workspace `portfolio`, dataset
  `development`. No production schema or dataset mutation was performed.
- Live dry-run found 7 missing source records and no conflicts. Create-missing
  imported 3 projects, 3 disciplines and the Work singleton. Actual generated IDs,
  revisions and hashes are in `fixtures/phase-1-rerun-report.json`.
- Live create-missing rerun created 0 records, skipped 7 and reported 0 differences.
  Lock acquire/release is the only mutation on that rerun. The Phase 0 unpublished
  smoke discipline remains separate and was not modified.
- Task 1.2 (frontend cutover/image rendering) is not implemented. Portfolio pages
  still read static content. Domain draft/publish/browser checks remain pending.

The original Phase 0 verification record follows.

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
