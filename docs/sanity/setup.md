# Sanity development setup

For a new session, start with [the handoff](session-handoff.md), then verify the
live branch and PR state. Historical acceptance evidence is in `verification.md`.

Studio, typed transport and authenticated preview serve Work/project, Writing/article,
About, Home and the persistent site shell. Edit the wordmark, contact email,
footer copy and ordered social links in Site settings.

Task 1.1 is now seeded in development. Project and Work editing schemas are
available, and task 1.2 has connected the page readers. See `content-inventory.md` for
the explicit import commands, rerun/manifest rules and development-only scope.

Phase 2 is also seeded in development: one article and the Writing singleton.
Use Articles to author essays and Writing index to edit the introduction/planned
entries. Insert a Heading object for h2/h3 with a stable section ID, and a
Paragraph with drop cap object for the initial rich paragraph. Ordinary paragraphs,
links, emphasis and lists stay in the Portable Text editor. Content maturity is
independent of Publish. Reading time derives at 200 words/minute unless overridden.
The example keeps its six-minute override and placeholder notice.

## Provisioned resources

- Project: `oir24qey`, **devvachhani.com portfolio**.
- Sole human administrator verified on 2026-10-31: Dev Vachhani.
- Public datasets: `development` and `production`. Phase 0 uses development only.
- Allowed local CORS origin: `https://localhost:3000`, credentials enabled.
- No production deployment or custom domain has been configured by this work.

Project management: <https://www.sanity.io/manage/project/oir24qey>.

## Install and run

Use Node 24.11.1 or a compatible version satisfying all installed package engines.
Studio has its own React 19.3.1 install to satisfy its editor's peer dependencies;
the frontend keeps its existing React dependency range.
Install the two dependency trees independently:

```sh
npm ci
npm --prefix studio ci
```

Existing local environment files contain development configuration. For another
machine, copy the root and Studio `.env.example` files to `.env.local`, supply
the actual project ID and development dataset, and set both origins to
`https://localhost:3000`. Never commit environment files with credentials.

The root server needs a dedicated Viewer token and a random signing secret of
at least 32 characters. Generate the latter with Node's
`crypto.randomBytes(32).toString('hex')`. Do not paste tokens into chat/logs.
`scripts/sanity/configure-local.mjs PROJECT_ID HTTPS_ORIGIN` can create a Viewer
token and write both local files directly using an authenticated CLI session;
it refuses to overwrite existing configuration. Inspect token metadata before
retrying a failed setup so duplicate credentials are not created accidentally.

```sh
npm run studio:build
npm run dev:preview
```

Open `https://localhost:3000/studio`. The HTTPS development server serves the
portfolio, API handlers and built Studio at the same origin. Its generated
certificate is untrusted: the user must handle any browser certificate warning,
or provide a trusted local certificate. A standalone Studio dev server is also
available via `npm run studio:dev`, but does not prove same-origin cookie behavior.
Rebuild Studio after editing its configuration/schema when using the combined server.

## Check draft preview

Sign in, open Disciplines and the unpublished **Phase 0 — unpublished draft check**
document, then use Presentation. Its location points to `/work`; expand the
discipline check in the draft-preview banner. The unpublished label should be
visible there. Project and Work changes also appear in their actual pages through
Presentation's document locations. Open **Home** to edit the three hero lines,
links, section copy and featured projects. Each hero line accepts plain text and
emphasized text runs. Reorder the project references to change the featured order.
Edit the shared facts under **About** and use each fact’s Home visibility toggle.
Refresh reloads draft data. Exit clears the cookie and reloads published mode.
Expiry requires re-entry from Studio. A failed session lookup never authorizes drafts.

Repeat the account-backed HTTP smoke check with the HTTPS server running:

```sh
cd studio
node node_modules/@sanity/cli/bin/run.js exec scripts/verify-preview.ts --with-user-token
```

This creates/reuses an unpublished development discipline, creates a short-lived
official preview secret, and verifies secret/session/content/public/exit boundaries.
It never publishes the test document or saves a write token. Test secret URLs and
cookie values remain in memory. It trusts only the generated localhost certificate.
HTTP success does not prove browser sign-in, iframe cookies or rendered motion.

