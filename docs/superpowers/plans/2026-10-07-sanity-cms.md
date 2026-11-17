# Sanity CMS implementation plan

Date: 2026-10-07. Updated 2026-11-17: Phase 0 implemented locally; browser and
staging acceptance remain open. See `../../sanity/verification.md`. Phase 1 task
1.1 is implemented and seeded in development; task 1.2 and Phases 2–6 have not started.
Design: [Sanity CMS](../specs/2026-10-07-sanity-cms-design.md).

Dev owns the new Sanity project and is its only initial editor. Keep the Vite SPA
at the repository root. Build Studio separately in `studio/` and serve it at
`/studio` on Vercel alongside the preview API. Deliver the full editorial scope
in the phases below; retain current presentation, routes and motion.

## Delivery rules

- First deliverable: Phase 0, with a working authenticated preview smoke test.
  Each later phase supplies schemas, migration, queries, rendering and verification
  for one editorial domain. Do not publish a partially migrated production site.
- Use `feature/sanity-cms` for this planning handoff. Before implementation, check
  branch/status/history and whether this branch has merged. New phase branches
  start from `development-Area` after the previous PR is human-merged. All PRs
  target `development-Area`; agents never merge them.
- Keep `stash@{0}` and `design-export/` untouched. Snapshot active static content
  for migration/rollback; do not revive the stashed generated-content pipeline.
- Phases 0–5 use `development`; Phase 6 imports into `production`. Record actual
  IDs and origins during setup, never invent them. Dataset names are configuration
  defaults; confirm available account entitlements before creating both datasets.
- No automatic static fallback for a migrated domain. Transitional domains continue
  using their existing source deliberately until their phase switches them over.
- Each numbered task ends in a focused commit and its stated checks. Record local
  and live-account results separately. No framework migration, extra project
  templates, arbitrary page builder, live editing or homepage animation redesign.

## Phase 0 — Studio, data boundary and authenticated preview

### 0.1 Establish the owned project and build boundaries

Files: `studio/package.json`, its lockfile and TypeScript configuration,
`studio/sanity.config.ts`, `studio/sanity.cli.ts`, root `package.json`,
`.gitignore`, root/Studio `.env.example`, `tsconfig.server.json`.

1. Verify Node and current Sanity package/peer requirements, then pin compatible
   installed versions in lockfiles. Keep root and Studio dependency installs
   separate; do not restructure the existing app into a new workspace.
2. Create the project under Dev's account and verify Dev's access. Create public
   `development` and `production` datasets; document visibility and project ID.
   Drafts remain authenticated. Public content/assets must be suitable for public
   access. No extra editors or paid services without an explicit need.
3. Configure Studio CLI base path `/studio` and its workspace at `/`; verify the
   resulting path is `/studio`, not `/studio/studio`. Add root commands for Studio
   dev/build/check, TypeGen, server check, tests and combined deployment build.
4. Put project/dataset identifiers in browser configuration. Keep
   `SANITY_API_READ_TOKEN` and `PREVIEW_SESSION_SECRET` server-only. Keep
   `SANITY_IMPORT_TOKEN` local to import tooling; it must not reach deployments.
   Ignore environment files while committing credential-free examples.
5. Give the server its own type-check configuration covering `api/`, `server/`
   and shared query contracts; the existing app configuration covers only `src/`.

Acceptance: root/Studio installs and builds pass; server check runs; Dev can sign
in to Studio; no credentials are committed or included in the Studio config.

### 0.2 Build a minimal real schema and typed content transport

Files: `studio/schemaTypes/documents/discipline.ts`, `studio/schemaTypes/index.ts`,
`studio/structure/index.ts`, `src/sanity/{client,queries,queryRegistry,types}.ts`,
generated `src/sanity/sanity.types.ts`, `src/sanity/ContentProvider.tsx`,
`src/components/ui/ContentState.tsx`, root test configuration and focused tests.

1. Add `discipline` with `sourceKey`, label and sort order. This is the Phase 0
   smoke-test document and remains part of Phase 1, rather than a temporary
   content type exposed to the public site.
