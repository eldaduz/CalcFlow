# CalcFlow Second Brain

## Purpose

This file is the concise operational handoff for CalcFlow.

It does not replace Jira, GitHub, PROJECT_PLAN.md, or design.md.

Every AI agent must read this file before planning, coding, changing Jira, opening or reviewing a pull request, merging, deploying, or updating project state.

The AI must verify all live information against Jira and GitHub before acting.

## Last Updated

- Date: 2026-07-25
- Updated by: Gavi / Claude
- Human owner: Gavi
- AI used: Claude

## Current Release

- Release: v0.1.0 — Basic Calculator MVP
- Current phase: Foundation
- Goal: Establish the repository, development standards, unit testing foundation, and project documentation
- Overall status: CFL-9 and CFL-10 have passed feature-level QA; CFL-11 remains in progress pending Gavi's separate-machine CFL-49 validation. CFL-48's package repair was committed to `main` in `72c5a81`. CFL-2 completion confirmation remains deferred. A temporary, approved sequencing exception allows CFL-16 preparation for v0.2.0 while this external Foundation validation is pending.

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

- Jira Feature: CFL-11 — Foundation Documentation and Verification
- Owner: Eldad
- Work mode: Direct on `main` under the approved Foundation exception
- Branch: No Feature branch; current branch is `main`
- Current Work Items: CFL-48 — Verify Clean Installation and Quality Commands is committed in `72c5a81`; CFL-49 — Validate Environment Reproduction with Gavi is In Progress with validation evidence recorded (2026-07-25)
- Jira status: CFL-2 remains Ready for Deployment; CFL-9 and CFL-10 are ready for deployment after QA; CFL-11 is In Progress; CFL-48 is In Progress; CFL-49 is In Progress, evidence attached, awaiting human approval to move to QA
- Pull Request: None; not required for the approved Foundation Features
- Blockers: None currently; CFL-49 evidence is recorded and needs human review/approval before QA
- Next required action: Human owner reviews CFL-49 evidence and approves the move to QA; CFL-11 can then proceed toward Ready for Deployment

### Eldad — approved parallel preparation

- Jira Feature: CFL-16 — Expression Evaluation
- Owner: Eldad
- Jira status: Selected for Development
- Work mode: Standard non-Foundation workflow; preparation only under the approved temporary sequencing exception
- Branch and Pull Request: None yet; create `feature/CFL-16-expression-evaluation` only after the planning approval
- First Work Item: CFL-52 — Select and Document the Expression Parser Approach (Backlog)
- Dependencies: CFL-14 is independent and may proceed in parallel; CFL-16 blocks CFL-17, CFL-18, CFL-20, and CFL-21
- Next required action: Switch to GPT-5.6 Sol / High for the parser-planning decision, present the plan, and obtain human approval before creating a branch or moving CFL-52 to In Progress

### Gavi

