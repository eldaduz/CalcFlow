# CalcFlow Mandatory Agent Instructions

These instructions are mandatory for Claude and any other AI agent working in this repository.

Before planning, editing code, changing Jira, creating or reviewing a pull request, merging, deploying, or updating project status:

1. Read `PROJECT_PLAN.md` completely.
2. Read `SECOND_BRAIN.md` completely.
3. Read `design.md` before any UI or UX change.
4. Verify the live state in Jira and GitHub.
5. Identify the human owner, current Feature, current Work Item, branch, dependencies, release, approval point, PR status, and CI status.
6. Stop and report any conflict between Jira, GitHub, `PROJECT_PLAN.md`, `SECOND_BRAIN.md`, or `design.md`.
7. Present a short plan and wait for human approval whenever `PROJECT_PLAN.md` requires it.
8. Follow the Jira workflow, branch policy, review rules, QA, regression, deployment, and smoke-test rules defined in `PROJECT_PLAN.md`.
9. Update Jira and `SECOND_BRAIN.md` at every required milestone.
10. Never bypass a required human approval or claim completion without evidence.

Sources of truth:

- Jira: live work-item state, ownership, dependencies, releases, and status
- GitHub: code, branches, pull requests, reviews, CI, tags, and releases
- `PROJECT_PLAN.md`: permanent process and delivery rules
- `SECOND_BRAIN.md`: current operational state and handoff
- `design.md`: UI and UX rules

When information conflicts, Jira and GitHub define the live state, `PROJECT_PLAN.md` defines the permanent rules, and the agent must stop rather than guess.
