# CalcFlow Mandatory Agent Instructions

These instructions are mandatory for Codex and any other AI agent working in this repository.

## Mandatory Token Discipline

Use tokens and context window deliberately. Prefer concise tool output, focused file reads and searches, and targeted verification. Do not repeatedly dump complete documents, Jira issues, GitHub pages, diffs, or test output unless the full content is necessary for a safe decision.

Before planning, editing code, changing Jira, creating or reviewing a pull request, merging, deploying, or updating project status:

1. Read `PROJECT_PLAN.md` completely.
2. Read `SECOND_BRAIN.md` completely.
3. Read `CODEX_MODEL_GUIDE.md` before every Feature and again at each stage boundary: implementation, Code Review, QA/regression, and difficult bug investigation. This applies in both AGY IDE and Codex.
4. Read `design.md` before any UI or UX change.
5. Verify the live state in Jira and GitHub.
6. Identify the human owner, current Feature, current Work Item, branch, dependencies, release, approval point, PR status, and CI status.
7. Stop and report any conflict between Jira, GitHub, `PROJECT_PLAN.md`, `SECOND_BRAIN.md`, `CODEX_MODEL_GUIDE.md`, or `design.md`.
8. Present a short plan and wait for human approval whenever `PROJECT_PLAN.md` requires it.
9. Follow the Jira workflow, branch policy, review rules, QA, regression, deployment, and smoke-test rules defined in `PROJECT_PLAN.md`.
10. Update Jira and `SECOND_BRAIN.md` at every required milestone.
11. Never bypass a required human approval or claim completion without evidence.

## Mandatory Configuration Check

At the start of every Feature, regardless of whether the active tool is AGY IDE or Codex:

1. Identify the Jira Feature and current delivery stage.
2. Read the approved tool and model configuration from `CODEX_MODEL_GUIDE.md`.
3. Ask the user for the current configuration when it is not known.
4. Compare the current configuration with the approved configuration.
5. Continue when they match.
6. When they differ, reach a safe stopping point and use the mandatory `MODEL CHANGE REQUIRED` or `TOOL SWITCH REQUIRED` format from `CODEX_MODEL_GUIDE.md`.
7. Wait for explicit confirmation that the user completed the manual change.
8. Recheck the guide before the next stage and after any escalation condition.
9. Do not use a stronger configuration merely because it may be marginally better.
10. Do not downgrade in the middle of an unfinished logical unit; stop at a safe boundary first.
11. Prefer AGY IDE models by default. Switch to Codex only when a justified reason exists per `CODEX_MODEL_GUIDE.md §4`.

Before presenting a Feature development plan, the active agent must include the `CONFIGURATION CHECK` block defined in `CODEX_MODEL_GUIDE.md`.

## Sources of Truth

- Jira: live work-item state, ownership, dependencies, releases, and status
- GitHub: code, branches, pull requests, reviews, CI, tags, and releases
- `PROJECT_PLAN.md`: permanent process and delivery rules
- `SECOND_BRAIN.md`: current operational state and handoff
- `CODEX_MODEL_GUIDE.md`: approved tool (AGY IDE / Codex), model, reasoning, escalation, and manual-switch rules
- `design.md`: UI and UX rules

When information conflicts, Jira and GitHub define the live state, `PROJECT_PLAN.md` defines the permanent delivery rules, `CODEX_MODEL_GUIDE.md` defines tool and model configuration rules, and the agent must stop rather than guess.

## AGY IDE Tooling

When working in the AGY IDE, use the configured MCP servers for all GitHub and Jira access:

- **GitHub**: `github-mcp-server` MCP tools
- **Jira**: `mcp-atlassian` MCP tools

Do not substitute direct API calls, curl, or browser automation when MCP tools are available. If an MCP tool fails, report the error and wait for human guidance.

## Pull Request Rules

- **Verify before PR**: You must push PRs ONLY after running and verifying all unit tests and format checks locally.
- **Assign Reviewer**: You must attach Gavi (GitHub: `GaviLazan`) as a reviewer when creating or pushing a PR.
