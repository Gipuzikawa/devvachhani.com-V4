# HANDOVER — Animation & Motion Pass for devvachhani.com

> **Before you write any code:** ask this Fable 5 session directly —
> **"Given this brief, how would you sequence the work, and is there anything here you'd push back on?"**
> Let it propose a plan and challenge the brief. Do not assign it a step-by-step order.
> This document gives the destination and the guardrails; the sequencing is yours to design.

This brief was drafted by a Claude session **with** direct access to the repo. Everything in the
"Current state" section was read from source, not inferred — where something *is* an inference, it's
flagged inline with **(inferred)**. Treat the repository as the source of truth over this document if
the two ever disagree; if you find a contradiction, surface it rather than silently following the doc.

---

## 1. Project goal

**devvachhani.com** is Dev Vachhani's personal portfolio — a STEM student presenting projects (and
eventually writing) to university and research programmes. The site's concept is an *archival index*:
catalogue the work like a scholarly bibliography, then bring it to life with motion.

Your job is to take the current, working-but-static prototype and give it **rich, cohesive, dynamic
animation, dynamic text** — the kind that makes a technical hiring manager stop and pay attention, while still
reading as intentional and restrained rather than a showreel of unrelated effects.

The bar is:

- **Cohesion over quantity.** Every section should move as if choreographed by one hand — shared
  timing, shared easing, shared entrance vocabulary. The design system *already ships motion tokens*
  (durations + eases; see §2). Those are your single source of truth for timing. A grab-bag of
  different effects with different feels is a failure even if each effect is individually nice.
- **Performance is a feature.** Transform/opacity-driven animation, no layout thrash, no jank on
  mid-range hardware. The site is content-light; there is no excuse for a heavy feel.
- **Accessibility is non-negotiable.** `prefers-reduced-motion` must be honoured everywhere, handled
  in *one* place (see §3). Motion must never trap focus, block reading, or gate content behind an
  animation that reduced-motion users never see.

The aesthetic is warm-monochrome, hairline-ruled, serif-voiced, with a single electric-cobalt accent.
Motion should feel like that palette: precise, editorial, confident — not bouncy, not playful, not
"startup landing page." Think *the way a well-made print index would move if paper could.*

---

## 2. Current state (audited from source — this is real, not boilerplate)

### Stack (from `package.json`)

- **Vite 8** + **React 19.2** + **TypeScript ~6.0**
- **react-router-dom 7.9** — real routes, `BrowserRouter` (see `src/main.tsx`)
- **gsap 3.15** — already a dependency and already in use
- Lint is **oxlint** (`npm run lint`), *not* ESLint. Build is `tsc -b && vite build`.
- **`@gsap/react` is NOT installed yet.** You will add it (see §3). Note this is React **19**, not 18
  — the brief that spawned this doc said "React 18 Strict Mode"; the repo is 19. `StrictMode` *is*
  enabled in `src/main.tsx`, so the double-invoke lifecycle concern is real and `useGSAP()` is still
  the right call — just verify `@gsap/react`'s peer range accepts React 19 when you install it.

### Folder structure (`src/`)

```
main.tsx            → BrowserRouter → App
App.tsx             → Routes: / /about /work /writing, all inside <Layout>
pages/              Home.tsx, About.tsx, Work.tsx, Writing.tsx
components/
  ui/               Button, TextLink, Tag, SectionHeading
  cards/            ProjectCard, ArticleCard   (ArticleCard built but unused — no Article route)
  layout/           SiteNav, SiteFooter, Layout, ScrollToTop
  motion/           Reveal            (dependency-free IntersectionObserver entrance primitive)
hooks/              useScrollReveal.ts, useParallax.ts   (both GSAP + ScrollTrigger)
data/               content.ts        (all real copy/projects/facts — no CMS)
styles/
  tokens.css        @import barrel
  tokens/           fonts, colors, typography, spacing, effects, base  (the live design tokens)
  global.css        app-shell CSS (smooth scroll, ::selection, canvas bg)
  index.css → imports tokens.css + global.css
types.ts            ProjectData, ArticleData, NavLink, FooterLink
```

