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
- Overall status: CFL-9 and CFL-10 have passed feature-level QA; CFL-11 remains in progress pending Gavi's separate-machine validation. CFL-2 completion confirmation remains deferred.

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
- Current Work Items: CFL-49 — Validate Environment Reproduction with Gavi is pending under CFL-11
- Jira status: CFL-2 remains Ready for Deployment; CFL-9 and CFL-10 are ready for deployment after QA; CFL-11 is In Progress
- Pull Request: None; not required for the approved Foundation Features
- Blockers: CFL-49 requires Gavi to validate a clean install and the documented commands on his own machine
- Next required action: Obtain Gavi's CFL-49 validation, then complete CFL-11 QA

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
- Current Feature: CFL-11 — Foundation Documentation and Verification
- Work mode: Direct on `main`; no Feature branch or pull request
- Required action: Await Gavi's CFL-49 environment-reproduction evidence; CFL-9 and CFL-10 await separate Feature-level commit approval
- Human approval required: Received to implement CFL-9, CFL-10, and CFL-11; required again before each Feature-level commit

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
- CFL-15 review: Repository configuration review and approved corrective changes passed combined QA
- CFL-15/CFL-34 installment: Committed directly to `main` in `96d8ff5`
- CFL-2 Feature QA: Passed for CFL-15, CFL-34, CFL-35, and CFL-36
- CFL-2 Feature commit: Committed directly to `main` in `b28120c`
- Package state: package.json and package-lock.json are aligned at version 0.1.0, and installed direct dependencies resolve successfully
- Configuration findings: duplicate Prettier configuration was removed, ESLint now covers future `src` files, and README formatting passes
- Application state: React 19 and Vite 8 are initialized with a minimal `src/main.jsx` entry point and `src/App.jsx` application shell; `dev`, `build`, and `preview` scripts exist
- Development standards: Node `^20.19.0 || >=22.12.0` and npm `>=10.0.0` are documented; clean package installation, lint, and formatting checks pass
- Unit tests: Vitest 4 with jsdom is configured; the App shell has one meaningful render test and both test and coverage commands pass
- QA: CFL-9/CFL-10 feature-level QA passed: clean `npm ci`, dependency check, entry verification, lint, formatting, test, coverage, build, diff, and dev/preview HTTP 200 smoke checks
- Regression: CFL-15/CFL-34 combined regression passed
- Deployment: Not configured
- Smoke test: Local development server returned HTTP 200

## Open Reviews

- Pull Request: None
- Feature: CFL-2 — Application Foundation
- Owner: Eldad
- Reviewer: Not required under the approved Foundation exception
- Review status: Formal Code Review is not used for the four Foundation Features
- CI status: Not configured

## Open Bugs and Blockers

- No active product Bug is currently recorded here
- CFL-2 awaits deployment/human smoke confirmation; CFL-49 requires Gavi to verify the later foundation setup in his own environment
- Gavi's Jira and GitHub access must be confirmed before his first Feature begins
- Open design decisions remain in design.md and must not be assumed by an AI

## Approved Operating Decisions

- Foundation belongs to v0.1.0 — Basic Calculator MVP
- CFL-2, CFL-9, CFL-10, and CFL-11 are performed directly on `main`
- The four Foundation Features do not use a Feature branch, pull request, reviewer, or formal Code Review stage
- Foundation Jira flow is Selected for Development → In Progress → QA → Ready for Deployment → Done
- Foundation work still requires human approvals, verification, testing, Jira updates, SECOND_BRAIN.md updates, evidence, deployment checks, and smoke testing where relevant
- Temporary CFL-15/CFL-34 exception: CFL-15 remained In Progress while CFL-34 proceeded; their QA and regression were combined, and neither entered Code Review
- Commit policy: The CFL-15/CFL-34 installment was committed in `96d8ff5` and CFL-2 completion in `b28120c`; each remaining Foundation Feature will use one direct-main commit after its Feature-level verification and approval
- Sequencing decision: Human approval allows CFL-9, CFL-10, and CFL-11 to proceed while CFL-2 remains Ready for Deployment; CFL-2's final confirmation is deferred
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

- Work completed: Foundation policy corrections were committed to `main` in `746906c`; CFL-15/CFL-34 were committed in `96d8ff5`; CFL-2 completion was committed in `b28120c`
- Files or areas changed: CFL-35 structure documentation, Feature-level QA evidence, and SECOND_BRAIN.md
- Verification performed: clean `npm ci`, `npm ls --depth=0`, entry-point verification, `npm run lint`, `npm run format:check`, `npm run build`, local development and preview HTTP 200 smoke tests, and `git diff --check` passed
- Current risks: CFL-49 remains an external human validation gate; CI and deployment are not configured
- Next safe action: Gavi completes CFL-49 on his machine. Separately, request approval for the CFL-9 and CFL-10 Feature-level direct-main commits.
