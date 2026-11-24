# Sanity session handoff

## Phase 3 review gate — 2026-11-24

PR #14 merged into `development-Area` at `d388558`. Phase 3 branched there as
`feature/sanity-about`. Review its PR before merging. After authorization and a
confirmed merge, fetch integration and start Phase 4 on a fresh branch.

About now owns three headings, the lead, biography paragraphs, ordered facts,
toolkit groups and principles in one singleton. Home displays its selected facts
in authored order. The rest of Home, including the hero, still uses its original
source. Settings and the persistent shell follow in Phase 5.

The development schema deployed and the guarded importer created one document in
`oir24qey/development`. The rerun skipped the singleton with zero differences.
The signed HTTP check showed the revised draft lead and Home fact in preview,
confirmed published origin/CDN isolation, checked exit, and removed the temporary
draft using a revision guard. See the [progress log](phase-3-migration.md),
[rerun report](fixtures/phase-3-rerun-report.json) and [verification](verification.md).

## Continue from here

1. Read `AGENTS.md`, the approved design/plan and verification. Follow the same
   branch, checklist, checks, evidence, handoff and review cycle for each phase.
2. Phase 4 covers the editable three-line hero and emphasis, Home copy and CTAs,
   and ordered project references. Preserve the original line containers and
   motion. Verify delayed font resolution, cleanup across revisions and unpublished
   reference handling. Phase 5 covers settings and the persistent shell.
3. Recheck browser access and Vercel authentication before staging. The local
   browser access host was unavailable and Vercel rejected the current CLI token.
   Human sign-in/iframe cookies, responsive and reduced-motion visuals, real GSAP
   cleanup and staging Functions/routing/log handling still need evidence.
4. Prepare separate frontend and dataset rollback points, a production backup,
   migration reports and staging verification in Phase 6. Obtain explicit user
   approval before production writes, production deployment or DNS changes.

## Working boundaries

Use the existing CLI login and development dataset through Phase 5. Review
source-key conflicts and editor differences. Imports share a lock and skip
existing records by default. Never put server or import tokens in browser/Studio
variables. Preserve the stash, frozen export, routes, tokens and motion core.

From the root, run `npm run typegen`, `npm run build:deploy` and
`npm run lint -- --ignore-pattern design-export`. Use `npm run dev:preview`
for HTTPS at port 3000 after checking for an existing listener. The [setup
guide](setup.md) covers Studio, authenticated HTTP checks and credential boundaries.
