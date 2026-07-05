---
name: update-docs
description: >
  Analyses git changes and keeps this project's documentation in sync. Use whenever the
  user wants to update docs after writing code, finishes a feature, fixes a bug, or says
  "update the docs", "sync the docs", "log what I just built", "update changelog", or
  "update project status". This skill handles: docs/changelog.md entries,
  docs/architecture.md updates, and docs/project_status.md progress tracking. Prefer this
  skill over manually editing docs one by one.
---

# Update Docs

Analyses the current git state and syncs `docs/changelog.md`, `docs/architecture.md`, and
`docs/project_status.md` in one pass. Deliberately basic — no feature-doc generation, no
milestone tables. This project tracks progress as plain prose bullets (Shipped / Not yet
built), not a task-row system, so keep edits in that style.

## What this skill does

1. **Reads git changes** — `git status` + `git diff`
2. **Classifies the changes** — feature / fix / structural
3. **Updates `docs/changelog.md`** — adds or extends the `[Unreleased]` entry, Keep a
   Changelog style
4. **Updates `docs/architecture.md`** — only if a structural change was detected
5. **Updates `docs/project_status.md`** — moves items between "Shipped" and "Not yet built"
   as warranted
6. **Reports back** — a short summary of what changed and why

---

## Step-by-step workflow

### Step 1 — Read git state

```bash
git status
git diff HEAD
```

If there are staged-but-uncommitted changes, also run `git diff --cached`. If there are no
changes at all, tell the user and stop.

---

### Step 2 — Classify the changes

> 📄 Read `references/classification.md` now — it defines feature / fix / structural signals
> specific to this codebase (`src/pages/`, `src/components/`, `src/data/content.ts`, design
> tokens, dependencies).

Hold a mental model:
- Which files changed, and which layer they belong to (page / component / hook / data / tokens)
- Whether anything structural happened (new folder, new dependency, new route)
- A one-line plain-English summary of the overall change

---

### Step 3 — Update `docs/changelog.md`

> 📄 Read `references/changelog-format.md` now — the changelog follows
> [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this file has the exact rules.

- Add to (or create) the `## [Unreleased]` section at the top — never touch already-released
  version headings
- Group lines under `### Added` / `### Changed` / `### Fixed` / `### Removed` as appropriate
- One concise line per change; don't restate the diff, state what it means for the project

---

### Step 4 — Update `docs/architecture.md` (conditional)

**Only if Step 2 found a structural change.** Structural changes include:

- A new top-level folder under `src/` (e.g. a new `src/components/<category>/`)
- A new route added in `src/App.tsx`
- A new hook added to `src/hooks/`
- A dependency added or removed in `package.json`
- The design-token flow changing (e.g. a new file under `src/styles/`)

If structural: read the current `docs/architecture.md`, update only the affected section, and
leave the rest untouched. If not structural: skip this step entirely.

---

### Step 5 — Update `docs/project_status.md`

> 📄 Read `references/status-rules.md` now — the exact rules for moving items between
> "Shipped" and "Not yet built".

Key rule: an item moves to "Shipped" only when the diff shows it's actually working end to
end, not just started. When in doubt, leave it under "Not yet built" with an updated note
rather than over-claiming completion.

---

### Step 6 — Report back

Give a short, concrete summary:
- Which of the three docs were touched (and which were correctly left alone, and why)
- The changelog entry added
- Any assumptions made or ambiguity flagged

Keep it tight — a short bulleted list, not a wall of text.

---

## Important constraints

- **Never delete existing content** from any of the three docs — only add or update
- **Never fabricate completion** in `project_status.md` — only claim "Shipped" with clear
  evidence from the diff
- **One changelog entry group per run** — even for multiple changes, they land under the same
  `[Unreleased]` heading, added to the relevant subsection
- **Don't create new docs** (feature-docs, ADRs, etc.) — this skill is intentionally scoped to
  the three docs this project already has. If a heavier doc seems warranted, say so and ask
  rather than creating it
- **Ask before renaming a version heading** — if it looks like `[Unreleased]` should be cut
  into a real version number, ask the user rather than guessing one
