# CalcFlow Mandatory Agent Instructions

These instructions are mandatory for Codex and any other AI agent working in this repository.

## Mandatory Token Discipline

Use tokens and context window deliberately. Prefer concise tool output, focused file reads and searches, and targeted verification. Do not repeatedly dump complete documents, Jira issues, GitHub pages, diffs, or test output unless the full content is necessary for a safe decision.

Before planning, editing code, changing Jira, creating or reviewing a pull request, merging, deploying, or updating project status:

1. Read `PROJECT_PLAN.md` completely.
2. Read `SECOND_BRAIN.md` completely.
3. When working in Codex, read `CODEX_MODEL_GUIDE.md` before every Feature and again at each stage boundary: implementation, Code Review, QA/regression, and difficult bug investigation.
4. Read `design.md` before any UI or UX change.
5. Verify the live state in Jira and GitHub.
6. Identify the human owner, current Feature, current Work Item, branch, dependencies, release, approval point, PR status, and CI status.
7. Stop and report any conflict between Jira, GitHub, `PROJECT_PLAN.md`, `SECOND_BRAIN.md`, `CODEX_MODEL_GUIDE.md`, or `design.md`.
8. Present a short plan and wait for human approval whenever `PROJECT_PLAN.md` requires it.
9. Follow the Jira workflow, branch policy, review rules, QA, regression, deployment, and smoke-test rules defined in `PROJECT_PLAN.md`.
10. Update Jira and `SECOND_BRAIN.md` at every required milestone.
11. Never bypass a required human approval or claim completion without evidence.

## Mandatory Codex Configuration Check

When the active agent is Codex:

1. Identify the Jira Feature and current delivery stage.
2. Read the approved model and reasoning configuration from `CODEX_MODEL_GUIDE.md`.
3. Ask the user for the current configuration when it is not known.
4. Compare the current configuration with the approved configuration.
5. Continue when they match.
6. When they differ, reach a safe stopping point and use the mandatory `MODEL CHANGE REQUIRED` format from `CODEX_MODEL_GUIDE.md`.
7. Wait for explicit confirmation that the user completed the manual change in the Codex interface.
8. Recheck the guide before the next stage and after any escalation condition.
9. Do not use a stronger configuration merely because it may be marginally better.
10. Do not downgrade in the middle of an unfinished logical unit; stop at a safe boundary first.

Before presenting a Feature development plan, Codex must include the `CODEX CONFIGURATION CHECK` block defined in `CODEX_MODEL_GUIDE.md`.

## Sources of Truth

- Jira: live work-item state, ownership, dependencies, releases, and status
- GitHub: code, branches, pull requests, reviews, CI, tags, and releases
- `PROJECT_PLAN.md`: permanent process and delivery rules
- `SECOND_BRAIN.md`: current operational state and handoff
- `CODEX_MODEL_GUIDE.md`: approved Codex model, reasoning, escalation, and manual-switch rules
- `design.md`: UI and UX rules

When information conflicts, Jira and GitHub define the live state, `PROJECT_PLAN.md` defines the permanent delivery rules, `CODEX_MODEL_GUIDE.md` defines Codex configuration rules, and the agent must stop rather than guess.