`design-export/` at the repo root is the **frozen** original Claude Design handoff (`Home.dc.html`,
`support.js`, `designSystem/`). It is read-only reference — never edit it, never import from it at
runtime. It's useful to you for one thing: `design-export/designSystem/_ds_bundle.js` contains the
*original* compiled motion helpers and screen animations, and it documents design intent you may want
to honour (see "Motion history" below).

### Design system

- **Tokens are plain CSS custom properties**, split across `src/styles/tokens/*.css` and imported via
  `src/styles/tokens.css`. They are a direct copy of `design-export/designSystem/tokens/*.css`. **Edit
  the live copy in `src/styles/tokens/`, never `design-export/`.**
- **Motion tokens already exist** in `src/styles/tokens/effects.css` and are your cohesion anchor:
  - Durations: `--dur-fast: .18s`, `--dur-base: .4s`, `--dur-slow: .7s`, `--dur-reveal: .9s`
  - Eases: `--ease-out: cubic-bezier(.22,1,.36,1)`, `--ease-in-out: cubic-bezier(.65,0,.35,1)`,
    `--ease-emph: cubic-bezier(.16,1,.3,1)`
  - `--reveal-rise: 24px` (standard entrance translate distance)
  - The comment in that file explicitly says the eases "mirror the GSAP names used in scroll work."
    Keep CSS and GSAP timing in lockstep — if you introduce a new duration/ease for the motion system,
    add it as a token here so CSS transitions and GSAP tweens draw from the same well.
- **Color:** warm cream papers (`--paper-*`), warm off-black inks (`--ink-*`), one cobalt accent
  (`--cobalt` / `--accent`). Semantic aliases (`--text-strong`, `--bg-canvas`, `--border-hairline`,
  etc.) are what components reference — use those, not raw ramps.
- **Type:** `Newsreader` serif (voice) + `IBM Plex Mono` (labels/eyebrows/metadata), loaded from
  **Google Fonts CDN** (`src/styles/tokens/fonts.css`).
- **Component convention:** every component styles itself with **inline `style` objects referencing
  `var(--token)`**. No Tailwind, no CSS Modules, no styled-components. Hover/press states are done with
  local `useState` + inline transitions (see `Button.tsx`, `ProjectCard.tsx`, `TextLink.tsx`). Match
  this pattern; do not introduce a competing styling mechanism.
- There is a token/component **adherence lint spec** at
  `design-export/designSystem/_adherence.oxlintrc.json` — it documents the *intended* rules (no raw
  hex, no raw px, only the two fonts, exact per-component prop allowlists, and the full token
  registry). **(inferred)** It does not appear to be wired into the live `oxlint` run, so treat it as
  documentation of intent rather than an enforced gate — but it's the clearest statement of "what
  counts as staying inside the design system," so read it before you add anything new.

### Current animation approach

Everything today is entrance-and-hover; there is no scroll-driven choreography beyond simple reveals.

1. **`useScrollReveal(deps)`** (`src/hooks/useScrollReveal.ts`) — attach the returned ref to a
   container; every `[data-reveal]` descendant fades + rises (`opacity 0→1`, `y 26→0`, `expo.out`,
   `0.9s`, `ScrollTrigger start 'top 88%'`, `once: true`). Used on Home, About, Work. Registers
   ScrollTrigger via a module-level `registered` singleton; checks `prefers-reduced-motion` inline and
   bails; cleans up with `gsap.context().revert()`.
2. **`useParallax(strength)`** (`src/hooks/useParallax.ts`) — scrub-linked `y` drift. **Ported but
   currently unused** (was meant for the not-yet-built Article figure).
