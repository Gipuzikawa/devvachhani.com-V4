# HANDOVER — Fable 5, full design authority: the "wozers" pass

> **You are Fable 5, and you have full authority over the design and motion direction of this codebase.**
> This is not a "do exactly what I say" task — it is a "you are the designer, own it" task. You are being
> handed a functional, coherent v1 and asked to turn it into a **beautiful, reactive, complexly-animated
> website**. The visual language, the motion vocabulary, the signature moments, the sequencing — all of it
> is yours to decide. Be bold. Be intentional. Don't ask permission to have taste.
>
> **Run autonomously.** You don't need to pause for approval between steps — sequence the work yourself,
> commit in logical checkpoints, keep going. I'd love **one** message up front (your plan and where you'll
> push hardest), but treat that as a courtesy heads-up, not a gate.
>
> **Read the repo before writing code.** The "current state" below is read from source, not inferred. If
> the repo and this doc ever disagree, **the repo wins** — surface the contradiction rather than silently
> following the doc.

This brief was drafted by a Claude session with direct repo access on **2026-07-05**.

---

## 0. Work on a fresh branch

Round 1's motion work is merged to `main`. This is a new, independent pass — branch off `main`:

```bash
git switch main && git pull
git switch -c feature/kinetic     # or a name you prefer; feature/… per CLAUDE.md
```

Never commit to `main`. Commit in logical checkpoints and open a PR when a meaningful slice lands.
(`CLAUDE.md` → Repository Etiquette.)

---

## 1. What this site is

**devvachhani.com** — Dev Vachhani's personal portfolio. A STEM student presenting projects (and,
soon, writing) to university and research programmes. The concept is an **archival index brought to
life**: catalogue the work like a scholarly bibliography, then make it move.

Aesthetic today: **warm-monochrome, hairline-ruled, serif-voiced, one electric-cobalt accent.**
Newsreader serif for voice, IBM Plex Mono for labels/metadata. It should feel like *a well-made print
index that learned to move* — editorial, precise, confident.

The audience is technical: admissions committees, research leads, engineers. The motion's job is to make
a sharp reader **stop and pay attention**, go *"…how did they do that?"*, then trust the person behind it.

You may **evolve this aesthetic** if you can make it genuinely better — you own the direction, not just
the polish. State your intent in your opening plan.

---

## 2. Where the site is *right now* (Round 1 is done — read this carefully)

A full, deliberately **restrained** motion pass already shipped and merged (`main`). You are not starting
from static HTML — you are inheriting a working, coherent motion system and **turning up its ambition**.
Do not rebuild what exists; extend it.

**Already built and working:**

- **Motion core** — `src/motion/core.ts` is the single source of truth. It is the *only* place that calls
  `gsap.registerPlugin`. It exports:
  - `DUR` (`fast .18 / base .4 / slow .7 / reveal .9 / hero 1.1`, seconds) mirroring `--dur-*`.
  - `EASE` (`out / inOut / emph`) — registered as named `CustomEase` curves (`ds-out`, `ds-in-out`,
    `ds-emph`) from the *literal same* cubic-beziers as the CSS tokens, so CSS and GSAP share curves.
  - `REVEAL_RISE` (24px) and `prefersReducedMotion()` — the one JS-side reduced-motion check.
- **Typed hook layer** (`src/hooks/`), all run through `@gsap/react`'s `useGSAP()`:
  - `useReveal` — per-item scroll entrance (each `[data-reveal]` descendant fades + rises as it crosses).
  - `useStagger` — orchestrated group entrance for grids/rows; takes `dependencies` to re-run on filter change.
  - `useParallax` — scrub-linked vertical drift.
  - `usePinned` — pin-and-hold through a scroll range, desktop-only (≥900px), with a scrubbed timeline callback.
- **Six real routes** in a persistent shell (`SiteNav` + page + `SiteFooter`): `/`, `/about`, `/work`,
  `/work/:slug`, `/writing`, `/writing/:slug`. `RouteTransition` gives an *enter-only* page fade+rise.
- **Two signature pages already exist:**
  - **F-35 project page** (`/work/rc-f35-vtol`) — scroll-driven vertical timeline (cobalt spine draws with
    reading position, nodes activate at the read line, parallax figure plates), a pinned final-product hold
    with a scrubbed spec table, reflections grid.
  - **Article reading page** (`/writing/f35-development-update`) — scroll-linked reading-progress hairline,
    sticky mini-TOC with active-section tracking, cobalt drop cap, ruled pull quote, parallax figures.
- **Home hero** — a one-off `useGSAP` timeline (line-mask headline reveal + staggered meta/CTA). This is
  the current "most designed" moment and a reference for the feel.
- **Component micro-interactions** — `Button`, `ProjectCard`, `TextLink`, `ArticleCard`, `SiteNav` all
  animate off the motion tokens (CSS transitions).
- **Fonts self-hosted** (latin woff2 in `public/fonts/`) — zero external runtime requests.
- **Perf headroom is real:** Round 1 measured ~100 FPS with zero >50ms long tasks on the heaviest page
  (the F-35 timeline), whole pass added only ~5.4 KB gzip. You have budget to spend.

