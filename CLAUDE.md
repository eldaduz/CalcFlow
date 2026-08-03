# CalcFlow Mandatory Agent Instructions

These instructions are mandatory for Claude and any other AI agent working in this repository.

Before planning, editing code, changing Jira, creating or reviewing a pull request, merging, deploying, or updating project status:

1. Read `docs/agents/PROJECT_PLAN.md` completely.
2. Read `docs/agents/SECOND_BRAIN.md` completely.
3. Read `docs/agents/CLAUDE_PROJECT_NOTES.md` if present — a Claude/Gavi-side handoff notebook (rationale, gotchas, conventions-by-example) supplementing `docs/agents/SECOND_BRAIN.md`, the Claude-tooling equivalent of `docs/agents/CODEX_HANDSHAKE.md`.
4. Read `design.md` before any UI or UX change.
5. Verify the live state in Jira and GitHub.
6. Identify the human owner, current Feature, current Work Item, branch, dependencies, release, approval point, PR status, and CI status.
7. Stop and report any conflict between Jira, GitHub, `docs/agents/PROJECT_PLAN.md`, `docs/agents/SECOND_BRAIN.md`, `docs/agents/CLAUDE_PROJECT_NOTES.md`, or `design.md`.
8. Present a short plan and wait for human approval whenever `docs/agents/PROJECT_PLAN.md` requires it.
9. Follow the Jira workflow, branch policy, review rules, QA, regression, deployment, and smoke-test rules defined in `docs/agents/PROJECT_PLAN.md`.
10. Update Jira, `docs/agents/SECOND_BRAIN.md`, and `docs/agents/CLAUDE_PROJECT_NOTES.md` at every required milestone.
11. Never bypass a required human approval or claim completion without evidence.
12. At the start of a new Feature, before planning, and again immediately after any merge, QA pass, or status change, verify that every relevant Jira item's status matches the real GitHub PR/branch state. Correct any mismatch immediately rather than leaving it for a future session to discover. This includes Product Epics, which do not auto-roll-up from their child Features and need the same explicit correction.
13. When reporting on blockers, next steps, or outstanding work, proactively surface structural risks in addition to direct blockers — including concurrent branches or pull requests that touch overlapping code and may conflict, even if nobody has hit the conflict yet and even if the human chooses to accept the risk rather than act on it.
14. Every API action taken this session (Jira, GitHub) runs under the human owner's own credentials, not a separate bot identity. Do not claim certainty about "I did X" versus "the human did X" for an action that could have come from either source — verify independently against live state and disclose the ambiguity honestly rather than asserting a version of events you cannot actually prove.
15. A pull-request review is scoped to the exact commit it was submitted against and is auto-dismissed by GitHub the instant any new commit lands on that branch, regardless of what that commit contains. Before reporting or relying on a PR's approval or mergeable state — including immediately after submitting an approval yourself — fetch the PR fresh and confirm the review's `commit_id` matches the PR's current `head.sha` at that exact moment. Never reuse an earlier check or a prior "approved" statement as still true.

Sources of truth:

- Jira: live work-item state, ownership, dependencies, releases, and status
- GitHub: code, branches, pull requests, reviews, CI, tags, and releases
- `docs/agents/PROJECT_PLAN.md`: permanent process and delivery rules
- `docs/agents/SECOND_BRAIN.md`: current operational state and handoff
- `docs/agents/CLAUDE_PROJECT_NOTES.md`: Claude/Gavi-side supplementary handoff notes and conventions
- `design.md`: UI and UX rules

When information conflicts, Jira and GitHub define the live state, `docs/agents/PROJECT_PLAN.md` defines the permanent rules, and the agent must stop rather than guess.
