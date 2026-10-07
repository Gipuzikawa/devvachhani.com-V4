# Development workflow

How a piece of work goes from idea to merged code here. The sequence exists so that intent is
agreed before code is written, and so the reasoning survives after it is.

## The sequence

1. **Brainstorm** — explore intent, constraints, and approaches before designing anything.
   Ends in an approved design.
2. **Spec** — the approved design, written to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
   and committed. This is the *what* and *why*.
3. **Plan** — a task-by-task implementation plan, written to
   `docs/superpowers/plans/YYYY-MM-DD-<topic>.md` and committed. This is the *how*, in bite-sized
   steps with real content — no "TBD", no "handle errors appropriately".
4. **Execute** — work the plan one task at a time, each ending in an independently testable
   deliverable and a commit.
5. **Review** — a fresh reading of the diff against the plan and the spec.
6. **Finish** — integrate the branch per `git-etiquette.md`.

Skipping straight to step 4 is the failure mode this sequence exists to prevent.

## Where artefacts live

| Location | Holds | Committed |
|---|---|---|
| `docs/superpowers/specs/` | Approved designs — the durable record of what was decided and why | Yes |
| `docs/superpowers/plans/` | Implementation plans — the task breakdown each spec was built from | Yes |
| `.superpowers/sdd/` | Working scratch during a session: task briefs, diffs, progress notes | No |

`.superpowers/sdd/` self-ignores — it contains a `.gitignore` holding `*`, so nothing inside it is
ever tracked. It is created by the superpowers tooling when first needed, not ahead of time. Treat
it as a session diary: useful in the moment, not a reference to maintain.

## The human gate

An agent can produce a lot of work quickly and can be confidently wrong. Every merge is reviewed
by a person — see `git-etiquette.md`. That review is what decides whether a change is good; the
fact that a plan was followed is not a substitute for it.
