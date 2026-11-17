# Phase 1.2: connect project pages

Continue on `feature/sanity-cms`, fast-forwarded to the PR #12 merge `ade1c86`,
as requested by Dev. Implements task 1.2 of the agreed CMS plan.

1. Add named archive/project queries, generated types and bounded slug parameters
   to the shared browser/server allowlist. Archive order supplies stable numbering.
2. Add strict adapters for successful, empty and incomplete data. Work settings,
   discipline IDs and project metadata replace static imports on these two routes.
   Other domains remain static deliberately. Failures never trigger slug redirects.
3. Mount existing animated views only after successful resolution. Key views by
   relevant content IDs/revisions. Keep stable data mounted during same-mode refresh,
   abort stale route requests, and erase draft snapshots on exit/expiry. Session
   polling verifies authentication without causing content refresh/animation replay.
4. Use the official image URL builder for responsive cropped/hotspot images, with
   authored aspect ratios, dimensions, lazy loading and separate caption/alt text.
   Preserve all seven placeholder plates. Refresh geometry after fonts/images settle.
5. Add adapter/parity, missing/partial-draft, query-boundary, route-state, image and
   async refresh tests. Verify TypeGen/build/lint and real development reads, keeping
   browser/staging evidence distinct. No additional project templates, content
   rewrites, article migration, production import or deployment.

Unknown/disabled detail redirects only after a successful empty query. An incomplete
preview is explicitly labelled and contains no invented project narrative. Public
invalid content shows a content error; it never silently falls back to TypeScript.
