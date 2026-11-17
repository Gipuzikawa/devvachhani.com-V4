# Sanity session handoff

Checkpoint: 2026-11-17, Phase 2 Articles/Writing. Verify Git and the Phase 2 PR
before continuing. PR #13 merged into `development-Area` at `b903566`; this work
started from that commit on `feature/sanity-writing`. Do not stack Phase 3 on an
unmerged branch or infer browser acceptance from a merge.

## Read first

1. `AGENTS.md`, `docs/build/{workflow,git-etiquette,conventions,running}.md`.
2. `docs/superpowers/specs/2026-10-07-sanity-cms-design.md`.
3. `docs/superpowers/plans/2026-10-07-sanity-cms.md` (Phase 3 is next).
4. `docs/sanity/{verification,setup,content-inventory,phase-2-migration}.md`.

## Implemented state

- Phase 0: separate Studio, generated types, token-free published transport and
  signed authenticated preview API/controls.
- Phase 1: Work/project schemas, guarded import and resolved page readers. Three
  projects, three disciplines and Work singleton seeded in development. F-35
  detail remains placeholder; other cards remain archive-only.
- Phase 2: Articles/Writing schemas, guarded import, five registered typed queries,
  strict adapters and `@portabletext/react` rendering. One placeholder article and
  Writing singleton with three planned entries seeded in development. Rerun:
  0 creates, 2 skips, 0 updates, 0 differences; returned IDs/revisions/hashes in
  `fixtures/phase-2-rerun-report.json`.
- About, Home and shell/settings remain static for Phases 3–5. Production import,
  website deployment and DNS cutover have not occurred.

Native Sanity blocks cannot declare extra fields. `articleHeading` and
`articleParagraph` contain one rich text block plus section ID/level or drop-cap
metadata. The adapter normalizes these into rich blocks without losing spans,
marks or links. Ordinary paragraphs and nested lists use native Portable Text.
The original four anchors, three ordered placeholder figures, quote, date formats,
placeholder notice and six-minute reading-time override remain intact.

## Evidence and limitations

- 100 automated tests pass. Frontend/server/Studio checks, combined build,
  maintained-code lint and configured-credential bundle scans pass. TypeGen
  generates five queries and 31 schema types. DOM tests stub motion.
- Development schema deployment succeeded. Source import dry run, create-missing
  and rerun succeeded; no existing editor/project records were overwritten.
- Real Writing/article HTTP checks passed public unpublished exclusion, signed
  index/detail preview, origin publication, subsequent private draft isolation,
  exit cookie clearing and unauthorized read rejection. Only an owned disposable
  test article/draft was published and cleaned up. The project workflow was also
  rerun with origin/preview/exit passing.
- The exact primed article CDN query remained stale through 65 attempts over
  67 seconds. Both live scripts intentionally exit nonzero for their pending CDN
  observation. CDN invalidation timing remains unverified; do not describe the
  complete publication acceptance matrix as passing.
- Browser access host remains unavailable. Chrome/Safari sign-in and iframe
  cookies, desktop/375px/reduced-motion visuals, console errors and accumulated
  GSAP triggers remain unverified. There is no Vercel staging deployment to test.
  Routing/Functions/origins/registration and host secret-URL log handling remain open.
- Studio audit still reports 16 moderate and 3 high upstream advisories; root
  dependency audit is clean. No forced downgrade/major dependency fix was applied.

## Service and data boundaries

Use project `oir24qey`, development dataset only. Public production exists but
has not been imported. Preserve seeded/editor records and private drafts. Ordinary
IDs come from Sanity; fixed IDs are only for managed singletons. Both import phases
share `migrationLock.phase1`, source-key matching, skip/report reruns and reviewed
revision/hash updates. A stale lock requires ownership/process review, never theft.

Ignored environment files contain local development configuration. Never print
credentials, cookies or preview-secret URLs. Read/session credentials are server
only; no write/import credential belongs in a browser or deployment environment.
Use existing CLI authentication. Never apply/drop `stash@{0}` wholesale. Keep
`design-export/` frozen and retain the Vite SPA, routes, tokens and motion core.

## Relevant files and commands

- `src/sanity/{queries,queryRegistry,articleValidation,articleAdapters}.ts`:
  allowlisted queries, shared validation and rich UI contracts.
- `src/components/content/ArticleBody.tsx`, `src/pages/{Writing,ArticlePage}.tsx`:
  safe rich rendering, resolved/revision-keyed views, instant TOC/progress behavior.
- `studio/schemaTypes/objects/articleBody.ts` and documents `article`, `writingPage`.
- `scripts/sanity/{writingSource,writingTransform,import,store}.ts`:
  offline source conversion and guarded development import.
- CLI: `studio/scripts/import-phase1.ts` now explicitly supports `--phase 1` or
  `--phase 2`. The old filename is retained for compatibility. See the inventory.
- Live tests: from `studio/`, run `sanity exec scripts/verify-writing-pages.ts
  --with-user-token` or `scripts/verify-project-pages.ts`. Both own and clean up
  disposable development IDs. Inspect CDN and origin results separately.

Use `npm run dev:preview` for `https://localhost:3000`, with built Studio at
`/studio`. Check port 3000 first; do not start duplicate servers. The user handles
certificate warnings. Run `npm run test`, `npm run server:check`,
`npm run studio:check`, `npm run typegen`, `npm run build:deploy`, and
`npm run lint -- --ignore-pattern design-export` for local verification.

## Next session

First confirm the Phase 2 PR has been human-reviewed and merged into
`development-Area`, fetch it, then create a fresh feature branch for Phase 3 About.
Continue assessing the outstanding CDN/browser/staging checks without blocking
independent implementation. Phase 3 models biography/facts/skill groups/principles
and changes Home's positional fact lookups to keyed About data. Home's remaining
content waits for Phase 4. Follow the approved plan; preserve existing editorial
copy and async motion cleanup. Finish with evidence, updated documentation and a
PR against `development-Area`. Do not deploy production or merge future PRs
without authorization. Keep responses concise.
