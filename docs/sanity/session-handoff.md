# Sanity session handoff

## Phase 4 review gate — 2026-11-26

PR #15 merged into `development-Area` at `b221438`. The Phase 4 worktree started
there as `feature/sanity-home`. Review and merge the Phase 4 PR before fetching
integration and branching Phase 5.

Home now reads its hero, links, section copy and featured project references
from Sanity. About supplies the facts selected for Home. The hero remounts when
its own document revision changes. The featured list also tracks project revisions
and archive positions.

The development schema deployed and the guarded importer created one Home
singleton. Its rerun skipped it with zero differences. Live signed preview and
public isolation passed. The primed Home query was still stale at the end of the
90-attempt window and later matched origin. See the [progress log](phase-4-migration.md)
and [verification record](verification.md).

## Continue from here

1. Read `AGENTS.md`, the approved design and plan, and verification. Phase 5
   migrates site settings and the persistent shell. Start on a fresh branch
   after Phase 4 receives human review and is merged.
2. Vercel CLI and MCP authentication were verified. Select and link the portfolio
   staging project during Phase 6. Recheck browser access for Studio sign-in,
   iframe cookies, narrow/wide layouts, reduced motion and real GSAP cleanup.
3. Prepare separate frontend and dataset rollback points, a production backup,
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
