# CalcFlow Second Brain

## Purpose

This file is the concise operational handoff for CalcFlow.

It does not replace Jira, GitHub, PROJECT_PLAN.md, or design.md.

Every AI agent must read this file before planning, coding, changing Jira, opening or reviewing a pull request, merging, deploying, or updating project state.

The AI must verify all live information against Jira and GitHub before acting.

## Last Updated

- Date: 2026-07-24
- Updated by: Eldad / ChatGPT
- Human owner: Eldad
- AI used: ChatGPT

## Current Release

- Release: v0.1.0 — Basic Calculator MVP
- Current phase: Foundation
- Goal: Establish the repository, development standards, unit testing foundation, and project documentation
- Overall status: Ready to begin approved foundation work

## Current Approved Sequence

1. CFL-2 — Application Foundation
2. CFL-9 — Development Standards
3. CFL-10 — Unit Testing Foundation
4. CFL-11 — Foundation Documentation and Verification

The first approved work item is:

- CFL-15 — Review Existing Repository Configuration

Do not begin another Foundation Feature before the current sequence and Jira dependencies allow it.

## Active Features

### Eldad

- Jira Feature: CFL-2 — Application Foundation
- Owner: Eldad
- Work mode: Direct on `main` under the approved Foundation exception
- Branch: No Feature branch; current branch is `main`
- Current Work Item: CFL-15 — Review Existing Repository Configuration
- Jira status: Selected for Development
- Pull Request: None; not required for the approved Foundation Features
- Blockers: None currently recorded
- Next required action: Begin CFL-15 after human approval

### Gavi

- Jira Feature: None active
- Branch: None
- Current Work Item: None
- Jira status: No active work
- Pull Request: None
- Blockers: Foundation must progress before dependent development begins
- Next required action: Confirm repository and tool access when requested

## Next Approved Work

### Eldad

- Next Feature: CFL-2 — Application Foundation
- First Work Item: CFL-15 — Review Existing Repository Configuration
- Work mode: Direct on `main`; no Feature branch or pull request
- Required action: Begin CFL-15 after approval and move only CFL-15 to In Progress
- Human approval required: Yes

### Gavi

- Next Feature: To be selected according to PROJECT_PLAN.md, Jira dependencies, and approved ownership
- First Work Item: Not yet approved
- Required action: Wait until the Feature is explicitly selected
- Human approval required: Yes

## Latest Verified Progress

- Repository: Private GitHub repository exists
- design.md: Present in main and defines the shared UI/UX source of truth
- PROJECT_PLAN.md: Added to main
- SECOND_BRAIN.md: Added to main
- Foundation delivery policy: Approved exception uses `main` directly for CFL-2, CFL-9, CFL-10, and CFL-11
- Jira backlog: Product Epics, Features, Stories, Tasks, releases, ownership split, and foundation sequence prepared
- Unit tests: Not yet configured
- QA: Not started
- Regression: Not started
- Deployment: Not configured
- Smoke test: Not performed

## Open Reviews

- Pull Request: None
- Feature: CFL-2 — Application Foundation
- Owner: Eldad
- Reviewer: Not required under the approved Foundation exception
- Review status: Formal Code Review is not used for the four Foundation Features
- CI status: Not configured

## Open Bugs and Blockers

- No active product Bug is currently recorded here
- Gavi's Jira and GitHub access must be confirmed before his first Feature begins
- Open design decisions remain in design.md and must not be assumed by an AI

## Approved Operating Decisions

- Foundation belongs to v0.1.0 — Basic Calculator MVP
- CFL-2, CFL-9, CFL-10, and CFL-11 are performed directly on `main`
- The four Foundation Features do not use a Feature branch, pull request, reviewer, or formal Code Review stage
- Foundation Jira flow is Selected for Development → In Progress → QA → Ready for Deployment → Done
- Foundation work still requires human approvals, verification, testing, Jira updates, SECOND_BRAIN.md updates, evidence, deployment checks, and smoke testing where relevant
- Verified Foundation changes are committed to `main` only after explicit human approval
- Every non-Foundation Feature uses one Git branch and one primary pull request unless another exception is explicitly approved
- One human owner per Feature
- The other team member is the primary reviewer for non-Foundation Features
- AI agents may move Jira items between stages only according to PROJECT_PLAN.md
- Human approval is mandatory at the defined control points
- Mandatory regression testing is part of every QA cycle
- Functional defects discovered during QA are documented as Jira Bugs
- QA should use the Vercel Preview when available
- Production smoke testing happens after merge and Production deployment
- Jira and GitHub are the live sources of truth
- SECOND_BRAIN.md is a concise operational summary, not a duplicate backlog
- The process is model-agnostic and may be used with Codex, Claude, or Google models
- Docker is not part of the project scope

## Mandatory AI Start Checklist

Before acting, the AI must confirm:

- PROJECT_PLAN.md was read
- SECOND_BRAIN.md was read
- design.md was read when UI is involved
- Human owner is known
- Current Feature is known
- Current Work Item is known
- Foundation or standard work mode is known
- Jira ownership, release, status, dependencies, and acceptance criteria were checked
- Current branch and pull-request state were checked
- Required human approval was identified
- No conflict exists between the documents, Jira, and GitHub

## Mandatory AI Milestone Updates

Update this file when:

- a Feature is selected
- implementation starts
- a pull request is opened
- review is approved or changes are requested
- QA starts
- a blocker or meaningful Bug is discovered
- QA and regression complete
- the Feature reaches Ready for Deployment
- merge, deployment, and smoke test complete
- the next safe action changes

## Latest Handoff

- Work completed: Foundation release and direct-on-main exception were approved; documentation corrections were prepared
- Files or areas changed: PROJECT_PLAN.md and SECOND_BRAIN.md in the working tree
- Verification performed: Jira CFL-2 and CFL-15, GitHub branches and pull requests, local `main`, and the required project documents were checked
- Current risks: The repository implementation state has not yet been reviewed; unit testing, CI, and deployment are not yet configured
- Next safe action: After human approval of these documentation changes, commit them to `main`, then begin CFL-15 and move only CFL-15 to In Progress