The project-domain workflow test is `sanity exec scripts/verify-project-pages.ts
--with-user-token` from `studio/`. It uses a disposable development project to
check draft exclusion, archive/detail preview, publish and subsequent draft
isolation, then removes only its own test document and draft. Existing projects
are read only. Its publication check distinguishes the uncached origin from CDN
propagation; inspect the verification record for actual results and limitations.
The test returns a nonzero status if the primed CDN query does not refresh in its
window, even when the remaining origin/preview/exit checks pass. Its default is
65 polling attempts; `PORTFOLIO_SMOKE_CDN_ATTEMPTS` may set a bounded 1–180 attempt
window for local diagnostics. Browser acceptance is a separate check.

Repeat the Article/Writing workflow using `sanity exec
scripts/verify-writing-pages.ts --with-user-token` from `studio/`. It uses only
owned disposable development article IDs; it never edits seeded/editor records.
It checks public exclusion, signed index/detail preview, publish-then-edit and
exit, and separately measures the exact primed CDN query. Pending CDN propagation
returns nonzero; inspect `verification.md` instead of calling it a full pass.

From `studio/`, run `node node_modules/@sanity/cli/bin/run.js exec scripts/verify-about.ts --with-user-token`
with the local HTTPS server running. It compares the public CDN revision to the
development singleton and checks a draft lead and shared Home fact through the
signed API. It creates a draft only when that ID is free. Cleanup uses the created
revision so concurrent editor changes stop deletion and require manual review.

With the local HTTPS preview server running, test the signed Home route:

```sh
cd studio
node node_modules/@sanity/cli/bin/run.js exec scripts/verify-home.ts --with-user-token
```

The verifier creates two temporary development drafts atomically and deletes
them using their exact created revisions. An existing Home draft prevents the
creation. Add `-- --published-only` for a read-only origin and CDN check.

Run the site settings verifier after the guarded development import and with the
local HTTPS preview server running:

```sh
cd studio
node node_modules/@sanity/cli/bin/run.js exec scripts/verify-site-settings.ts --with-user-token
```

This compares the source seed, published origin and the exact CDN query. It
checks signed entry for all six route patterns and verifies that draft settings
stay private. The verifier creates the settings draft only if the ID is free and
cleans up using its exact revision. Use `-- --published-only` for a read-only
check, or `-- --prime` before an initial seed to prime the exact CDN query.
## Checks and deployment boundary

`npm run typegen` regenerates schema/query types. `npm run build:deploy` checks the
server, runs tests, builds the frontend and Studio, assembles `dist/studio`, and
scans browser outputs for configured server credentials. `npm run lint` includes
warnings in the frozen export; `npm run lint -- --ignore-pattern design-export`
checks maintained code separately.

Configure Vercel with the commands/routing in `vercel.json`. Root browser variables
use `VITE_`; Studio variables use `SANITY_STUDIO_`. These public IDs/datasets must
match server `SANITY_PROJECT_ID`/`SANITY_DATASET`. Set exact HTTPS `SITE_ORIGIN` and
Studio preview origin per deployment. `SANITY_API_READ_TOKEN` and
`PREVIEW_SESSION_SECRET` belong only to the server. Never deploy an import token.
Add only the exact intended origins to Sanity CORS; avoid broad domain wildcards.

Before staging, configure the host/analytics to omit preview secret query strings
from access logs. APIs send private/no-store, noindex and no-referrer headers;
these headers cannot redact logs already written by the host. Verify API and Studio
precedence on Vercel itself, Studio registration, iframe/standalone cookies and the
browser matrix in `verification.md` before calling Phase 0 complete.

Public content uses explicit published/CDN queries without a token. Draft content
requires a signed, one-hour, project/dataset-bound cookie and allowlisted server
queries. The cookie is Secure, HttpOnly, host-only, Path `/`, SameSite=Lax.
Rotating the signing secret invalidates sessions. Exit clears the browser cookie;
it does not maintain a server-side revocation list for previously copied cookies.
