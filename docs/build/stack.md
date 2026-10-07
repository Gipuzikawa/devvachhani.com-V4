# Stack

### Vite 8

Build tool and dev server. Inherited from the original Claude Design → React migration; no reason
to swap it — fast HMR, minimal config, static `dist/` output that any static host can serve.

### React 19.2 + TypeScript ~6.0

Component model and type safety for a content-heavy, motion-heavy site. `StrictMode` is on in
`src/main.tsx`, which is why GSAP lifecycle goes through `@gsap/react`'s `useGSAP()` rather than a
raw `useEffect` — it handles the double-invoke cleanup StrictMode triggers.

### React Router (`react-router-dom` 7.9)

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

### Content: `src/data/content.ts`

Static TypeScript data, hand-written. No CMS or backend — chosen because the site's content
(projects, articles, About copy) changes rarely enough that a build step or hosted CMS would be
overhead without benefit.

### Hosting

TODO: no deployment target chosen yet (Vercel/Netlify/Cloudflare Pages or similar) — see
`docs/context/status.md`.
