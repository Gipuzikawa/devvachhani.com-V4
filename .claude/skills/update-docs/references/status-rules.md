# Project Status Update Rules

These rules govern how `docs/project_status.md` is updated in Step 5. This project tracks
status as two plain bullet lists — **Shipped** and **Not yet built** — not a milestone/task
table. Keep it that way; don't introduce a table or emoji status markers.

---

## Moving an item to "Shipped"

An item moves to (or is added under) **Shipped** only when ALL of the following are true:
- The relevant files exist, confirmed by the diff or `git status`
- The implementation is complete, not a stub or placeholder
- It would work end-to-end from a visitor's perspective (or, for infrastructure like a hook,
  it's actually wired into a page that uses it)

When in doubt, leave it under **Not yet built** with a note on current state rather than
over-claiming completion.

## Adding to "Not yet built"

Add a new bullet here when:
- A deliberate decision was made to defer something (mirror the existing tone — e.g. "no
  premature abstraction" reasoning, not just "TODO")
- A dependency now exists but isn't wired up yet (e.g. a hook was added but no page calls it)

## Editing existing bullets

- Update a bullet in place rather than duplicating it when the same item's status changes
- Keep the parenthetical reasoning where it exists (e.g. *why* the Article page is deferred) —
  don't strip context down to a bare fact
- Don't delete a "Not yet built" bullet just because related work started; only move it once
  it meets the "Shipped" bar above

## What NOT to do

- Do not invent milestones, version numbers, or a task table — this file is intentionally
  prose, matching the rest of this project's docs
- Do not remove a bullet outright — move it between sections, or update its wording in place
- Do not mark something "Shipped" based on intent or a partial diff — only on evidence