**Content is placeholder where it says so.** The F-35 build log and the one article are clearly-labelled
lorem (from `Placeholders/`), each carrying a `status: 'placeholder'` notice on the live page. Real essays
and a real build log don't exist yet. **Do not fabricate content as if it were real** (see §5).

**The stack** (from `package.json`): Vite 8 · React 19.2 (`StrictMode` on) · TypeScript ~6.0 ·
react-router-dom 7.9 · **gsap 3.15** + **@gsap/react 2.1** *(both already installed)*. Lint is **oxlint**
(`npm run lint`), not ESLint. Build is `tsc -b && vite build`.

---

## 3. The mandate: turn "correct and quiet" into **wozers**

Round 1 was deliberately restrained — "editorial, not a showreel." That was the right *foundation*.
**This pass is the escalation.** Make the site **wozers** — the kind of scroll animation and living,
reactive text that makes a technical reader go *"…how did they do that?"* and keep scrolling.

The foundation's cohesion discipline is what *lets* you be bold safely — you can add spectacle precisely
because there's a shared timing/easing/token system holding it together.

Two headline tracks:

### 3a. Animated scrolls — the page should *perform* as you move through it

Beyond entrances. Think scroll as the timeline scrubber for a choreographed sequence:

- Scroll-scrubbed hero and section set-pieces; pinned "hold and transform" moments (you have `usePinned`).
- Elements that assemble, draw, mask, or resolve as their section arrives — not just fade-up.
- Depth: layered parallax that reads as considered composition, not a gimmick.
- Section-to-section rhythm so the *whole scroll* feels authored, with deliberate beats and breathing room.
- The Work index and About page are the emptiest of drama right now — good places to concentrate.

### 3b. Reactive text — typography that responds, continuously

This is the half most likely to land the "wow." Text that is *alive*, still perfectly readable:

- Per-character / per-word/line reveals on scroll (**`SplitText` is free in GSAP 3.13+ and already in
  `node_modules`** — verify the import path before relying on it).
- Kinetic headlines: weight/tracking/scale that respond to scroll velocity or reading position.
- Cursor-reactive text (magnetic, proximity weight shifts, decode/scramble-on-reveal for eyebrows/labels).
- The cobalt `<span>` tick in the wordmark is fair game to animate — it's the one brand atom you have.

**Hard readability rule:** reactive effects apply to headlines, eyebrows, pull quotes, metadata, CTAs —
the *display* layer. **Body paragraphs never animate while being read**, and no effect may cause reflow of
text a user is reading. Motion serves the reading; it never fights it.

### The bar (this is what separates "wozers" from AI slop)

- **Cohesion is the whole game.** More motion, *one hand*. Everything draws from `DUR`/`EASE` and the
  tokens. A grab-bag of individually-cool unrelated effects is a failure even at 10× the quantity. A viewer
  shouldn't be able to tell which motion was hand-built vs. adapted from a library.
- **Memorable, not busy.** A few signature moments executed flawlessly beat motion on every element.
  Restraint is now a *tool you choose*, not a mandate you obey — use it to make the loud moments land.
- **It must read as intentional to an engineer.** This audience clocks jank and gratuitousness instantly.

---

## 4. Your latitude — install what you need, decide what you want

- **Design direction is yours.** Layout, composition, type treatment, colour beyond the current tokens,
  the signature reactive-text technique, which moments get spectacle — your call.
- **Install whatever dependencies make it meaningfully better.** Motion libraries, WebGL/shaders, split-text
  engines, smooth-scroll (Lenis), physics — all fair game. Two conditions: (1) note in your plan *what* you
  added and *why*, and (2) keep the bundle honest — **lazy-load / code-split heavy libraries** so a phone
  never downloads a 2 MB hero. New libraries may bring their own runtime styles; that's fine, but keep
  *our* components on the token system (§ guardrail 3).
