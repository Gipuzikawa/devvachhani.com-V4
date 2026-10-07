# Running

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

No automated test suite exists — verification is `tsc` type-checking plus manual browser checks
(see `docs/context/status.md`).

## Lint

```bash
npm run lint
```

Runs oxlint.

## Deploy

TODO: no hosting target chosen yet. `npm run build` produces a static `dist/` that any static host
can serve; the host and custom-domain DNS decision are still open (see `docs/context/status.md`).

## Environment variables

None — the site has no backend, API keys, or runtime configuration.

## Services

None — no CMS, no backend, no external API dependency. Fonts are self-hosted (`public/fonts/`), not
loaded from a CDN.
