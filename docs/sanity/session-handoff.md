# Sanity session handoff

## Phase 5 review gate — 2026-11-27

PR #16 merged Phase 4 into `development-Area` at `8d0cee2`. Phase 5 started
there on `feature/sanity-site-settings`. Dev reviews and merges this branch
through its PR to `development-Area`. Start Phase 6 from a fresh branch after
GitHub and the fetched integration branch confirm the merge.

The editorial routes and persistent shell read Sanity. Site settings owns the
wordmark, contact email, footer sign-off, both metadata lines and ordered social
links. The guarded development import created one singleton and the rerun had
zero changes. The signed local HTTPS verifier passed for all six route entries.
See the [Phase 5 progress log](phase-5-migration.md) and
[verification record](verification.md).

## Continue from here

1. Read `AGENTS.md`, the approved design and plan, and verification. Refine the
   Phase 6 checklist on the confirmed integration base before editing.
2. Recheck Vercel account and project inventory, and confirm the exact owned
   staging project. Deploy staging with the development dataset, register Studio
   and schema, and verify routing precedence, origin alignment and noindex.
3. Recheck browser access. Chrome/Safari Studio sign-in, iframe cookies, all
   six routes at desktop and 375px, reduced motion, navigation, anchors and
   browser motion cleanup need live evidence.
4. Verify the production backup and dry-run parity report. Resolve production
   references in that dataset. Present conflicts, exact targets and separate
   frontend/CMS rollback points before asking for approval. Dev must approve
   production Sanity writes, production deployment and DNS changes.
5. Finish the editor guide and project documentation after verification. Record
   production parity and Dev's ability to edit, preview and publish.

## Working boundaries

Use the existing CLI login. Review source-key conflicts and editor differences.
Imports share a lock and skip existing records by default. Keep server/import
tokens out of browser and Studio variables. Preserve the stash, frozen export,
routes, tokens and motion core.

Run `npm run typegen`, `npm run build:deploy` and
`npm run lint -- --ignore-pattern design-export` from the root. Use
`npm run dev:preview` for HTTPS on port 3000 after checking for an existing
listener. See [setup](setup.md) for account-backed verification.
