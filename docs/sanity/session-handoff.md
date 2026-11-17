# Sanity session handoff

Checkpoint: 2026-11-17. This handoff accompanies PR #13. Verify its actual merge
state and the current repository before starting; do not resume from an old branch
or infer acceptance from a merge alone.

## Read first

1. `AGENTS.md` and `docs/build/{workflow,git-etiquette,conventions,running}.md`.
2. `docs/superpowers/specs/2026-10-07-sanity-cms-design.md`.
3. `docs/superpowers/plans/2026-10-07-sanity-cms.md` (Phase 2 is next).
4. `docs/sanity/{verification,setup,content-inventory}.md`.

## Current implementation

| Area | State |
| --- | --- |
| Phase 0 | Studio, generated types, published transport, signed preview API and controls implemented |
| Phase 1.1 | Project/Work schemas and guarded import implemented; seven development seed records imported |
| Phase 1.2 | Work/project detail pages read Sanity; ID filters, responsive images and revision-keyed motion boundaries implemented |
| Later domains | Articles/Writing, About, Home and shell/settings still static |
| Production | No production import, website deployment or DNS cutover performed |

PR #11 merged at `abd06cd`; PR #12 merged at `ade1c86`. PR #13 contains the
project-page integration (`5d3153e`) and its evidence (`eb551f3`), plus this handoff
documentation. Integration branch: `development-Area`; release branch: `main`.

The user explicitly requested merging PRs #11–#13 and reused `feature/sanity-cms`
for the previous work. For the next phase, start a fresh feature branch from the
updated integration branch, such as `feature/sanity-writing`, under the normal
repository workflow. Do not force-push or directly commit to the integration branch.

## Validation evidence and limits

- Last implementation check: **65 tests passed**, frontend/server/Studio checks and
  combined build passed, TypeGen regeneration unchanged, maintained-code lint and
  configured-credential bundle/staged scans passed. Documentation-only handoff
  changes do not establish a new browser or service verification result.
- Live development checks passed for seeded archive/F-35 adapters, unpublished
  exclusion, signed archive/detail preview, fresh-origin publication, subsequent
  private draft isolation, exit and unauthorized reads.
- A primed public CDN query stayed stale through 65 polling attempts despite a
  correct uncached origin. The live workflow script flags this with nonzero exit
  status. **CDN invalidation timing remains unverified**; do not call the complete
  publication/CDN acceptance matrix passing.
- Browser access host was unavailable. Actual Chrome/Safari sign-in and iframe
  cookies, desktop/375px/reduced-motion behavior, console errors and accumulated
  GSAP triggers remain unverified. DOM tests stub motion and cannot prove them.
- Vercel staging, routing/Function behavior on Vercel, exact deployment origins,
  Studio registration and host handling of secret URLs still need verification.
- Studio's last audit reported 16 moderate and 3 high upstream advisories; recheck
  current output. No forced downgrade or major dependency fix was applied.

## Service/data boundaries

- Sanity project: **`oir24qey`**, `devvachhani.com portfolio`; Dev is its sole human
  administrator as verified during setup. Datasets: public `development` and
  `production`. All completed imports/tests used **development only**.
- Seven imported records: 3 projects, 3 disciplines and the `workPage` singleton.
  `fixtures/phase-1-rerun-report.json` records actual IDs/revisions/hashes. Live
  rerun created 0 records, skipped 7 and found 0 differences.
- F-35 detail remains visibly placeholder content. Other two cards keep detail
  disabled and link to `/work`. Do not invent their detail pages or new prose.
- The separate Phase 0 smoke discipline is an unpublished test, not an archive
  discipline. Project-domain tests create disposable records and clean up only
  their owned IDs; seeded/editor documents are untouched.
- Ignored root/Studio `.env.local` files were configured for local development.
  Do not print tokens, signing secrets, cookies or preview-secret URLs. Read tokens
  and signing secrets stay server-only; no write/import token belongs in a bundle
  or Vercel deployment environment. Use the existing CLI auth where available.
- Never apply/drop `stash@{0}` wholesale. `design-export/` remains frozen and must
  not be edited or imported at runtime.

## Relevant implementation files

- `src/sanity/queries.ts`, `queryRegistry.ts`, `sanity.types.ts`: three registered
  queries; only the project detail query accepts a bounded slug.
- `ContentProvider.tsx`, `PreviewProvider.tsx`: cancellable requests, mode/route
  boundaries, same-mode refresh, independent session polling and expiry/exit.