3. **`Reveal`** (`src/components/motion/Reveal.tsx`) — a *dependency-free* IntersectionObserver
   entrance wrapper that reads `--dur-reveal` / `--ease-emph` tokens. Kept as a fallback pattern.
   **This means two parallel entrance systems exist** (GSAP hook vs. IO component). Resolving that
   duplication into one coherent system is part of your remit (see Open Questions).
4. **Home hero** (`src/pages/Home.tsx`) — a one-off inline `gsap.timeline` (line-mask reveal of the
   headline via `yPercent`, then staggered meta/CTA fade). This is the most "designed" motion in the
   app and a good reference for the feel to extend everywhere.
5. **Component micro-interactions** — `Button` (press translate, hover bg), `ProjectCard` (lift +
   title→cobalt + arrow nudge), `TextLink` (draw-in underline / arrow slide), `ArticleCard` (underline
   draw), `SiteNav` (active underline). All CSS-transition-based off the motion tokens.

### Motion history worth knowing

- `docs/architecture.md` notes the original `.dc.html` prototype animated **page swaps** with a
  3-direction disperse-out/slide-in transition (it was a hash-router SPA). Real routes made that moot,
  so it was deliberately dropped. If you want route/page transitions back, that's a legitimate design
  choice — but it's currently *intentionally absent*, not an oversight. Decide deliberately.
- The original design kit also specced an **Article reading screen** (reading-progress bar, drop cap,
  pull quote, parallax figure) — never ported because there's no real essay content yet. `useParallax`
  is the orphan from that. **This is now explicitly in scope** — see §5. Mine the original template in
  `design-export/designSystem/_ds_bundle.js` for its intent, but build something more reactive than a
  straight port.

---

## 3. Animation layer — what to build

GSAP + ScrollTrigger is the core engine (already installed). Build a **small, typed, reusable hook
library** that the pages compose, so motion is declared consistently instead of hand-rolled per page.

**Target hooks** (names from the brief — adjust if you have a better decomposition, but justify it):