2. Use named `defineQuery` expressions. Configure TypeGen in `sanity.cli.ts` to
   scan `../src/sanity/` and emit types into the frontend; commit generated types.
   Keep draft fields optional and guard missing values at render boundaries.
3. Build a shared allowlist mapping query names to expressions and parameter
   validators. Browser published reads use `perspective: 'published'`, CDN and
   no token. Server preview reads reuse those expressions with `drafts` and no CDN.
   Pin an explicit supported API date rather than relying on defaults.
4. Add a content provider that resolves preview-session status, then selects the
   transport. Key requests by dataset, perspective, query and parameters; cancel
   or ignore stale responses after navigation. Do not persist drafts in browser
   storage or let cached drafts survive preview exit.
5. Supply loading, retryable failure, empty result and incomplete-preview states.
   Mount animated content only after data resolves. A failed request cannot be
   mistaken for a missing slug or trigger the existing unknown-slug redirect.
6. Add Vitest for focused logic/component tests; use fixtures for empty results,
   partially filled drafts, failed requests and out-of-order responses.

Acceptance: TypeGen output matches schema/query changes; published transport has
no token; stale requests cannot replace current-route data; fixtures distinguish
loading, failure and empty results. Existing static routes remain functional.

### 0.3 Implement the preview session and Presentation navigation

Files: `server/sanityClient.ts`, `server/preview/{session,redirect,handlers}.ts`,
`api/preview/{enable,session,content,disable}.ts`,
`src/sanity/PreviewProvider.tsx`, `src/components/layout/PreviewBanner.tsx`,
`studio/presentation/resolve.ts`, Studio config, `vercel.json`, server tests.

1. Enable validates Sanity's preview URL secret using the official helper, strips
   secret parameters, validates redirect origin/path against the six portfolio
   route patterns, and issues a signed HMAC session with a one-hour expiry.
   Bind it to the configured project/dataset and drafts perspective. Reject
   external/protocol-relative redirects and never trust request Host as the
   canonical deployment origin.
2. Verify signature and expiry for every session/content request. Use an HttpOnly,
   Secure, host-only cookie with Path `/` and SameSite=Lax for the agreed same-origin
   deployment. Cookie presence, a URL flag or a perspective value cannot authorize
   drafts. Rotating the signing secret invalidates outstanding sessions.
3. Content accepts only registered query names and bounded slug parameters; reject
   arbitrary GROQ, project/dataset overrides and raw/release perspectives. Return
   401 for invalid sessions and a generic upstream failure without credentials.
4. Set `Cache-Control: private, no-store` on preview responses. Disable clears the
   session, removes client draft state and reloads published data. Protect the
   exit POST with a same-origin check. Show a preview banner, refresh and exit.
   An expired active session shows an explicit re-entry state.
5. Configure Presentation's preview enable endpoint and document locations. Use
   explicit allowed origins. Start with manual browser refresh and a refresh
   control; no mutation-event live-refresh dependency or click-to-edit overlays.
6. Apply noindex metadata in preview and `X-Robots-Tag: noindex, nofollow` to preview
   APIs. Redact preview-link secrets and API tokens in application logs; ensure
   host analytics/access-log configuration does not retain secret URLs.
7. Verify local Studio/preview at the same origin via Vercel CLI and a development
   Studio proxy/static build. Use local HTTPS if browser Secure cookies require it.
   Configure `/api/` and `/studio` routing before the portfolio SPA fallback.

Acceptance: real development draft is visible only through a valid session;
missing, forged, tampered and expired cookies fail; redirect/query attacks fail;
exit removes drafts; headers prohibit caching; secrets are absent from bundles,
responses and application logs. Test Studio iframe and standalone preview in
Chrome and Safari. No temporary preview document is published on the portfolio.

## Phase 1 — Projects and archive

### 1.1 Model projects and introduce safe import tooling

Files: `studio/schemaTypes/documents/{project,workPage}.ts`, objects for figure,
milestone, tool group, specification, reflections and section heading;
`scripts/sanity/{source,transform,import,report}.ts`, import fixtures/tests,
`docs/sanity/content-inventory.md`.

