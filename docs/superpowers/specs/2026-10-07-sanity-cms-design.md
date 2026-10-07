# Sanity CMS design

Status: agreed implementation direction, recorded on 2026-10-07. Dev confirmed
draft-and-preview, a new personally owned Sanity project with Dev as the only
editor, Vercel hosting with separately built Studio at `/studio`, phased full
editorial scope, and editable hero text preserving its current presentation.
The concrete delivery plan is [2026-10-07-sanity-cms.md](../plans/2026-10-07-sanity-cms.md).
Implementation and live-account setup have not started.

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
- Preview uses Vercel Node.js Functions alongside the static frontend, with local
  development through Vercel CLI. Keep server authentication/content logic outside
  `src/` and expose it through thin `api/` handlers. No SSR/framework migration is
  required. Studio remains a separate build, served at `/studio` on Vercel.

## Content model

| Type | Editorial content |
| --- | --- |
| `project` | Shared card metadata, slug, year, summary, tags, discipline references, content status, optional structured detail |
| `article` | Title, slug, dek, publication date, category, rich-text body, content status, optional related-project reference |
| `discipline` | Shared filter label and ordering; projects reference disciplines explicitly rather than inferring them from tags |
| `homePage` singleton | Hero statement, introduction, calls to action, ordered featured-project references, short About introduction |
| `aboutPage` singleton | Biography, facts, skill groups, principles |
| `siteSettings` singleton | Wordmark text, contact details, footer text, social links |
| `workPage` singleton | Archive heading and introduction; archive filtering/layout remain code-owned |
| `writingPage` singleton | Index heading, introduction, and ordered planned-writing entries currently shown as the on-the-desk list |

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

The Home hero uses three editable lines with inline text/emphasis only, matching
the existing three line spans and italic accent. Limit the editor to that shape;
keep masks, type scale, responsive styling, animation and pressure behaviour in
code. Include hero metadata labels and section-heading copy in the Home schema.
This enables copy editing without undertaking the separate animation rework.

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

Deliver the full scope in these phases. Each editorial phase adds its
schema, Studio fields, repeatable migration, typed public/preview query, rendering,
and acceptance evidence together. These are design-level delivery boundaries;
the file-by-file implementation plan is linked above.

| Phase | Deliverable | Acceptance boundary |
| --- | --- | --- |
| 0 — Foundation and preview | New owned project; proposed `development` and `production` datasets; standalone Studio; typed query registry; Vercel API/session handlers; Presentation navigation; reusable loading/error states | A development draft renders only with a valid preview session; forged/expired sessions fail; exit restores published data; no API token enters either browser build; frontend/Studio/server checks pass |
| 1 — Projects and archive | `project`, `discipline`, `workPage`; three cards; F-35 timeline/specs/reflections; figure assets and placeholder plates; archive filter/order | Current slugs, ordering and filter membership match; two deferred details remain unavailable; import rerun creates no duplicates; draft edits preview correctly; desktop/mobile/reduced-motion motion survives loading and navigation |
| 2 — Writing | `article`, `writingPage`; Portable Text renderer, planned-writing list, article metadata | Existing article/placeholder notice, section anchors, TOC, progress, drop cap and figures match; links/emphasis/lists render; incomplete drafts render safely; publish exposes new content and later drafts leave it unchanged |
| 3 — About | `aboutPage`; biography, facts with stable keys, skills, principles | All existing copy and ordering match; facts shared with Home retain identity; preview and published versions remain separate; editing content does not control styling or animation |
| 4 — Home | `homePage`; intro, editable hero copy, CTA labels/targets, ordered featured references, About introduction | Featured order follows the authored list; draft-only references do not leak publicly; missing/unpublished references render safely; hero presentation remains consistent without undertaking its separate animation rework |
| 5 — Shared settings | `siteSettings`; wordmark text, footer signoff, email/social links and footer text; persistent shell integration | Settings preview throughout all routes; links validate; footer contact anchor still works; persistent nav/footer motion cleans up when editable text changes; route definitions and cobalt brand styling stay code-owned |
| 6 — Production cutover | Production import/parity report, Vercel routing and environment configuration, Studio registration, editor instructions, rollback evidence | All six route patterns pass direct-link/navigation and browser checks; live draft/publish/exit works; production content matches the approved import; builds/lint/security tests pass; rollback uses a known deployment rather than silent static-content fallback |

Phases 0–5 run against the development dataset before production cutover. Studio
menus expose only the content types ready in the current phase. Until a domain
migrates, its existing static content is an intentional transitional source; a
domain already switched to Sanity never silently falls back on fetch failure.

Import tooling initially supports dry-run and create-missing modes, with source-key
lookup and generated ordinary IDs. Any update mode must show a reviewed diff and
use a revision guard; stop on editor-change conflicts. Production writes happen
only after the corresponding development parity checks pass.

## Acceptance checks

- Draft-only content and edits do not appear in public queries; publishing changes
  the public version, and subsequent drafts leave it intact.
- Invalid, expired, or forged preview sessions cannot return draft data. No Sanity
  API token appears in bundles, responses, URLs, or logs; preview responses are not
  cached. Preview-link secrets are removed on redirect and redacted from logs.
- All six routes retain their content and behaviour. Filtering, figures, article
  anchors/TOC, placeholder notices, mobile layouts, and reduced motion work.
- Async content arrival and preview changes initialise/clean up GSAP correctly;
  no stale SplitText spans or ScrollTriggers accumulate on route changes.