- `projectAdapters.ts`, `images.ts`: strict UI contracts and responsive image URLs.
- `src/pages/{Work,ProjectPage}.tsx`: data containers mount resolved animated views.
  `useContentLayout` refreshes geometry after fonts/images; plugin access is through
  `src/motion/core.ts`. No duplicate GSAP registration or reduced-motion checks.
- `server/preview/`, `api/preview/`: official Sanity-secret validation, HMAC sessions,
  query allowlist, origin/redirect restrictions and private/no-store responses.
- `studio/schemaTypes/`: project/Work/discipline schemas and shared content objects.
- `scripts/sanity/`: snapshot transforms, matching, shared lock, skip/report and
  reviewed revision-guarded updates. Current runner/CLI deliberately allow Phase 1
  development imports only; extend explicitly for Phase 2 instead of bypassing guards.

## Next implementation: Phase 2 Articles and Writing

First assess the open CDN/browser/staging checks. Resolve what the available
environment permits and keep the rest explicit while progressing independent work.
Then follow the existing Phase 2 plan:

1. Model article metadata and a Writing singleton, with restricted Portable Text
   paragraphs/headings, marks, safe links/lists, figures and pull quotes. Keep
   content maturity separate from Sanity publication state.
2. Snapshot and convert the existing article plus three planned-writing entries.
   Preserve heading IDs `overview`, `development`, `testing`, `ahead`, the drop-cap
   flag, figure order, placeholder notice and six-minute reading-time override.
   Store an ISO date and preserve the current displayed date.
3. Extend the guarded importer in development. Match source keys, preserve editor
   drafts/changes, use returned document IDs for references and stable array keys,
   and require reviewed source hashes/revisions for updates. No replace-all import.
4. Add generated queries, registry entries, adapters and `@portabletext/react`
   rendering. Preserve rich marks/lists/safe hrefs rather than flattening strings.
   Keep body text static, TOC/progress behavior and async motion cleanup intact.
5. Verify source parity, incomplete drafts, unsafe-link rejection, async route
   behavior and real draft/publish/exit isolation. Report local/DOM/HTTP checks
   separately from browser/CDN/deployed checks. Update evidence and open a PR
   against `development-Area`; do not assume permission to merge future PRs.

Keep the Vite SPA, existing routes/tokens and separate Studio install. No framework
migration, homepage animation redesign, new branding or speculative project templates.

## Commands

```sh
git status
git log --oneline -5
gh pr view 13
npm run studio:build
npm run dev:preview
npm run test
npm run server:check
npm run studio:check
npm run typegen
npm run build:deploy
npm run lint -- --ignore-pattern design-export
```

The combined preview server is `https://localhost:3000`, with Studio at `/studio`.
Check whether port 3000 is already in use before launching another process. The
generated certificate is untrusted; the user handles browser security warnings.
See `setup.md` before rerunning account-backed smoke scripts. The project workflow
test can publish a disposable record to development and may return nonzero solely
for the documented CDN timing check; its output distinguishes that pending result.

## Copyable next-session prompt

Continue the Sanity CMS migration in this repository. Read AGENTS.md,
docs/sanity/session-handoff.md, the approved Sanity design/plan under
docs/superpowers/, and docs/sanity/verification.md first. Verify PR #13's merge
state, fetch development-Area and check branch/status/history before writing code.
Start a fresh feature branch from the integration branch for the next phase.

Phases 0 and 1 are implemented; Work/project pages use Sanity. Articles/Writing,
About, Home and shell/settings remain static. The next implementation is Phase 2:
Articles and Writing using Portable Text, guarded development import, typed queries
and rich rendering that preserves the existing TOC IDs, placeholder state, drop cap
and reading-time override. Follow the committed workflow and preserve Vite, routes,
motion/tokens, frozen design-export and existing editor data.

Last implementation checks passed 65 tests and all local builds/checks. Browser/
staging checks are unavailable/unverified, Studio dependency advisories remain,
and primed CDN invalidation stayed stale despite successful origin publication.
Assess those items first, resolve what the environment permits, and keep limitations
explicit while progressing useful independent implementation. Use project oir24qey,
dataset development only; do not expose credentials, overwrite editor records, deploy
production or merge a future PR without authorization. Finish with verification,
updated docs and a PR targeting development-Area. Keep responses concise.
