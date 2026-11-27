# Sanity implementation verification

## Phase 5 — 2026-11-27

- GitHub confirmed PR #16 merged Phase 4 into `development-Area` at
  `8d0cee2`. Phase 5 started from that fetched commit in the isolated
  `feature/sanity-site-settings` worktree.
- Deployed the `portfolio` schema to `oir24qey/development` and verified that
  the registry contains all eight editorial document types. The dry run found
  one missing record and no drafts. Create-missing created `siteSettings`.
  The rerun skipped one, created and updated zero, and found zero differences
  or drafts. See the [revision and source hash](fixtures/phase-5-rerun-report.json).
- **Published HTTP and CDN:** The fresh origin matched the source. The exact
  CDN query returned zero records when primed before import and matched origin
  on the first post-import verification request. This observation leaves the
  exact propagation interval unknown.
- **Signed local HTTPS:** All six route entry paths returned clean redirects,
  including the About Contact hash. Each signed session returned private,
  no-store and noindex settings with edited wordmark, email, footer and socials.
  Token-free origin and CDN retained the published version. Exit cleared the
  cookie, a cookieless settings request returned 401, and revision-guarded
  draft cleanup succeeded. The six route responses served the portfolio HTML.
  A separate token-free origin check passed each route through its frontend
  content adapter.

- **Studio configuration:** Eight tests use the installed Sanity API to check
  five fixed singleton editors before Projects, Articles and Disciplines,
  creation-template and action protections, and Presentation across all six
  route patterns. Site settings has preview links to the four stable entry pages.
- **Automated:** All 214 tests in 19 files passed. The combined frontend,
  server and Studio deployment build passed. Its bundle scan found neither
  configured server credential. Maintained-code lint passed. TypeGen reproduced
  both generated files byte for byte, with eight queries and 39 schema types.
  The source scan found no active import of `src/data/content.ts`.
- **Local routing:** The Studio root and nested Site settings URL served the
  built Studio HTML and matched its JavaScript asset. The portfolio detail
  route served the portfolio HTML. An unknown API path returned 404.
- **Local Chromium:** With synthetic preview data in the portfolio app, a
  delayed Home response initially displaced the Contact footer. After the fix,
  both a direct `#contact` entry and the native Contact link kept the footer in
  the viewport through the layout change. Preview refresh after the reader
  scrolled away preserved their scroll position. A BrowserRouter regression
  covers repeat native Contact activation and switching to an article outline
  fragment. It failed on the earlier implementation and passed after the fix.
- **Browser and staging:** The browser access host was unavailable on both
  checks. Account-backed Studio sign-in, iframe cookies, the desktop/375px
  matrix and full browser motion checks are pending Phase 6.

## Phase 4 — 2026-11-26

- PR #15 merged at `b221438`. The Phase 4 feature worktree started from that
  integration commit.
- Deployed the Home schema to `oir24qey/development`. The dry run found one
  missing singleton. Create-missing inserted `homePage` with the three published
  project references. A rerun skipped it and found zero creates, updates,
  differences or drafts. See the [rerun report](fixtures/phase-4-rerun-report.json).
- The local HTTPS signed read showed edits to all three hero lines, resolved a
  draft-only project reference, and reported an unresolved reference. Published
  origin and CDN excluded draft data. The shared About query and preview exit
  passed, and cleanup removed the two temporary drafts under revision guards.
- The exact Home CDN query was primed before seeding and did not match the
  published origin within 90 attempts. A later read-only check matched the
  published revision on its first request. Exact propagation time is unknown.
  The full verifier subsequently passed with a current CDN response.
- **148 tests** passed on 2026-11-27. The combined frontend/server/Studio build and its
  configured-credential scan passed, and maintained-code lint was clean.
  TypeGen reproduced seven queries and 38 schema types byte for byte. Home
  lifecycle tests used GSAP and SplitText in jsdom with controlled fonts and a
  pressure stub. They verified revision ownership, cleanup, literal CMS labels
  and authored nonbreaking spaces during the animated split. The long-copy regression
  checks that the hero actions are visible at 2.5 seconds in the GSAP timeline.
- The browser access host was unavailable. Studio sign-in and iframe cookies,
  desktop/375px layout, reduced motion, and real GSAP teardown remain open.
- Vercel CLI and MCP authentication succeeded. The accessible Vercel account
  has no portfolio project and this checkout has no Vercel project link.
  Staging verification is pending Phase 6.

## Phase 3 — 2026-11-24

- GitHub confirmed PR #14 merged into `development-Area` at `d388558`. About
  and Home’s selected facts now share one registered query and the same singleton.
- The schema deployed to `oir24qey/development`. A no-write dry run found one
  missing record. Create-missing created `aboutPage`; its rerun skipped one,
  created/updated zero and found zero differences or drafts. See the
  [revision and source hash](fixtures/phase-3-rerun-report.json).
