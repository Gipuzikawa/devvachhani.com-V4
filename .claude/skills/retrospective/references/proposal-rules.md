# Proposal Rules

Reconstructed from the hard limits already quoted inline in `retrospective-agent.md` Step 4 —
kept here as the single source of truth so the agent prompt doesn't need to restate them.

## Hard limits

- **Maximum 5 proposals** per retrospective, across all categories combined
- Each proposal must be **implementable in under 5 minutes** — if it would take longer, it's
  out of scope for a retrospective proposal (raise it as a manual task instead)
- **Never propose something already present** in `CLAUDE.md` or an existing skill
- **Never propose a new slash command** for a task that has only happened once — wait for
  recurrence
- **Never propose a new skill** when a slash command would suffice — the skill bar is higher
  (multi-step workflow + reference files, not a single repeated action)

## Proposal categories

| Category | Requirement |
|---|---|
| CLAUDE.md edit | Exact text to add/change + the section it belongs in. No vague descriptions. |
| New slash command | Full, ready-to-save content for `.claude/commands/<name>.md`. Only if the task recurred across sessions. |
| Skill improvement | Exact file path + line/section to change + the replacement text, for an existing skill. |
| New skill | Name, description, and step structure only (not the full SKILL.md) — proposal-stage detail is enough. |

## Quality bar

- Every proposal must cite **concrete evidence** — a specific commit, diff, or repeated pattern
  from the session. No proposals from vibes.
- Prefer fewer, sharper proposals over padding out to the 5-proposal limit.
- If a lens found nothing, say "nothing to flag" for it — don't invent a proposal to fill space.
- A proposal that was already skipped/declined in a previous session (check `session-log.md`)
  should not be re-proposed unless new evidence makes the case stronger.
