# DevVachhani — Design System

The design language for **devvachhani.com**, a personal portfolio for a STEM
student presenting **projects** and **articles** to university programmes and
research opportunities. The site's job is to make curiosity legible: catalogue
the work like a scholarly index, then bring it to life with motion.

**Character in one line:** a warm scholarly journal that moves — transitional
serif type, cream paper, warm off-black ink, one electric-cobalt signal, and
GSAP scroll motion that reveals the archive as you read it.

## Sources
This system was authored **from scratch** from a written brief — no codebase,
Figma file, or existing assets were provided. Direction locked with the user:
modern-intellectual serif · warm off-black on cream · one electric cobalt
accent · dense archival "index" feel · medium GSAP scroll motion (staggered
reveals, parallax, pinned) · bordered/hairline surfaces.

**No logo or brand mark was supplied.** The brand is set in plain type (serif
wordmark + a small cobalt tick); see `foundations/brand-wordmark.html`. Do not
invent a mark — ask the user for one.

---

## Content fundamentals
How the words are written.

- **Voice:** first person, quietly confident, curious. "I build instruments,
  simulations, and small machines to understand how the physical world works."
  Never boastful; the work carries the weight.
- **Person:** "I" for the author, "you" only lightly. The catalogue speaks
  about the work, not at the reader.
- **Register:** scholarly but plain-spoken. Precise nouns (muon, Kalman filter,
  reaction-diffusion) sit next to everyday phrasing ("a weekend with…").
- **Casing:** sentence case for all headlines and titles. **Mono labels are
  UPPERCASE** with wide tracking (eyebrows, metadata, nav, tags) — this is the
  one place caps appear, and it reads as "index label", not shouting.
- **Numerals as structure:** entries are numbered (`01`, `02`… / "24 entries").
  The index number is a first-class design element, usually in cobalt.
- **Metadata is bibliographic:** `Essay · May 2025 · 8 min read`. Category,
  date, read-time — mono, terse, factual.