1. Inventory `content.ts` and editorial copy in Home, About, Work, Writing, project
   detail and shell. Snapshot values into versioned migration fixtures, including
   placeholder status, labels, figure ratios and existing route/section IDs.
2. Project fields: source key, title, slug, summary, optional year, tags, discipline
   references, sort order, content status and `detailEnabled`. Its detail object
   holds intro, tools, skills, milestones, final figure, specs and reflections.
   Validate enabled details at publication; hidden fields are not access control.
3. Figures distinguish placeholder/image mode, caption, alternative text and
   positive aspect ratio. Require an asset and descriptive alt text for image mode;
   preserve current blank plates. Include project section-heading editorial copy.
4. Join F-35 card/detail into one document. Other cards have no enabled detail and
   retain `/work` destinations. Import discipline membership exactly as today.
5. Import runner supports explicit dataset, phase and `dry-run`/`create-missing`.
   Look up source keys before creating; fail on ambiguous matches. Generate ordinary
   IDs; use fixed singleton IDs. Resolve references using actual returned IDs in
   dependency order. Preserve array keys across repeated transforms.
6. Default reruns skip existing documents. If an existing source differs, report
   the difference rather than replace it. Implement updates only with a reviewed
   manifest containing expected revisions; fail on conflicts, preserve drafts and
   editor changes, and serialize runs to prevent duplicate-create races.

Acceptance: dry-run writes nothing; import produces three projects, three
disciplines and one archive singleton; F-35 data matches fixtures; a rerun creates
zero documents; simulated editor edits survive; ambiguous source keys fail closed.

### 1.2 Connect archive/detail pages and image rendering

Files: queries/registry/adapters, `src/types.ts`, `src/pages/{Work,ProjectPage}.tsx`,
`src/components/ui/Figure.tsx`, `src/sanity/images.ts`, relevant hooks/tests.

1. Map published/preview results to typed UI contracts. Derive entry/figure numbers
   from stable archive/body ordering, not whichever filtered list is visible.
2. Replace tag inference with discipline IDs. Preserve FLIP filter/layout behaviour
   and cards' fallback destinations. Add responsive Sanity image URLs, explicit
   dimensions, crop/hotspot handling, lazy loading and separate alt/caption values.
3. Split loading containers from animated views. Key views by content identity and
   relevant revision so refreshed data cleans up old SplitText/ScrollTriggers.
   Refresh geometry after image/font layout settles. Avoid rebuilding unrelated
   views for filter changes or background fetches.
4. Preserve current successful-empty unknown-slug redirects; fetching failures
   instead show retry. Incomplete preview detail shows a labelled incomplete state.

Acceptance: filters/order/cards match today; F-35 placeholder notice, timeline,
figures, specs and reflections match; deferred details remain unavailable; real
image fixtures reserve space; delayed loading, rapid navigation and reduced motion
work with no accumulating triggers. Draft/publish/exit passes for this domain.

## Phase 2 — Articles and Writing index

Files: `studio/schemaTypes/documents/{article,writingPage}.ts`, article body schema,
queries/adapters, import transforms, `src/components/content/ArticleBody.tsx`,
`src/pages/{Writing,ArticlePage}.tsx`, `src/types.ts`, tests.

1. Model article title, slug, dek, ISO publication date, category, content status,
   related-project reference and reading-time override. Derive reading time from
   text unless overridden; preserve the example's six-minute value on migration.
2. Configure Portable Text paragraphs, h2/h3, emphasis, strong, safe links, ordered
   and unordered lists, figure and pull-quote objects. Add explicit unique section
   IDs on headings and a drop-cap flag on paragraphs. Restrict links to approved
   relative/anchor/http/https/mailto shapes; no HTML injection or arbitrary embeds.
3. Convert existing blocks to Portable Text without losing copy, keys, section IDs
   `overview`, `development`, `testing`, `ahead`, drop cap or figure order. Import
   index headings/introduction and three planned-writing entries as nested objects.
4. Render using `@portabletext/react` and typed components. Extract TOC text only
   for TOC labels/reading-time calculation; rich article rendering retains marks.
   Implement drop caps without removing links/emphasis from the initial paragraph.
   Keep body text static; retain existing reading-progress/TOC reduced-motion rule.

