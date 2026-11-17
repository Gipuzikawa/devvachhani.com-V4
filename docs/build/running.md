# Running

## Phase 0 commands (2026-11-17)

Install with `npm ci` and `npm --prefix studio ci`. Use `npm run studio:build`,
then `npm run dev:preview` for the portfolio, API and Studio on
`https://localhost:3000`. `npm run dev` remains the frontend-only development path;
with CMS environment configured, preview verification requires the combined server.

`npm run test` runs Vitest. `npm run server:check`, `npm run studio:check`, and
`npm run typegen` check/regenerate the new boundaries. `npm run build:deploy`
builds both apps and assembles `dist/studio`, with tests and credential scanning.
Vercel routing/configuration is in `vercel.json`; deployment is not yet verified.
Use the root and Studio environment examples, following
[Sanity setup](../sanity/setup.md). Tokens are server-only; import tokens stay local.

The frontend command reference follows.

## Dev

```bash
npm run dev
```

Starts the Vite dev server with hot reload.

## Build

```bash
npm run build
```

Runs `tsc -b && vite build` — type-checks, then produces a static `dist/`.

To type-check only, without a full build:

```bash
npx tsc -b --noEmit
```

## Test

Run `npm run test` for the Vitest suite. Browser acceptance is recorded separately
in `docs/sanity/verification.md`.

## Lint

```bash
npm run lint
```

Runs oxlint.

## Deploy

Vercel is selected. `npm run build:deploy` assembles both browser apps, with APIs
routed through Vercel Functions. Staging verification and custom-domain DNS remain open.

## Environment variables

Use root and Studio `.env.example` files; see `docs/sanity/setup.md` for the
public identifiers, exact origins and server-only credentials.

## Services

Sanity provides the Phase 0 discipline preview. Existing portfolio pages still use
static content. Fonts remain self-hosted in `public/fonts/`.