- Jira Feature: CFL-11 — Foundation Documentation and Verification (supporting Eldad's Feature by completing its blocking child item)
- Branch: None; direct on `main` at `4cbd443` under the approved Foundation exception
- Current Work Item: CFL-49 — Validate Environment Reproduction with Gavi (moved to In Progress, evidence recorded, awaiting human approval to move to QA)
- Jira status: CFL-49 In Progress with validation evidence comment attached
- Pull Request: None; not required for the approved Foundation Features
- Blockers: None currently; awaiting human approval to progress CFL-49 to QA
- Next required action: Human approval to move CFL-49 (and CFL-11 once complete) to QA; then select Gavi's first own Feature (CFL-12 — Basic Arithmetic is next in the approved ownership/release sequence, still in Backlog)

## Next Approved Work

### Eldad

- Current Foundation Feature: CFL-11 — Foundation Documentation and Verification (In Progress; blocked on Gavi's CFL-49 validation)
- Selected parallel Feature: CFL-16 — Expression Evaluation (Selected for Development; no implementation started)
- Work mode: CFL-11 stays direct on `main`; CFL-16 uses the standard branch-and-PR workflow after planning approval
- Required action: For CFL-16, obtain Sol / High parser-planning approval before any branch or work-item transition; for CFL-11, wait for Gavi's CFL-49 evidence
- Human approval required: Received for this temporary sequencing arrangement; required again for CFL-16 planning, implementation, branch creation, and all Feature-level commits

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
- CFL-48 repair: `package.json` now records npm 11.16.0 as the package manager, and npm 11.16.0 regenerated `package-lock.json` with the missing cross-platform `@emnapi/core` and `@emnapi/runtime` records
- CFL-48 commit: Package repair was committed and pushed to `main` in `72c5a81` (`chore: update package manager to npm 11.16.0 and regenerate lockfile for cross-platform dependency consistency`)
- CFL-48 verification: Node 24.18.0/npm 11.16.0 clean `npm ci`, Linux/WASM dry-run installs, dependency validation, lint, formatting, tests, coverage, build, and development/preview HTTP 200 smoke checks passed
- Package state: package.json and package-lock.json are aligned at version 0.1.0, and installed direct dependencies resolve successfully
- Configuration findings: duplicate Prettier configuration was removed, ESLint now covers future `src` files, and README formatting passes
- Application state: React 19 and Vite 8 are initialized with a minimal `src/main.jsx` entry point and `src/App.jsx` application shell; `dev`, `build`, and `preview` scripts exist
- Development standards: Node `^20.19.0 || >=22.12.0` and npm `11.16.0` are documented; npm 11.16.0 is recorded as the lockfile-generating package manager; clean package installation, lint, and formatting checks pass
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
- CFL-2 awaits deployment/human smoke confirmation
- CFL-49 evidence recorded 2026-07-25; awaiting human approval to move to QA (not a functional Bug — see environment notes below)
- Environment note: Gavi's machine has global Node/npm installed via the root-owned nodejs.org `.pkg` installer; global npm cannot be upgraded without sudo. Resolved for this project via Corepack shims in `~/.local/bin` (no root needed) rather than a global npm upgrade.
- Environment note: on Gavi's machine, `npm run preview` / `npx vite preview` hangs and never binds to a port; running `node node_modules/vite/bin/vite.js preview` directly works correctly. Use the direct invocation for preview smoke checks on this machine.
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
- Temporary sequencing/WIP exception: While CFL-11 waits for Gavi's CFL-49 external validation, Eldad may prepare CFL-16 for v0.2.0. This does not start implementation or waive the standard branch, pull request, peer-review, QA, deployment, or smoke-test requirements.
- Jira dependency correction: CFL-14 and CFL-16 are independent and may proceed in parallel. CFL-16 blocks CFL-17, CFL-18, CFL-20, and CFL-21.
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

- Work completed: CFL-49 environment validation performed by Gavi on `main` at `4cbd443`; evidence recorded as a Jira comment on CFL-49 and CFL-49 moved to In Progress
- Files or areas changed: None in the repository; working tree confirmed clean before and after validation (no commit made)
- Verification performed: Node v24.15.0 (satisfies engines range) / npm 11.16.0 via Corepack (no sudo) clean `npm ci`; lint; format:check; test; coverage (100%); build; dev server HTTP 200; preview server HTTP 200 via direct vite binary invocation (npm/npx wrapper hangs on this machine — documented above)
- Current risks: CI and deployment are not configured; CFL-49/CFL-11 need human approval to proceed to QA; the npm/npx preview-hang and root-owned global npm install are documented environment quirks, not resolved at the system level
- Next safe action: Human owner reviews CFL-49 evidence and approves moving CFL-49 (and CFL-11 once its other items are complete) to QA; once Foundation reaches Ready for Deployment, Gavi's first Feature (CFL-12 — Basic Arithmetic) can be selected per the approved sequence