- **Emoji:** none. Not part of the brand.
- **Punctuation:** proper em dashes (—), true typographic quotes, en dashes in
  ranges. Titles may use an italic serif word for lift ("Measuring the
  invisible, *one* experiment at a time").

**Example copy**
> STEM · Physics · Software
> **Measuring the invisible, *one* experiment at a time.**
> I'm Dev — a student building instruments, simulations, and small machines to
> understand how the physical world actually works. This is a catalogue of that work.

---

## Visual foundations
- **Colour:** warm monochrome. Cream/paper grounds (`--paper-0…3`), warm
  off-black ink (`--ink-0…5`, faint yellow tint so nothing reads clinical), and
  a **single electric cobalt** (`#1B3FE6`) used sparingly — links, active nav,
  index numerals, one highlighted figure per view. No second accent, no
  gradients. See `foundations/colors-*`.
- **Type:** **Newsreader** (transitional serif, optical sizing, true italics)
  is the voice for everything readable — display, headings, body, long-read
  prose. **IBM Plex Mono** is the label — eyebrows, metadata, nav, tags, index
  numbers. Headlines set light-weight (300) at large sizes with tight tracking;
  body at 17px/1.5; long-read at 22px/1.68. Sentence case throughout.
- **Spacing & layout:** 8-based rhythm with hairline half-steps. Two measures:
  `--measure-wide` 1240px for the index/grids, `--measure-read` 660px for prose.
  Generous vertical air between sections (96–128px).
- **Surfaces:** **bordered, archival.** Content sits in hairline boxes
  (`1px --ink-5`) with near-zero radius (`--r-1` = 2px). No shadow at rest.
  Section changes are marked by a full hairline rule + a `SectionHeading`
  (index + eyebrow over a serif title). See `foundations/brand-surface.html`.
- **Backgrounds:** flat warm paper. No photographic hero, no pattern, no
  gradient. Imagery, when present, lives inside bordered figure blocks with a
  mono caption (placeholder plates until real plates are supplied).
- **Cards:** hairline border, sharp corners, transparent fill at rest. On hover
  the border darkens to `--ink-0`, a soft warm lift shadow appears
  (`--shadow-lift`), the title shifts to cobalt, and an arrow (↗/→) nudges.
- **Borders & radius:** hairline (`--ink-5`) does the dividing; strong (`--ink-0`)
  marks major rules and hover. Radius is 0–2px — this is an index, not an app.
- **Shadow:** only for lift — low, warm, soft (`--shadow-lift`). Never a hard
  drop shadow, never for decoration.
- **Motion:** medium. **Fade + rise** (y 24px, `expo.out`, ~0.9s) on scroll-in,
  **staggered** ~0.08–0.1s across lists; **parallax** drift on figures; a hero
  **line-reveal** (masked lines rising in); a **reading-progress** bar on
  articles. Driven by **GSAP + ScrollTrigger** in production; the `Reveal`
  component ships an IntersectionObserver fallback with the same tokens. All
  motion honours `prefers-reduced-motion`. Easing tokens: `--ease-out`
  (power3.out), `--ease-emph` (expo.out). See `foundations/brand-motion.html`.
- **Hover / press:** links draw an underline in (or slide an arrow); buttons
  fill from hairline to ink; press nudges down 1px. Active nav is underlined in
  cobalt. Focus is a 2px cobalt ring.
- **Transparency / blur:** used only on the sticky nav — an 82% paper wash with
  `backdrop-filter: blur(10px)` so content scrolls under it cleanly.
- **Imagery vibe (when added):** warm, neutral, documentary — instruments,
  plates, diagrams. B&W or warm-toned preferred; no cool/saturated stock.

---

## Iconography
- **Approach: minimal, typographic.** The system deliberately uses **almost no
  icons.** Affordance comes from type and motion, not glyphs.
- **The marks it does use are Unicode typographic characters**, set in the serif
  or mono face at text weight: `→` (forward / CTA), `↗` (external / open entry),
  `·` (metadata separator). No icon font, no SVG icon set, no PNG icons.
- **The one geometric mark** is the brand tick — a 7–9px solid cobalt square
  beside the wordmark. It is drawn with a plain `<span>` (CSS box), not an SVG.
- **Emoji:** never.
- **If a project needs a real icon set** (e.g. social glyphs in the footer),
  substitute **Lucide** (1.5px stroke, rounded — closest match to the hairline
  aesthetic) from CDN and flag the addition. None is bundled here by default.

---

## Components
Reusable React primitives (compiled to `window.DevVachhaniDesignSystem_a1e1ac`).
Each has a `.d.ts` contract and a `.prompt.md` usage note beside it.

**Core** (`components/core/`)
- **Button** — action control; `solid | accent | outline | ghost`, three sizes.
- **TextLink** — inline reading / index link; `underline | arrow | plain`.
- **Tag** — small mono label for topics, disciplines, statuses.
- **SectionHeading** — the section rhythm device: index + eyebrow + serif title on a rule.

**Cards** (`components/cards/`)
- **ProjectCard** — project index entry; `tile` (grid) or `row` (list).
- **ArticleCard** — bibliographic writing-index row for ruled lists.

**Navigation** (`components/navigation/`)
- **SiteNav** — sticky top bar: serif wordmark + mono index links, paper-blur ground.
- **SiteFooter** — closing colophon; large serif sign-off + mono links (optional invert).

**Motion** (`components/motion/`)
- **Reveal** — scroll-entrance wrapper (fade + rise, stagger); IntersectionObserver here, GSAP in production.

_Intentional additions:_ `Reveal` is included beyond a "cards + nav" minimum because
scroll motion is core to the brief; it stays dependency-free so consumers aren't forced onto GSAP.

---

## UI kits
- **`ui_kits/portfolio/`** — the full site as an interactive GSAP click-through:
  Home → Projects → Writing → Article. See its `README.md`.

---

## Foundations (Design System tab cards)
Specimen cards live in `foundations/` (Colors, Type, Spacing, Brand groups) and
in each component directory (Components group). Each links `styles.css` for real tokens.

## Root manifest
- `styles.css` — global entry; `@import`s only. **Consumers link this one file.**
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css`,
  `fonts.css`, `base.css`.
- `components/` — `core/`, `cards/`, `navigation/`, `motion/`.
- `ui_kits/portfolio/` — the site recreation.
- `foundations/` — specimen cards.
- `SKILL.md` — Agent-Skill wrapper.

## Fonts
Newsreader + IBM Plex Mono are loaded from **Google Fonts** (no local binaries
were supplied). To drop the CDN dependency, self-host woff2 and rewrite
`tokens/fonts.css`. **Flag:** if you have preferred/licensed font files, send
them and I'll swap them in.
