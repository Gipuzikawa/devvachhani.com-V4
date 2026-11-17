# Sanity development setup

Phase 0 supplies Studio, typed transport and authenticated preview. Portfolio
pages still deliberately read `src/data/content.ts`; migration starts in Phase 1.

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
visible there, while the Work archive still uses its existing static data.
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