Acceptance: one article/one Writing singleton/three planned entries match fixtures;
existing anchors and instant TOC jumps work; new rich-text fixtures retain marks
and list structure; unsafe links fail validation; incomplete drafts do not crash;
placeholder notice, figures and pull quotes survive preview refresh. Public draft
exclusion and publish-then-edit separation pass in the development account.

## Phase 3 — About and shared facts

Files: `studio/schemaTypes/documents/aboutPage.ts`, nested biography/fact/skill-group/
principle schemas, queries/adapters/import, `src/pages/About.tsx`, tests.

1. Model lead and biography paragraphs, section headings, facts with stable keys
   and `showOnHome`, skill groups, and principles. Store emphasis meaning where
   needed; do not expose CSS accents or animation timing. Derive display numbering.
2. Import all existing values; mark Focus and Looking for for Home. Replace Home's
   positional `facts[0]`/`facts[3]` lookup with keyed/shared About query data now,
   while Home's remaining local copy intentionally waits for Phase 4.
3. Connect About with resolved-data mounting and revision cleanup for its lead,
   toolkit and principle animations. Partial draft fields render labelled gaps.

Acceptance: About values/order match; reordering facts does not change the chosen
Home facts; both pages reflect draft edits only in preview; mobile/reduced-motion
and repeated refresh checks pass without changing animation design.

## Phase 4 — Home, including editable hero text

Files: `studio/schemaTypes/documents/homePage.ts`, restricted hero-line schema,
queries/adapters/import, `src/pages/Home.tsx`, focused hero/content tests.

1. Model exactly three hero lines as restricted inline text/emphasis content;
   require nonempty lines at publication. Include metadata labels, introduction,
   CTA labels/validated destinations, section headings, ordered featured-project
   references and short About copy. Render no paragraph wrappers inside line spans.
2. Import current wording and italic `one` exactly. Use the existing line containers,
   masks and GSAP choreography; preserve font-ready cleanup, pressure-loop disposal
   and reduced-motion rendering when revisions replace hero text.
3. Resolve featured references in authored order; omit unpublished/missing targets
   in public results. Keep incomplete targets visibly identified in preview. Derive
   card numbers from archive order, not the featured array's position.

Acceptance: migrated Home matches existing text/emphasis and featured order;
editing each line previews/publishes correctly; long copy wraps acceptably at 375px
and desktop; refreshing during the hero entrance leaves no pressure loops or
orphaned spans; unpublished references do not appear publicly. No animation rework.

## Phase 5 — Settings and persistent shell

Files: `studio/schemaTypes/documents/siteSettings.ts`, queries/adapters/import,
`src/components/layout/{Layout,SiteNav,SiteFooter}.tsx`, tests.

1. Model wordmark text, contact email, footer signoff/text and ordered social links.
   Preserve navigation route constants and visual brand styling in frontend code.
   Validate mailto/social links; preserve existing `#` placeholders honestly until
   Dev supplies real links. Bind footer Email href to the contact email.
2. Load settings at the persistent shell boundary. Preserve `#contact` and route
   transition/scroll behaviour. Revert/reinitialise footer split/decode when changed
   content arrives; do not replay nav entrance on every route change.
3. Assemble the final singleton-first Structure menu and Presentation locations;
   suppress singleton create templates and duplicate/delete actions. Verify all
   public/editorial paths read Sanity and remove active `content.ts` runtime imports.

Acceptance: settings edits preview on all routes; Contact still reaches footer;
email/social validation works; footer revisions clean up; nav persists without
unintended entrance replay; all eight document types are reachable through Studio.

## Phase 6 — Production import and Vercel cutover

Files: `scripts/build-deploy.mjs`, `vercel.json`, environment examples,
`docs/sanity/{setup,editor-guide,verification}.md`, project guidance/status docs.

1. Build frontend into root `dist/`, then Studio into `studio/dist/`; copy only the
   Studio output into `dist/studio/` after frontend build clears its output. Set CLI
   asset base `/studio`. Install both lockfiles reproducibly. Keep API/server code
   outside browser entry points; type-check and test them before deployment.