- Importing twice does not duplicate documents; missing optional fields and
  incomplete drafts render safely without making unavailable detail pages public.
- Frontend and Studio type checks/builds pass, alongside frontend lint and focused
  content/preview tests. Live-account verification is recorded separately.

## Confirmed decisions and setup inputs

Confirmed by Dev on 2026-10-07:

- Create a new Sanity project owned by Dev; Dev is the only initial editor.
- Use Vercel for website/preview API hosting.
- Deliver the full proposed editorial scope in development phases.
- Build Studio separately and serve it at `/studio` on Vercel.
- Make hero text editable while preserving the current presentation.

Recommended dataset names are `development` and `production`; public production
reads are token-free. Record the actual project ID, owner/account, dataset
visibility, and deployment origins during setup before any import. Provisioning
and deployment have not been performed during planning.

## Git handoff

PR #10 merged the roadmap and restored project guidance into `development-Area`
at `8fd4718`. `feature/sanity-cms` was rebased onto that merge; its draft-design
commit is `3a3cb10`. The 2026-10-07 review verified this branch, those commits,
and a clean working tree before making documentation changes. No further rebase
is needed for that handoff. Future PRs target `development-Area`; merges remain
human-reviewed and must not be performed by an agent.

`stash@{0}` preserves earlier project-refactor work, including
`content.generated.ts`. Do not apply or drop it wholesale: guidance/docs have
already been restored. Inspect individual changes only if that separate work
is resumed; the active CMS migration source is `src/data/content.ts`.

## Codebase review — implementation constraints

The draft matches the active Vite SPA and six route patterns. There are three
project cards, one F-35 detail, one placeholder article, and three planned-writing
entries. No Sanity dependencies, Studio, preview server, or generated-content
pipeline are active on this branch.

- **Content model:** retain one document for each project/article. Add explicit
  archive ordering and detail availability; a slug alone must not enable a detail
  page. Require detail fields only when detail availability is enabled. Convert
  the existing tag-based discipline assignments to references without changing
  which projects appear under each filter.
- **Articles and figures:** `ArticleBlock` currently holds plain strings, so
  Portable Text needs a new typed rendering contract rather than a string-flattening
  adapter. Preserve `overview`, `development`, `testing`, and `ahead` as explicit,
  unique section IDs independent of heading text. Use paragraph metadata for drop
  caps, ISO publication dates with frontend formatting, and a reading-time override
  to preserve the current example. Extend `FigureData` to distinguish alternative
  text from captions; preserve blank plates and reserved ratios.
- **Shared copy:** Home currently selects About facts by array position and its
  hero has hand-authored line spans/emphasis. Use stable fact keys with a homepage
  visibility flag. Keep hero wrapping and emphasis rendering in frontend code;
  use the bounded three-line text/emphasis shape above. Navigation routes,
  visual accents, typography, and motion remain code-owned.
- **Studio:** provide page/settings singletons first, then Projects, Articles,
  and Disciplines, alongside Presentation. Group project fields into Overview,
  Detail, Timeline, and Results. Exclude singleton types from generic create menus
  and disable duplicate/delete actions for them. Empty drafts may be saved;
  publication validation enforces required metadata and enabled detail fields.
- **Migration:** join existing card/detail records using source keys; keep the two
  archive-only projects unlinked and preserve placeholder notices. Include an
  inventory of page-local editorial copy. Default reruns to skipping existing
  records; updates require a reviewed diff and revision guard. Test reference
  resolution, reruns, and editor-change conflicts before production import.
- **Loading and motion:** current page hooks initialise on mount with synchronous
  data. Mount animated content after successful loading and clean up/reinitialise
  affected motion on preview revisions. Refresh ScrollTrigger after content/image
  layout settles. Never redirect to an index while a request is still loading or
  has failed.
- **Preview and hosting:** use a same-origin frontend, preview API, and separately
  built Studio at `/studio`. Validate Sanity's
  preview URL secret, then issue a signed, expiring HttpOnly session; a perspective
  cookie alone is not authentication. Serve drafts only through allowlisted API
  queries. Public browser reads remain token-free, explicitly published, and
  CDN-backed. Start with manual refresh; live editing remains a later enhancement.

The content shapes and phase boundaries above are the planning basis. Exact field
definitions and file-level tasks are specified in the implementation plan. Any
scope change discovered during implementation must be reflected in both documents.

## Sources

- [Sanity Vite integration](https://www.sanity.io/docs/visual-editing/build-a-visual-editing-integration)
- [Draft mode](https://www.sanity.io/docs/visual-editing/implementing-draft-mode)
- [Perspectives](https://www.sanity.io/docs/content-lake/perspectives)
- [Studio structure](https://www.sanity.io/docs/studio/structure-builder-cheat-sheet)
- [Studio deployment](https://www.sanity.io/docs/studio/deployment)
- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js)
- [Sanity TypeGen](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen)
- [Portable Text editor configuration](https://www.sanity.io/docs/studio/portable-text-editor-configuration)

Official documentation checked during the 2026-10-07 review. The framework-agnostic
visual-editing guide demonstrates a Node-rendered example with Vite assets; it is
reference material, not a drop-in integration for this React SPA. The draft-mode
guide uses a perspective cookie as its mode flag; the signed-session requirement
above is an additional application security decision. Cross-site Studio hosting
requires explicit cookie/partitioning tests; same-origin hosting avoids that
cross-site arrangement.

The Sanity best-practices skill informed the standalone Studio structure,
semantic schemas, document identity, Portable Text, and preview token handling.
