# Goals

## Goals

- Present Dev's best STEM/engineering projects and writing in a way that reads as intentional and
  scholarly, not templated.
- Give each real project a detail page that narrates the work (problem → approach → build → test →
  result), once a reusable template exists.
- Give the site a living "Writing" section with real essays, once they're written.
- Move editorial content into Sanity so projects and writing can be maintained without source-code edits.
- Rework the homepage animation so its opening experience remains expressive while serving the portfolio's content.
- Ship a cohesive motion system — one shared timing/easing vocabulary — rather than a grab-bag of
  effects.
- Get the site onto a real domain/host so it can actually be shared with admissions/research
  contacts.

## Success criteria

- A visitor unfamiliar with Dev's work can tell, within the first screen, what kind of engineer he
  is and what he's built.
- No placeholder content is ever presented as real — every placeholder page is clearly labelled
  until real content replaces it.
- `npx tsc -b --noEmit`, `npm run build`, and `npm run lint` are clean before any merge.
- Motion fully degrades to static, readable content under `prefers-reduced-motion`.

## Non-goals

- No bespoke backend or database — Sanity will be the managed content platform.
- No SSR/SSG framework migration — it stays a Vite SPA.
- No invented logo/icon — the plain serif wordmark + cobalt tick is deliberate; a real brand asset
  would have to come from Dev, not be assumed.
