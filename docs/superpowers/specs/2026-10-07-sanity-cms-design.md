# Sanity CMS design

Status: draft for review. Draft-and-preview workflow confirmed by Dev on 2026-10-07;
the remaining architecture recommendations below have not yet been approved.

## Purpose

Move portfolio content out of source-code editing and into Sanity Studio. Dev can
write, upload images, preview the actual portfolio, then publish when ready.
The homepage animation rework remains a separate roadmap item.

This direction supersedes the previous no-CMS constraint. Keep the Vite + React
SPA, existing routes, design tokens, and shared GSAP motion system.

## Editorial workflow

1. Create or edit content in authenticated Sanity Studio. Edits remain drafts.
2. Open Preview to render draft content using the portfolio's actual components.
3. Check desktop/mobile presentation, images, links, and placeholder notices.
4. Press Publish to replace the published version. Later edits create a new draft
   while visitors continue seeing the published version.
5. Exit preview to check the public version. Public pages query the published
   perspective explicitly; unpublished articles and projects are not listed.

Sanity's publication state is separate from content maturity: a published example
may still carry `contentStatus: placeholder` and show the existing notice.

## Repository and delivery

- Keep the portfolio at the repository root; add a standalone `studio/` with its
  own package manifest and schema files. Do not restructure the frontend merely
  to add the Studio.
- Add frontend client, GROQ queries, generated types, and content adapters in
  `src/sanity/`. Query results feed the existing page/component contracts.
- Use a public dataset for public portfolio content; drafts require authenticated
  access. Published content must contain nothing confidential.
- Public reads use the published perspective and Sanity CDN. Content publication
  appears on subsequent fetches after CDN propagation, without a site rebuild.
- Preview requires a small server/API runtime alongside the static frontend.
  Develop it locally first; select its hosting adapter once the website host is
  chosen. A static-file-only host cannot provide authenticated draft endpoints.

## Proposed content model

| Type | Editorial content |
| --- | --- |
| `project` | Shared card metadata, slug, year, summary, tags, discipline references, content status, optional structured detail |
| `article` | Title, slug, dek, publication date, category, rich-text body, content status, optional related-project reference |
| `discipline` | Shared filter label and ordering; projects reference disciplines explicitly rather than inferring them from tags |
| `homePage` singleton | Hero statement, introduction, calls to action, ordered featured-project references, short About introduction |
| `aboutPage` singleton | Biography, facts, skill groups, principles |
| `siteSettings` singleton | Wordmark text, contact details, footer text, social links |
| `writingPage` singleton | Ordered planned-writing entries currently shown as the on-the-desk list |

One project document supplies both its card and detail page, avoiding duplicate
titles/slugs. Projects can appear in the archive before a detail is ready; an
explicit detail-availability field controls linking. Preserve existing slugs.
Do not create the two deferred project templates during this integration.

Keep milestones, tool groups, specifications, and reflections as nested objects
specific to a project. Figures carry image assets, alternative text, captions,
and reserved aspect ratios; allow explicit placeholder plates without an asset.
Derive display index numbers from ordering where appropriate.

Use Portable Text for article paragraphs, headings, inline links, emphasis, and
lists, plus custom figure and pull-quote objects. Preserve section anchors using
stable block keys or explicit section identifiers, the TOC, drop caps, reading
progress, and figure motion. Render rich text rather than flattening it to strings.
Store editorial meaning in Sanity; keep typography, timing, animation, and layout
rules in frontend code. This is a structured editor, with no arbitrary page builder.

## Draft preview architecture

- Configure Studio's Presentation Tool with the frontend preview origin and
  document locations for Home, About, Work, and Writing.
- A server endpoint validates Sanity's preview URL secret, establishes an expiring
  authenticated session, and redirects to a validated same-origin portfolio path.
  A URL flag or a perspective cookie by itself must not grant draft access.
- An authenticated preview-content endpoint accepts an allowlisted query name and
  validated route parameters. It fetches the drafts perspective server-side with
  `useCdn: false`; it does not accept arbitrary GROQ from the browser.