- **Live About HTTP** passed. Token-free CDN returned the published revision.
  The signed API returned the temporary draft lead and selected fact under
  private/no-store. Origin and CDN retained the published revision. Exit cleared
  the cookie, a cookieless read returned 401, and revision-guarded cleanup succeeded.
- **Live CDN publication** passed for both existing domain checks. The exact
  primed article query returned the published value after 37 attempts / 38 seconds.
  The project query also refreshed within the configured 180-attempt window.
  Both scripts passed the origin, subsequent private edit and exit checks and
  removed their owned documents. These measurements describe this run only.
  Initial attempts stopped at preview entry or local API availability. The
  successful checks used the restarted local HTTPS server and the existing Viewer token.
- **Local verification** passed 105 tests across 12 files, frontend/server/Studio
  type checks and maintained-code lint. The combined deployment build assembled
  both outputs and its bundle scan found neither configured server credential.
  TypeGen regenerated six queries and 34
  schema types byte-for-byte. The new DOM tests cover reordered Home facts,
  preview exit, incomplete drafts and About revision remounts with motion
  stubbed. Three Vitest workers timed out during a concurrent run. The full
  suite passed with `VITEST_MAX_WORKERS=2`; the four About/Home tests also
  passed separately.
- **Browser/staging** remain open. Browser inventory reported “The browser
  access host is unavailable”. Chrome/Safari Studio sign-in, iframe cookies,
  desktop/375px visuals, reduced motion and repeated refresh with real GSAP
  still require a browser. GitHub listed only github-pages deployment records,
  the checkout has no linked Vercel project and `vercel project ls` rejected
  the configured CLI token. No staging URL or staging routing/log evidence
  was obtained. Production cutover remains behind its separate approval gate.

## Phase 2 update — 2026-11-17

PR #13 is verified merged into `development-Area` at `b903566`. Phase 2 starts
from that integration commit on `feature/sanity-writing`.

- Articles/Writing now use Sanity. About, Home and shell/settings remain static.
  One article and one Writing singleton (three planned entries) were imported
  into `oir24qey/development`, after development schema deployment and a no-write
  dry run. The create-missing rerun created **0**, skipped **2**, updated **0**,
  and found **0 differences**. IDs/revisions/hashes are in
  `fixtures/phase-2-rerun-report.json`. Existing project/editor data was preserved.
- **100 tests pass** across 11 files. New coverage includes source copy/date/anchor
  parity, three ordered figures, drop-cap rich marks, strong/emphasis, safe links,
  ordered/unordered/nested lists, incomplete/duplicate drafts, phase/type/import
  guards, rapid slug navigation, refresh revision boundaries and exit isolation.
  DOM tests stub motion and cannot establish browser visuals or GSAP cleanup.
- Frontend/server/Studio type checks, both builds, combined build/Studio assembly,
  maintained-code lint and configured-credential bundle scans passed. TypeGen
  regeneration was byte-identical for schema/types (five queries, 31 schema
  types). The frontend dependency audit is
  clean; Studio still reports 16 moderate and 3 high upstream advisories.
- Real token-free development reads passed Writing/article adapter parity.
  `studio/scripts/verify-writing-pages.ts` passed unpublished exclusion from
  public index/detail, official signed preview entry, private/no-store draft
  index/detail, uncached-origin publication, subsequent private draft isolation,
  exit cookie clearing and unauthorized read rejection. It removed only its
  owned disposable article/draft. Seeded/editor records were read only.
- The exact article CDN query was primed before publication and remained stale
  through **65 attempts / 67 seconds**. The script intentionally exited nonzero
  for this pending CDN result even though the origin/preview checks passed.
  The project-domain check was also rerun: origin/draft/exit passed, with its
  primed CDN publication still pending. **CDN invalidation timing is unverified.**
- Browser inventory was retried: the browser access host is still unavailable.
  Chrome/Safari authentication/iframe cookies, desktop/375px/reduced-motion
  visuals, console and actual motion cleanup remain unverified. There is no
  staging deployment to test; Vercel routing/Function/cookie/registration/log
  acceptance remains open. No production data, deployment or DNS was changed.

The first project check reached preview entry but failed while the local server
was still running under restricted network permissions. Restarting that server
with the updated permissions restored the complete origin/preview workflow.
No credential or preview-secret URL was printed.

Native Sanity blocks do not support extra schema fields. Headings and drop-cap
paragraphs therefore use small owned objects containing one rich Portable Text
block plus metadata; adapters normalize them while preserving marks and links.
This keeps existing section IDs and the drop-cap flag editable in Studio.

The earlier checkpoint records below remain historical.

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
