# Trigger Rules

Reconstructed from the trigger conditions described in `retrospective-agent.md`'s own
frontmatter — kept here as the single source of truth so the agent prompt doesn't need to
restate them.

## Automatic triggers

Fire automatically when the developer appears to be wrapping up a session **and** either:

- **3 or more files** have been changed (via `git status`/`git diff HEAD~1`) since the last
  retrospective, or
- A commit message in the session contains correction language — `fix`, `correct`, `redo`,
  `revert` — alongside 2 or more files changed.

## Manual triggers

Fire whenever the developer says something equivalent to:

- "let's do a retro" / "let's do a retrospective"
- "session review" / "review this session"
- "log this session"
- "what should we improve" (session-scoped, not project-wide — for project-wide ideation use
  `ce-ideate` instead)

## Do not trigger

- On trivial sessions: 1–2 files changed, no corrections (e.g. a typo fix, a one-line doc edit)
- Mid-session, before the developer has signaled they're done
- More than once per session unless the developer explicitly asks again
- If `git status` shows no commits since the last retrospective log entry (nothing new to
  reflect on)