- **React Bits** (<https://reactbits.dev>) and **UIverse** (<https://uiverse.io>) remain an idea catalogue —
  adapt ideas to our tokens and inline-style convention rather than dropping in raw stylesheets.

---

## 5. Guardrails that do **not** bend (these protect me — everything else is yours)

1. **Performance is a feature.** Transform/opacity-driven, no layout thrash, smooth under **4× CPU
   throttle** on the heaviest page. Heavy libraries are fine *if* you lazy-load and budget them
   deliberately. If you adopt smooth-scroll, prove it doesn't cost the F-35 timeline its frame budget.
2. **Accessibility is non-negotiable.** `prefers-reduced-motion` honoured **everywhere, via
   `prefersReducedMotion()` only** — never a new `matchMedia` call. Reduced-motion users see every bit of
   content in its final state, nothing gated behind scroll or an animation they never see. The article's
   reading-progress bar + active-TOC are the *one* documented exception (they're information, not
   decoration) — keep that nuance. Motion must never trap focus or disturb reading order.
3. **Stay inside the design system for our own components.** Inline `style` objects referencing
   `var(--token)`. **No Tailwind, no CSS Modules, no styled-components** in our code. Colors/spacing/type
   come from the semantic tokens (`--text-strong`, `--bg-canvas`, `--border-hairline`, `--cobalt`/`--accent`,
   …), never raw hex/px. If you introduce a new duration/ease, **add it as a token in `effects.css` first**,
   then mirror it in `core.ts`.
4. **All motion routes through `src/motion/core.ts`.** Register plugins there and nowhere else; draw timing
   from `DUR`/`EASE`; consult `prefersReducedMotion()`. This is *how* cohesion is enforced — and how any new
   library stays coherent with the rest.
5. **`design-export/` is frozen.** Read-only reference (the original design intent lives in `_ds_bundle.js`).
   Never edit it, never import from it at runtime.
6. **No content fabrication.** Build the *experiences* and data shapes; do not invent fake essays or project
   logs presented as real. Placeholders stay labelled. Content stays static in `src/data/content.ts` — **no
   CMS, no backend, no SSR/framework migration.** If a reactive feature needs a content field that doesn't
   exist yet (e.g. a per-section "kicker" for a decode effect), **add it to the typed shape** rather than
   hardcoding it in a component.
7. **Don't invent a logo/brand mark.** Animating the existing cobalt wordmark tick is encouraged; inventing
   an icon is not — ask first. No favicon glyph without a real asset.
8. **TypeScript everywhere** — no `any` without an explanatory comment. Type hooks generically over the
   element (`<T extends HTMLElement>`) like the existing ones.

---

## 6. Content reality (resolve before it cascades)

The F-35 page and the one article carry **labelled placeholder** copy; real essays/build logs don't exist.
Build all the reactive machinery against the existing typed content contracts (`ArticleBlock`,
`ProjectDetail` in `types.ts`; bodies in `content.ts`) — the placeholder text is enough to prove the
experience. Keep the `status: 'placeholder'` notices honest.

---

## 7. Suggested rhythm (you own the ordering — this is a map, not a gate)

You don't need to pause between these; they're just natural checkpoint boundaries for commits/PRs:

1. **Audit & plan** — confirm your reading of the repo, name the 3–5 signature moments you'll build, decide
   which reactive-text technique carries the identity, and list any dependencies you'll add and why. Send me
   this one message, then keep going.
2. **Vocabulary extension** — add any new tokens/eases/helpers to `core.ts` + `effects.css`; wire up any new
   library through the core; prove the reactive-text primitive (e.g. a `useSplitReveal` / kinetic-heading
   hook) on one real heading.
3. **Signature scroll moments** — the 3–5 set-pieces (hero, Work index, About, timeline, article).
4. **Cohesion + polish pass** — page by page, make the whole scroll feel choreographed as one piece.
5. **Perf & a11y gate** — verify transform/opacity where it counts, smooth under 4× throttle;
   `prefers-reduced-motion` fully degrades; keyboard focus + reading order intact.

---

## 8. Definition of done

- A first-time visitor scrolling the home page has a clear "whoa" moment in the first two screens.
- At least one reactive-text technique is unmistakably the site's signature, used consistently.
- Every effect degrades cleanly to static content under `prefers-reduced-motion` (test it — emulate it).
- Smooth under 4× CPU throttle on the F-35 timeline page; no console errors on any of the six routes.
- Any added dependency is lazy-loaded/code-split where heavy, and its cost is noted.
- `npx tsc -b --noEmit`, `npm run build`, and `npm run lint` are all clean.
- Verified in a **real browser** (project convention — use the `/verify` skill), not just asserted.
- It reads as **one system**: a viewer can't tell which motion was hand-built vs. adapted.

```bash
npm run dev              # dev server, hot reload
npx tsc -b --noEmit      # type check
npm run build            # tsc -b && vite build
npm run lint             # oxlint
```

---

## 9. Decisions to state early, don't guess

1. **How far past Round 1's restraint?** You have authority to go bold. One showpiece per page, or a
   continuously-alive feel? State your stance.
2. **The signature reactive-text technique** — split-reveal vs. velocity-kinetic vs. cursor-reactive vs.
   decode/scramble. Pick one to be *the* thing; don't do all four everywhere.
3. **Smooth-scroll (e.g. Lenis)?** Permitted now — but if you adopt it, prove it against the perf gate and
   confirm reduced-motion / native accessibility behaviour still holds.
4. **Route transitions** — Round 1 kept them enter-only (exit animations delay navigation). Push further, or leave?
5. **Cursor/pointer interactions on touch** — how do cursor-reactive effects degrade on mobile? Decide up front.

---

**One last thing:** the previous pass's whole ethos was "quiet correctness." Dev has now explicitly asked
for the opposite energy, and for you to have real freedom — including new dependencies and autonomy to run
without check-ins. You are not betraying the design system by being loud; you are using the system it built
to be loud *well*. Make it beautiful. Make it wozers.