2. Route `/api/*` to Functions, `/studio` and `/studio/*` to Studio assets/index, and
   remaining portfolio deep links to the frontend index. Test nested Studio URLs
   and API error responses; the SPA catch-all cannot swallow either boundary.
3. Set production dataset consistently in frontend, Studio and preview server.
   Keep Vercel preview deployments on development data. Configure explicit origins,
   credentialed Studio CORS and CSP frame ancestors; avoid broad preview-domain
   wildcards. Set noindex for development deployments and authenticated previews.
4. Export/back up production before writing. Generate the production dry-run parity
   report from verified source fixtures; create dependencies first and resolve IDs
   separately for that dataset. Publish only the reviewed seed content. Existing
   editor-created records/conflicts require review, never wholesale replacement.
5. Deploy to a staging Vercel URL, register the external Studio and schema using
   current supported CLI flags with schema failure treated as failure. Repeat
   registration for the final `/studio` URL at custom-domain cutover. Verify domain
   ownership/DNS records before changing them.
6. Run the matrix below, then release using the repository's human-reviewed branch
   workflow. Record the known prior frontend deployment and CMS dataset export as
   separate rollback points; frontend rollback does not undo CMS edits.
7. Update `AGENTS.md`, architecture, stack, conventions, running, aim, goals/status
   and changelogs to describe actual implemented state. Document write-token
   separation, import conflict handling, preview expiry/exit and publish behaviour.

Acceptance: production parity, live preview/public isolation and all route/browser
checks pass. Dev can independently edit, preview and publish. Record deployment
URLs, dataset/project identifiers and measured results without credentials.

## Required verification and evidence

| Area | Check |
| --- | --- |
| Build/type safety | Frontend `npx tsc -b --noEmit`, build, lint; Studio check/build; server check; TypeGen regeneration yields no unexplained diff |
| Security | Forged/expired sessions, invalid secret, wrong dataset/perspective, arbitrary query and external redirect rejected; private no-store; no API credentials in built files or responses |
| Migration | Dry-run has no writes; create-missing rerun has no duplicates; references resolve; placeholders/anchors/order match; changed revisions prevent overwrite |
| Content rendering | Missing optional fields/incomplete drafts safe; marked text/lists/links preserved; image vs placeholder behaviour; failure distinguished from empty/unknown slug |
| Browser | Home/About/Work/F-35/Writing/article direct links, SPA navigation, filters/toggles, TOC/hash/contact links at desktop and 375px, normal and reduced motion |
| Async motion | Delayed/out-of-order fetches, rapid route changes, image load and repeated preview refresh; no stale splits, timers, pressure loops or accumulated triggers |
| Live editorial workflow | New unpublished document excluded publicly; draft overrides only preview; Publish updates public after CDN propagation; subsequent draft leaves public unchanged; Exit/expiry restores public access |
| Hosting | Studio assets/nested routes/API precedence, same-origin cookie inside Studio and standalone preview, production environment separation, Studio registration and rollback documentation |

Use meaningful automated tests for adapters/import/session/transport/rich-text
behaviour; browser checks verify real motion and cookies. Store dated evidence in
`docs/sanity/verification.md`. A mock test or local build does not prove deployed
token configuration, account access, CDN publication or iframe-cookie behaviour.

## Official references checked during planning

- [Sanity TypeGen](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen)
- [Portable Text configuration](https://www.sanity.io/docs/studio/portable-text-editor-configuration)
- [Studio structure](https://www.sanity.io/docs/studio/structure-builder-cheat-sheet)
- [Draft mode](https://www.sanity.io/docs/visual-editing/implementing-draft-mode)
- [Perspectives](https://www.sanity.io/docs/content-lake/perspectives)
- [Studio deployment](https://www.sanity.io/docs/studio/deployment)
- [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js)

Recheck installed package documentation before implementation. The signed session
is an application security choice beyond Sanity's example perspective cookie;
the agreed same-origin Studio deployment avoids the cross-site cookie arrangement.
