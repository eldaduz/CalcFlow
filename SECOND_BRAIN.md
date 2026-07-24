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

- Release: Foundation phase before v0.1.0
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
- Branch: Not created yet
- Current Work Item: CFL-15 — Review Existing Repository Configuration
- Jira status: Selected for Development
- Pull Request: Not opened
- Blockers: None currently recorded
- Next required action: Read the repository state and present a short development plan for approval

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
- Required action: Present a short development and verification plan before moving CFL-15 to In Progress
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
- Jira backlog: Product Epics, Features, Stories, Tasks, releases, ownership split, and foundation sequence prepared
- Unit tests: Not yet configured
- QA: Not started
- Regression: Not started
- Deployment: Not configured
- Smoke test: Not performed

## Open Reviews

- Pull Request: None
- Feature: None
- Owner: None
- Reviewer: None
- Review status: Not applicable
- CI status: Not configured

## Open Bugs and Blockers

- No active product Bug is currently recorded here
- Gavi's Jira and GitHub access must be confirmed before his first Feature begins
- Open design decisions remain in design.md and must not be assumed by an AI

## Approved Operating Decisions

- One Git branch per Jira Feature
- One primary pull request per Feature
- One human owner per Feature
- The other team member is the primary reviewer
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

- Work completed: Approved project workflow and operating rules were consolidated into PROJECT_PLAN.md and this SECOND_BRAIN.md
- Files or areas changed: PROJECT_PLAN.md, SECOND_BRAIN.md
- Verification performed: Files created in the GitHub main branch
- Current risks: The repository implementation state has not yet been reviewed; unit testing, CI, and deployment are not yet configured
- Next safe action: Eldad's AI reads PROJECT_PLAN.md, SECOND_BRAIN.md, design.md, Jira CFL-2 and CFL-15, and the current repository configuration, then presents a short plan for CFL-15 before coding or changing Jira status
