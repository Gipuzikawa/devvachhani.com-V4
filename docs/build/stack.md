# Stack

### Vite 8

Build tool and dev server. Inherited from the original Claude Design → React migration; no reason
to swap it — fast HMR, minimal config, static `dist/` output that any static host can serve.

### React 19 + TypeScript ~6.0

Component model and type safety for a content-heavy, motion-heavy site. `StrictMode` is on in
`src/main.tsx`, which is why GSAP lifecycle goes through `@gsap/react`'s `useGSAP()` rather than a
raw `useEffect` — it handles the double-invoke cleanup StrictMode triggers.

The frontend and Studio keep separate installs. At this handoff the frontend uses
React 19.2.7 and Studio uses 19.3.1 to satisfy its editor's peer requirements.

### React Router (`react-router-dom` 7.x)

Real, crawlable routes (`/`, `/about`, `/work`, `/work/:slug`, `/writing`, `/writing/:slug`)
instead of the original design export's hash-router SPA — chosen so project/article pages are
independently linkable and indexable.

### GSAP 3.15 + `@gsap/react` 2.1

The motion engine — ScrollTrigger, SplitText, ScrambleText, Flip, CustomEase, all registered once
in `src/motion/core.ts`. Chosen for scroll-scrubbed choreography (pinning, parallax, per-line
reveals) that CSS transitions alone can't express, while keeping every animation's timing traceable
back to the same `DUR`/`EASE` tokens as the CSS design system.

### Plain CSS with custom-property design tokens

No Tailwind, CSS Modules, or styled-components. Chosen to match the original Claude Design handoff
(`design-export/`), whose components already used inline `style` objects referencing CSS custom
properties — extending that convention keeps the design system as the single source of styling
truth instead of introducing a second one.

### oxlint

Lint tool (`npm run lint`). Faster than ESLint for this project's size; not currently wired to
enforce the token/prop adherence spec documented at
`design-export/designSystem/_adherence.oxlintrc.json` (that file is intent documentation, not an
active gate).

### Content: Sanity with phased static domains

Sanity Studio 6.21.0 builds separately at `/studio`; the Vite/React SPA is retained.
Work/project, Writing/article, About and Home consume generated GROQ contracts and adapters. Published
browser reads use the Sanity CDN without tokens. Drafts use signed sessions and
allowlisted Vercel Functions. Credentials stay outside browser code.

Shell settings migrate in Phase 5. `@portabletext/react` renders restricted rich article bodies;
`@sanity/image-url` handles responsive crop/hotspot images.
Studio's required styled-components dependency is confined to Studio; the portfolio
keeps its existing plain CSS conventions. See `docs/sanity/setup.md`.

### Vitest + Testing Library

100 tests passed for Phase 2, covering import, security, rich rendering, adapters and DOM/async
behavior. DOM motion mocks do not replace browser acceptance. Studio's upstream
dependency advisories and the primed CDN timing observation remain documented.

### Hosting

Vercel is selected. The combined build assembles the frontend and `dist/studio`,
with API/Studio routing before SPA fallback. Staging, domain/DNS and production
dataset cutover remain pending; no deployment has been performed in this work.