- `useReveal` — the canonical entrance (fade + rise). Supersedes/absorbs today's `useScrollReveal`.
- `useParallax` — scrub-linked drift (today's exists; fold it into the system, give it a typed API).
- `usePinned` — pin a section/element through a scroll range (ScrollTrigger pin) for the kind of
  "hold and reveal" choreography that reads as premium.
- `useStagger` — orchestrated staggered entrance of a set of children under one container.

Design constraints for the hook layer:

- **Install and use `@gsap/react`'s `useGSAP()`** for all GSAP lifecycle. It handles cleanup and the
  StrictMode double-invoke safely (React 19 + `StrictMode` is on — see §2). Replace the current
  manual `useEffect` + `gsap.context().revert()` pattern.
- **Scope every animation to a container ref**, never global document selectors. Hooks return a ref
  (or accept one); ScrollTrigger and selector queries operate *within* that scope. This keeps pages
  composable and prevents cross-section interference. (Today's hooks already scope via
  `gsap.context(..., root)` — preserve that discipline.)
- **Handle `prefers-reduced-motion` centrally, exactly once.** Today each hook re-checks
  `matchMedia` inline and `base.css` *also* has a global `prefers-reduced-motion` transition-killer.
  Consolidate: one source of truth (a `gsap.matchMedia()` setup and/or a single reduced-motion helper
  the hooks consult) that decides whether to animate or render final-state-immediately. No per-hook
  copies of the media query. Reduced-motion users must still see all content in its final state.
- **Type everything.** No `any` without an explanatory comment (project rule, `CLAUDE.md`). Hooks
  should be generic over the element type like the current ones (`<T extends HTMLElement>`).
- **Draw all timing from the motion tokens** (§2). If GSAP needs numeric eases rather than CSS
  `cubic-bezier` strings, register them once (e.g. `CustomEase`) so the *same* curve backs both the
  CSS transitions and the GSAP tweens. Cohesion lives here.
- **Register ScrollTrigger (and any other plugin) once**, centrally, not per-hook.

The full GSAP package (with ScrollTrigger, and optionally ScrollSmoother, Flip, CustomEase, etc.) is
present in `node_modules`. Prefer the modular imports (`gsap`, `gsap/ScrollTrigger`) already in use.

---

## 4. Component libraries to integrate

Two external sources are in-scope, **layered on top of the existing design system, never replacing
it**:

- **React Bits** — <https://reactbits.dev>
- **UIverse** — <https://uiverse.io>

Treat both as **"adapt to our tokens," not "drop in."**

- **React Bits** has known style-conflict issues when mixed with an existing CSS/component system.
  Anything you take from it must be **re-skinned to consume this project's tokens** (`var(--…)`),
  stripped of any bundled color/spacing/font values that fight the design system, and refactored to
  match the inline-style-object convention. Do not import its stylesheets wholesale. 

- **UIverse** output is community-sourced and quality varies wildly. Treat any snippet as a **starting
  point to restyle**, not a finished component. Rebuild its structure against our tokens; keep only
  the interaction idea, not its raw CSS.

Litmus test for anything pulled from either: *if it doesn't reference our tokens and match our
hairline/serif/cobalt vocabulary, it isn't done.* The goal is that a viewer can't tell which motion
was hand-built and which was adapted — it all reads as one system.

Nothing from these libraries should introduce a new styling mechanism (Tailwind classes, CSS Modules,
etc.). Convert to the inline-`style` + CSS-custom-property pattern.

---

## 5. Signature pages — design these two as centrepieces

Beyond the site-wide cohesion pass, two purpose-built experiences are explicitly requested. These are
where the "makes a hiring manager stop" impact should concentrate. Design them as *distinctive*, not
templated — but built from the same motion vocabulary, tokens, and hook layer as everything else, so
they read as the most-developed expression of one system, not bolt-ons.

### 5a. Vertical dynamic timeline — project storytelling on Project Pages

**Reality check first (audited):** individual **Project Pages do not exist yet.** `src/pages/Work.tsx`
links every `ProjectCard` to `/work` (not a per-project route), `App.tsx` has no `/work/:slug` route,
and `ProjectData` in `types.ts` is thin — `index, title, summary, tags, year` only. So this is partly
a *build*, not just an *animate*: you'll need a project-detail route, a richer per-project content
shape in `src/data/content.ts`, and the timeline component itself. Keep content static (no CMS, §6).

Design intent:

- A **vertical, scroll-driven timeline** that narrates a single project as a sequence of phases /
  milestones (e.g. problem → approach → build → test → result — let the real content of the three
  projects shape the beats: RC F-35 VTOL, guest-registration system, DCS companion app).
- Motion should make the story *unfold*: a progress line/spine that draws downward as you scroll,
  nodes that activate (cobalt accent) as they reach a read position, entries that reveal with the
  shared entrance vocabulary, optional pinned "hold" moments for a key figure or result. This is the
  natural home for `usePinned`, `useReveal`, `useStagger`, and `useParallax` working together — a
  showcase of the hook layer, not a one-off inline timeline.
- Stay inside the aesthetic: hairline spine, mono milestone labels/dates, serif narrative, one cobalt
  accent for the active node. Editorial and precise — a timeline that looks like a lab notebook's
  margin, not a marketing infographic.
- Must degrade gracefully under `prefers-reduced-motion`: the full story is readable as a static
  vertical list, no content gated behind scroll progress.

### 5b. A unique, reactive article reading page

The Writing route (`src/pages/Writing.tsx`) is currently a "Forthcoming" placeholder; `ArticleCard`
exists but is unused and there is **no article route or reading screen**. Build a genuinely reactive
long-read experience — the counterpart to the timeline for prose.

Design intent:

- A **reactive reading page**: scroll-linked reading-progress indicator, and reactive structure such
  as an active-section marker / mini table-of-contents that tracks the reader's position, figures that
  parallax or reveal as they enter, pull quotes and a drop cap that animate in — the design kit's
  original Article template (`design-export/designSystem/_ds_bundle.js`: reading-progress bar, drop
  cap, pull quote, parallax figure) is the *starting intent*; make it more alive than a straight port.
- "Reactive" is the operative word: the page should respond continuously to scroll position and
  reading state, not just fire one entrance. But readability wins over spectacle — motion must never
  fight the act of reading, cause reflow of text being read, or move the reading column itself.
- Reuse the article route to render a real essay; wire `ArticleCard` into the Writing index so the
  list → reading-page flow actually connects.
- Reduced-motion: progress indicator can stay (it's information, not decoration, but keep it
  non-distracting); parallax/drop-cap/reveal all degrade to static. Full prose always readable.

**Content dependency (flag early):** there are no real essays yet — this was the original reason the
Article screen was deferred. Building the *experience* is in scope; it needs at least one piece of real
(or agreed placeholder) long-form content to be meaningful. Resolve this in Open Questions (§8) before
the reading page's content model hardens. Do not invent fake essays as if they were real.

---

## 6. Non-goals (do not do these)

- **No CMS / no backend / no data layer.** Content stays static in `src/data/content.ts`.
- **No SSR / SSG / framework migration.** It stays a Vite SPA.
- **Do not rebuild the existing components from scratch.** Extend and animate them — preserve their
  structure, props, and token usage. `ProjectCard`, `Button`, `SiteNav`, etc. get *enhanced* motion,
  not replacement.
- **No new dependencies beyond `@gsap/react`** (for `useGSAP`) **plus adapted snippets from React Bits
  / UIverse.** If you hit a genuine gap that needs another library, **flag it and ask** — don't just
  add it.
- **The Article reading page and Project Pages are now in scope** (§5) — this reverses the earlier
  deferral in `docs/project_status.md`. But don't fabricate content: build the *experiences* and their
  data shapes, and get real (or agreed-placeholder) content per §8 rather than inventing fake essays or
  projects as if they were real.
- **Do not edit `design-export/`.** Reference only.
- **Don't invent a logo/brand mark.** The wordmark is plain serif + a small cobalt `<span>` tick
  (`SiteNav`). Animating that tick is fair game; inventing an icon is not — ask first.

---

## 7. Suggested checkpoints

Phase the work so review lands at natural boundaries, not file-by-file. Rough shape (you own the
ordering and may merge phases — this is a checkpoint rhythm, not a task list):

1. **Audit & plan** — confirm your reading of the repo, decide the hook API surface, decide how to
   resolve the two parallel entrance systems (`useScrollReveal` hook vs. `Reveal` component), and
   resolve the Open Questions below. Output a short motion plan before touching code.
2. **Motion foundation** — install `@gsap/react`; build the typed hook layer (`useReveal`,
   `useParallax`, `usePinned`, `useStagger`); centralise plugin registration and reduced-motion;
   establish the shared ease/duration wiring against the tokens. Migrate the existing Home hero and
   the current reveals onto the new foundation so nothing regresses.
3. **Component integration** — bring in and re-skin React Bits / UIverse pieces where they earn their
   place; enhance existing component micro-interactions to sit in the same motion vocabulary.
4. **Signature pages (§5)** — the vertical project-story timeline (plus the project-detail route and
   richer content shape it needs) and the reactive article reading page (plus the article route and
   Writing-index → reading-page flow). These lean hardest on the hook layer, so they come after the
   foundation is proven. Treat each as its own reviewable checkpoint.
5. **Full cohesion pass** — go page by page (Home → About → Work → project pages → Writing → article
   page) making the motion feel choreographed as a whole: consistent entrance direction/stagger,
   deliberate section-to-section rhythm, the hero-quality feel extended everywhere. This is where
   "grab-bag vs. system" is won.
6. **Performance & accessibility pass** — verify transform/opacity-only animation, no layout thrash,
   good behaviour on throttled CPU; verify `prefers-reduced-motion` fully degrades to static content;
   check keyboard focus and reading order are unaffected; confirm `npm run build`, `npx tsc -b
   --noEmit`, and `npm run lint` are clean. Test in a real browser (project convention is to verify
   routes render with zero console errors).

Pause for review at the end of phases 1, 2, and 4 at minimum (phase 4 being the signature pages).

---

## 8. Open questions — resolve these early, don't guess

These are things the repo left genuinely ambiguous or undecided. Get answers (from the user, or make
an explicit, documented decision) **before** they cascade into rework:

1. **One entrance system or two?** Today both a GSAP `useScrollReveal` hook and a dependency-free
   `Reveal` IntersectionObserver component exist and do nearly the same thing. Which survives? (Brief
   direction points at GSAP hooks as the core — confirm whether `Reveal` is retired, kept as an
   explicit no-GSAP fallback, or absorbed.)
2. **Performance budget.** No budget is defined anywhere in the repo. What's the target — bundle size
   ceiling, Lighthouse/CWV thresholds, minimum hardware/FPS? This bounds how far the motion can go
   (e.g. whether ScrollSmoother is acceptable).
3. **Deployment target.** Undecided (`docs/project_status.md`). `npm run build` emits a static
   `dist/`, but no host (Vercel/Netlify/Cloudflare Pages) or domain/DNS is chosen. Matters if any
   motion decision depends on the runtime environment or asset delivery.
4. **Page/section scope of the motion pass.** Home, About, Work are content-rich. Are route/page
   transitions in scope (they were deliberately dropped — §2 "Motion history") or still out?
5. **Project Pages — routing & content model (§5a).** No per-project route or detail page exists today
   (`ProjectData` is `index/title/summary/tags/year` only; cards link to `/work`). What's the URL
   shape (`/work/:slug`?), and what narrative fields does each project need for the timeline
   (phases/milestones, dates, figures/media)? Is there real media (photos of the F-35 build, the
   registration UI, the DCS app) or is it text-only for now?
6. **Article reading page — content source (§5b).** There are no real essays; the "on the desk" list
   in `content.ts` is just planned titles. What renders in the reading page — one real essay written
   for launch, an agreed placeholder long-read, or does the whole reading page wait on content? And
   what's the article content shape (Markdown/MDX vs. structured TS blocks with typed figure/pullquote
   nodes)? This decides how the reactive features (TOC, progress, figures) bind to content.
7. **Fonts: keep the CDN?** Fonts load from Google Fonts CDN. If performance/offline/privacy matters,
   self-hosting `woff2` is the flagged optimization (`fonts.css` says so). Decide before the
   performance phase, since it affects the perf numbers.
8. **`@gsap/react` × React 19.** Confirm the installed `@gsap/react` version's peer range supports
   React 19 cleanly. **(inferred concern — not yet verified in this repo since the package isn't
   installed.)**
9. **Adherence lint — enforce it?** The token/prop adherence spec
   (`design-export/designSystem/_adherence.oxlintrc.json`) exists but **(inferred)** isn't wired into
   the live `oxlint` run. Should the motion work also wire it in as a real guardrail, or leave it as
   documentation? Either way, stay inside it.

---

### Quick reference — commands

```bash
npm run dev                 # dev server, hot reload
npx tsc -b --noEmit         # type check
npm run build               # tsc -b && vite build
npm run preview             # preview production build
npm run lint                # oxlint
```

**Repo etiquette (`CLAUDE.md`):** branch before non-trivial work (`feature/…`), never commit to
`main`, clear commit messages explaining *why*. Comments explain intent, not mechanics. No premature
abstraction — build the hook you need, not the one you might.