- Store the draft read token only in server environment variables, never under
  `VITE_` or in Studio/client build configuration. Keep import/write credentials
  separate from the preview credential.
- Mark preview responses private and no-store. Set preview pages to noindex, show
  a visible preview indicator, and provide an exit action that clears the session.
- Start with reliable refresh-based preview. Add live updates and click-to-edit
  only after the authentication path and rendering parity pass verification.
  Validate the current loader API first: Sanity's mutation refresh events are
  deprecated, so new live-update logic must not depend on them.
- Restrict iframe/message origins. Test the Studio/preview cookie arrangement in
  an actual browser, including third-party-cookie restrictions.
- If click-to-edit uses stega, clean route slugs, comparison values, IDs, metadata,
  and text sent to GSAP SplitText/ScrambleText. Use explicit edit attributes for
  animated display text to avoid splitting invisible editing metadata.

## Migration and cutover

Import the current `src/data/content.ts` content, plus editorial copy still
hardcoded in pages. Preserve all three project cards, the F-35 detail and article,
the planned-writing list, About content, and placeholder flags. First import into
a test dataset and compare it with the current site before production writes.

Let Sanity generate ordinary document IDs. Store an explicit source key for each
imported record, look it up before create/update, and resolve references using
actual returned IDs. Use fixed IDs only for managed singletons. A repeated import
must not duplicate documents or overwrite later editor changes without review.

Keep the existing static content as a rollback reference until cutover is verified.
Avoid silently displaying it on CMS errors: show an intentional loading/error
state and retry action. Distinguish a failed fetch from a genuinely unknown slug.

## Implementation stages after design approval

1. Studio setup, document/object schemas, singleton structure, and validation.
2. Repeatable import dry run and parity report against current content.
3. Typed published queries, images, Portable Text rendering, and route data loading.
4. Authenticated draft session, preview queries, Presentation navigation, and exit.
5. Targeted tests, browser verification, documentation, and deployment configuration.

## Acceptance checks

- Draft-only content and edits do not appear in public queries; publishing changes
  the public version, and subsequent drafts leave it intact.
- Invalid, expired, or forged preview sessions cannot return draft data. No token
  appears in bundles, responses, URLs, or logs; preview responses are not cached.
- All six routes retain their content and behaviour. Filtering, figures, article
  anchors/TOC, placeholder notices, mobile layouts, and reduced motion work.
- Async content arrival and preview changes initialise/clean up GSAP correctly;
  no stale SplitText spans or ScrollTriggers accumulate on route changes.
- Importing twice does not duplicate documents; missing optional fields and
  incomplete drafts render safely without making unavailable detail pages public.
- Frontend and Studio type checks/builds pass, alongside frontend lint and focused
  content/preview tests. Live-account verification is recorded separately.

## Decisions to resolve before deployment

- Which hosting provider will serve the portfolio and preview API?
- Existing Sanity project/dataset, or a new project? Confirm account ownership,
  dataset names, Studio URL, and authorised editor before provisioning/importing.
- Review the proposed editable Home/About/settings scope and article block set.

## Git handoff

Roadmap additions are committed on `fix/codexSift` in PR #10, targeting
`development-Area`. `feature/sanity-cms` starts directly from `development-Area`;
after a human merges PR #10, refresh and rebase this feature branch onto the updated
integration branch before further implementation. Never merge either PR as an agent.
Existing project-refactor changes are preserved in the named stash created before
planning; restore them deliberately to avoid mixing that work into CMS commits.

## Sources

- [Sanity Vite integration](https://www.sanity.io/docs/visual-editing/build-a-visual-editing-integration)
- [Draft mode](https://www.sanity.io/docs/visual-editing/implementing-draft-mode)
- [Perspectives](https://www.sanity.io/docs/content-lake/perspectives)

The Sanity best-practices skill informed the standalone Studio structure,
semantic schemas, document identity, Portable Text, and preview token handling.
