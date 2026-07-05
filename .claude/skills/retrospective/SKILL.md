---
name: retrospective
description: >
  Rules and reference material backing the retrospective-agent (.claude/agents/retrospective-agent.md).
  This skill has no standalone workflow of its own — the agent does the analysis and reporting.
  These reference files exist so the agent's trigger conditions and proposal limits are defined
  once, in one place, instead of duplicated inline in the agent prompt.
---

# Retrospective

Reference material for the retrospective-agent. The agent (not this skill) does the actual
work — reading git history, reflecting through its four lenses, and presenting proposals for
approval. This folder just holds the rules it must follow and the running session log it
appends to.

## Files

- `references/trigger-rules.md` — when the agent should fire automatically vs. only on request
- `references/proposal-rules.md` — hard limits and quality bar for proposals (max count,
  time-to-implement, what never to propose)
- `references/session-log.md` — dated append-only log of past retrospectives; the agent reads
  this for the "repetition" lens and appends to it after every session

## Maintaining this skill

If the developer approves a CLAUDE.md edit or new slash command through a retrospective, that
change lands in the actual project files (`CLAUDE.md`, `.claude/commands/`) — not here. Only
edit these reference files when the *rules governing the retrospective process itself* need to
change (e.g. raising the proposal cap, adding a new trigger phrase).
