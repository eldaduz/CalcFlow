# CalcFlow Project Plan

## 1. Purpose

This document is the mandatory operating plan for CalcFlow. It defines the approved scope, ownership, delivery sequence, Jira workflow, Git strategy, quality gates, human approval points, and AI-agent rules.

Every AI agent working on this repository must read this document before planning, coding, changing Jira, opening or reviewing a pull request, merging, deploying, or updating project state.

## 2. Product Summary

CalcFlow is a frontend-only scientific calculator built with React and Vite.

The project is intentionally small in product complexity and strong in engineering discipline. It demonstrates Agile delivery, clear ownership, clean code, testing, review, release management, CI/CD, logging, dependency governance, and traceable evidence.

### In scope

- Basic arithmetic: addition, subtraction, multiplication, division
- Numeric input, decimals, negative values, clear, delete, result display
- Error handling and recovery
- Expressions and parentheses
- Powers and roots
- Logarithmic and trigonometric functions
- Degree and radian modes
- Percentage, absolute value, factorial, pi, and e
- Calculation history
- Memory operations
- Keyboard support
- Responsive layout
- Accessibility
- Application logging and JSON log export
- Unit tests, QA, regression testing, CI/CD, releases, and deployment
- Novelty telemetry: button-press/trace-span logging, ridiculous usage metrics, and a parody cookie-consent banner (Epic CFL-6 extension via CFL-90/CFL-91, and Epic CFL-92) -- a comedic implementation of the same logging, tracing, and metrics capabilities the project already demonstrates seriously elsewhere, not a separate product goal

### Out of scope

- Backend or API
- Database
- Authentication
- Cloud-stored user data
- Graphing
- Unit conversion
- Native mobile applications
- Docker
- AWS unless explicitly reintroduced as an optional bonus
- Alerting or monitoring (even in the novelty-telemetry spirit above) -- judged excessive for a calculator

## 3. Sources of Truth

The project uses the following sources of truth:

- **Jira**: work items, hierarchy, ownership, estimates, dependencies, releases, and live status
- **GitHub**: code, branches, commits, pull requests, reviews, CI checks, tags, and releases
- **design.md** (repo root): approved UI and UX rules
- **docs/agents/PROJECT_PLAN.md** (this file): permanent process, scope, workflow, ownership, quality, and delivery rules
- **docs/agents/SECOND_BRAIN.md**: current operational state, active work, latest handoff, blockers, and next safe action
- **docs/agents/CODEX_MODEL_GUIDE.md**: approved Codex model, reasoning, escalation, and manual-switch rules

When information conflicts:

1. Jira and GitHub define the live state.
2. PROJECT_PLAN.md defines the approved permanent rules.
3. CODEX_MODEL_GUIDE.md defines Codex configuration rules.
4. SECOND_BRAIN.md provides the latest operational summary.
5. The AI must stop and report the conflict rather than guessing.

## 4. Team and AI Usage

### Human owners

- **Eldad**: works mainly with Codex and may also use Google or Claude models through AGY
- **Gavi**: works mainly with Claude and may also use Google models

The process is model-agnostic. Human ownership and approval remain authoritative regardless of the AI model used.

### Mandatory AI startup procedure

Before any action, every AI agent must:

1. Read PROJECT_PLAN.md completely.
2. Read SECOND_BRAIN.md completely.
3. Read design.md before any UI-related change.
4. Check the relevant Jira Product Epic, Feature, child work items, dependencies, release, ownership, status, and acceptance criteria.
5. Check the current Git branch, open pull requests, review state, and CI state.
6. Summarize the current state, proposed work, expected tests, and required human approval.
7. Stop if any conflict, missing permission, unresolved dependency, or unclear approval exists.

### Mandatory AI completion procedure

At every meaningful milestone, the AI must:

1. Verify the performed work.
2. Update Jira according to the rules in this document.
3. Update SECOND_BRAIN.md in the working branch.
4. Record the current branch, pull request, verification, blockers, and next safe action.
5. Never claim work is complete without evidence.

## 5. Jira Hierarchy

CalcFlow uses this hierarchy:

- Product Epic
- Feature
- Story / Task / Bug
- Sub-task when needed

### Ownership rule

Each Feature has one human owner.

The Feature owner is responsible for:

- all Stories, Tasks, Bugs, and tests under that Feature;
- implementation and unit tests;
- responding to review comments;
- QA preparation and bug fixes;
- documentation required by the Feature;
- keeping Jira and SECOND_BRAIN.md accurate through the AI agent.

The other team member is the primary human reviewer for non-Foundation Features. The four approved Foundation Features use explicit human approval instead of formal peer review.

## 6. Approved Feature Ownership

### Eldad

- Project Foundation
- Expression Evaluation
- Powers and Roots
- Trigonometric Functions
- Angle Mode
- Application Logging
- Continuous Integration
- Release Management
- Dependency Governance

### Gavi

- Basic Arithmetic
- Basic Calculator Interaction
- Expression Input and Editing
- Logarithmic Functions
- Additional Scientific Operations
- Calculation History
- Memory Operations
- Keyboard Support
- Responsive Interface
- Accessibility
- Log Export and Submission Evidence
- Vercel Deployment
- License Reporting

The agreed workload is approximately balanced: 76 Story Points for Eldad and 75 Story Points for Gavi, counting child Stories and Tasks rather than parent Feature estimates.

## 7. Release Sequence

### v0.1.0 — Basic Calculator MVP

Foundation:

1. Application Foundation
2. Development Standards
3. Unit Testing Foundation
4. Foundation Documentation and Verification

MVP functionality:

- Basic Arithmetic
- Basic Calculator Interaction

### v0.2.0 — Expressions and Parentheses

- Expression Input and Editing
- Expression Evaluation

### v0.3.0 — Powers and Roots

- Powers and Roots

### v0.4.0 — Scientific Functions

- Logarithmic Functions
- Angle Mode
- Trigonometric Functions
- Additional Scientific Operations

### v0.5.0 — History and Memory

- Calculation History
- Memory Operations

### v0.6.0 — Complete User Experience

- Keyboard Support
- Responsive Interface
- Accessibility

### v1.0.0 — Stable Final Release

- Application Logging
- Log Export and Submission Evidence
- Continuous Integration
- Vercel Deployment completion
- Release Management
- Dependency Governance
- License Reporting
- Final stabilization and regression

Jira dependencies override this general sequence when a linked blocker exists.

## 8. Foundation Execution Order

The approved first sequence is:

1. CFL-2 — Application Foundation
   - First work item: CFL-15 — Review Existing Repository Configuration
2. CFL-9 — Development Standards
3. CFL-10 — Unit Testing Foundation
4. CFL-11 — Foundation Documentation and Verification

The AI must not choose freely among these four Features. It must follow this sequence and the Jira dependency links.

### Approved Foundation delivery exception

The following four Foundation Features are an approved exception to the standard Feature branch and pull-request workflow:

- CFL-2 — Application Foundation
- CFL-9 — Development Standards
- CFL-10 — Unit Testing Foundation
- CFL-11 — Foundation Documentation and Verification

For these four Features only:

- work is performed directly on `main`;
- no Feature branch is created;
- no pull request is opened;
- no reviewer is requested;
- the formal Code Review stage is skipped;
- human approval remains mandatory before implementation or any material change;
- relevant verification, lint, tests, coverage, build, and clean-install checks remain mandatory;
- Jira and SECOND_BRAIN.md updates remain mandatory;
- findings, decisions, and verification evidence must be documented;
- changes may be committed to `main` only after the approved work is complete, verified, and approved for commit.

The Foundation Jira flow is:

```text
Selected for Development
→ In Progress
→ QA
→ Ready for Deployment
→ Done
```

All non-Foundation Features follow the standard branch, pull-request, reviewer, Code Review, QA, deployment, and smoke-test workflow.

## 9. Git Branch Strategy

### Branch rule

Except for the four named Foundation Features in Section 8, use one Git branch per Jira Feature.

Examples:

```text
feature/CFL-12-basic-arithmetic
feature/CFL-16-expression-evaluation
```

### Rules

- CFL-2, CFL-9, CFL-10, and CFL-11 are performed directly on `main` under the approved Foundation exception.
- For every non-Foundation Feature, a Feature branch is created from an updated main branch.
- All Stories and Tasks under a non-Foundation Feature are developed in that branch.
- One human owns the Feature branch.
- Eldad and Gavi must not develop concurrently on the same Feature branch.
- Unrelated work must not be added to the branch.
- One pull request is normally opened at the end of the Feature.
- An intermediate pull request is allowed only when the Feature is unusually large, risky, or needs early integration.
- Direct commits to main are not allowed except for the approved Foundation exception or an exceptional administrative correction explicitly approved by both team members.

### Pull request naming

```text
CFL-<feature-number>: <Feature name>
```

### Reviewer rule

When the pull request is opened, the AI should request review from the other team member automatically when GitHub permissions allow it.

- Eldad-owned Feature → Gavi is requested as reviewer
- Gavi-owned Feature → Eldad is requested as reviewer

GitHub review requests and notifications are the formal review signal. WhatsApp may be used manually as a practical backup notification.

## 10. Jira Workflow

The approved workflow is:

```text
Backlog
→ Selected for Development
→ In Progress
→ Code Review
→ QA
→ Ready for Deployment
→ Done
```

For CFL-2, CFL-9, CFL-10, and CFL-11 only, the approved workflow is:

```text
Selected for Development
→ In Progress
→ QA
→ Ready for Deployment
→ Done
```

These Foundation Features do not enter Code Review because they do not use a branch, pull request, or reviewer. All other Features use the standard workflow.

### Status meaning

- **Backlog**: not yet approved for near-term work
- **Selected for Development**: approved as upcoming work
- **In Progress**: active implementation is taking place
- **Code Review**: for non-Foundation Features, implementation and unit tests are complete, and the pull request awaits review
- **QA**: the pull request is approved for a non-Foundation Feature, or approved Foundation work is ready for QA and regression testing
- **Ready for Deployment**: QA and regression passed, relevant bugs are resolved, and the Feature is ready to merge or commit and deploy
- **Done**: merged or committed to main, deployed, and smoke-tested successfully

## 11. Complete Feature Delivery Cycle

The standard branch and pull-request steps in this section apply to all non-Foundation Features. CFL-2, CFL-9, CFL-10, and CFL-11 use the approved Foundation delivery cycle below.

### Foundation delivery cycle

For each approved Foundation Feature, the AI must:

1. Verify Jira, GitHub, ownership, release, dependencies, acceptance criteria, and the current `main` state.
2. Present a short development plan and receive human approval.
3. Move only the child item whose work is actually beginning to In Progress.
4. Perform the approved work directly on `main` without creating a branch or pull request.
5. Preserve valid configuration, limit changes to the approved scope, and update Jira and SECOND_BRAIN.md at required milestones.
6. Run all relevant verification, lint, tests, coverage, build, clean-install, and regression checks, documenting evidence and risks.
7. Present a QA plan and receive human approval before moving the Feature and completed children directly from In Progress to QA.
8. After QA and regression pass, move the Feature and completed children to Ready for Deployment and present the verification evidence.
9. Commit directly to `main` only after the work is complete, verified, and explicitly approved for commit.
10. Deploy and smoke-test when applicable, then move the Feature and completed children to Done only after human confirmation.

No branch, pull request, reviewer, or formal Code Review is required for these four Foundation Features. Human approvals, testing, evidence, Jira updates, SECOND_BRAIN.md updates, deployment checks, and smoke-test requirements still apply where relevant.

### Step 1 — Select the next Feature

The AI must:

1. Read PROJECT_PLAN.md and SECOND_BRAIN.md.
2. Verify Jira and GitHub live state.
3. Identify the next Feature according to the approved sequence and resolved dependencies.
4. Present the Feature and its planned child-item order to the human owner.
5. Receive human approval.
6. Move the Feature and relevant child items from Backlog to Selected for Development when needed.

The AI must not start an arbitrary Backlog item.

### Step 2 — Prepare the development plan

The AI presents a short plan containing:

- Feature and current child work item
- intended code areas
- acceptance criteria covered
- unit tests and verification to be added
- known dependencies and exclusions

The human owner approves the plan before implementation begins.

### Step 3 — Start implementation

After plan approval, the AI:

1. Creates or checks out the Feature branch.
2. Moves the active child work item to In Progress.
3. Implements only the approved scope.
4. Adds unit tests where meaningful.
5. Runs lint, formatting checks, tests, coverage when available, and build verification.
6. Progresses through the Feature children according to Jira dependencies.

Only the currently active Story or Task is moved to In Progress. Other children remain Selected for Development until their work begins.

### Step 4 — Open pull request and enter Code Review

When the complete Feature implementation and unit tests are ready, the AI:

1. Performs self-review.
2. Runs all required automated checks.
3. Opens one pull request from the Feature branch to main.
4. Requests the other team member as reviewer.
5. Moves the Feature and completed child items to Code Review.
6. Updates SECOND_BRAIN.md.

### Step 5 — Human peer review

The other team member reviews the pull request, with or without AI assistance.

The reviewer may:

- approve;
- leave comments;
- request changes.

The Feature owner addresses review comments in the same Feature branch.

At least three significant pull requests must contain visible peer-review evidence, meaningful comments, and documented fixes following review.

### Step 6 — Verify approval and enter QA

The AI must verify directly in GitHub that:

- the pull request is approved;
- there is no active Changes Requested state;
- required CI checks have passed;
- no unresolved review issue blocks progress.

Only after this verification may the AI move the Feature and relevant child items from Code Review to QA.

### Step 7 — Prepare QA plan

The AI presents a short QA plan for human approval.

The plan must include:

- acceptance-criteria tests;
- edge cases;
- negative tests;
- manual UI checks when relevant;
- mandatory regression testing;
- lint, test, coverage, and build verification;
- Vercel Preview testing when available.

QA must not begin until the Feature owner approves the plan.

### Step 8 — Execute QA and regression

The AI performs or assists with the approved QA plan.

Regression testing is mandatory for every Feature and must verify that previously completed calculator behavior still works.

Typical verification includes:

```text
npm ci
npm run lint
npm run format:check
npm test
npm run coverage
npm run build
```

Use the actual repository scripts when names differ.

### Step 9 — Record and fix bugs

A Jira Bug must be created when QA finds a functional defect, regression, incorrect calculation, broken acceptance criterion, accessibility defect, deployment defect, or meaningful user-facing failure.

The Bug must be:

- linked to the affected Feature and release;
- assigned to the Feature owner;
- prioritized;
- fixed in the same Feature branch before merge;
- retested;
- included in regression evidence.

A trivial typo, formatting correction, or purely internal cleanup may be documented in the QA notes without a separate Bug when it has no functional impact.

### Step 10 — Ready for Deployment

When QA and regression pass and relevant Bugs are resolved, the AI:

1. Moves the Feature and completed children to Ready for Deployment.
2. Presents a concise completion summary to the human owner.
3. Lists implementation, tests, regression, bug fixes, CI status, and remaining risks.
4. Waits for explicit human approval to merge.

### Step 11 — Merge, deploy, and smoke test

After human approval, the AI may:

1. Merge the pull request into main.
2. Confirm the Vercel Production deployment.
3. Run or assist with a Production smoke test.
4. Update Jira to Done only after successful deployment and smoke test.
5. Update SECOND_BRAIN.md in main through the merged pull request or an approved follow-up documentation commit.
6. Identify the next Feature candidate and begin the cycle again only after human approval.

## 12. QA, Regression, and Smoke Testing

### Unit testing

Unit tests are part of implementation and are owned by the Feature owner.

### QA

QA validates the complete Feature against acceptance criteria and real user behavior.

### Regression

Regression is mandatory during every QA cycle. It checks previously completed functionality, not only the new Feature.

### Vercel Preview

When available, the Feature pull request should be tested on its Vercel Preview deployment before merge.

### Production smoke test

After merge, Vercel deploys main to Production. The smoke test is a short validation on the actual Production URL.

It typically confirms:

- the site loads;
- the calculator renders correctly;
- core calculations still work;
- the new Feature works;
- there is no major console or runtime error;
- responsive layout is not visibly broken.

One human owner must confirm that the Production smoke test succeeded before the Feature is moved to Done.

## 13. Human Approval Points

Human approval is mandatory:

1. before starting a new Feature;
2. before implementation, after the AI presents the development plan;
3. for scope, architecture, ownership, dependency, release, or workflow changes;
4. during pull-request review by the other team member for non-Foundation Features;
5. before QA, after the AI presents the QA plan;
6. before merge and deployment, after the Ready for Deployment summary;
7. before marking Done, by confirming the Production smoke test.

The AI must stop at these points and must not infer approval.

For the four Foundation Features, formal peer review is replaced by explicit human approval before material changes, before QA, before committing verified work to `main`, before deployment, and before marking Done.

## 14. WIP Rules

- Each developer normally has one Feature in active development.
- A previous Feature may remain in Code Review or QA while the next approved Feature starts only when the configured Jira WIP limits allow it.
- Multiple child items under the same Feature must not be moved to In Progress without actual parallel work.
- Blocked work must be documented rather than hidden by starting unrelated work automatically.

## 15. Second Brain Rules

SECOND_BRAIN.md must exist in main so every standard Feature branch begins with the latest merged operational summary and Foundation work performed directly on `main` has a current handoff.

Git does not keep a file automatically synchronized across branches. Therefore:

- every AI reads SECOND_BRAIN.md from the latest main state before starting;
- Jira and GitHub are checked for live changes that may not yet be merged into the file;
- the Feature owner updates SECOND_BRAIN.md inside the Feature branch at required milestones for standard Features;
- the update reaches main through the Feature pull request for standard Features;
- for the four Foundation Features, the Feature owner updates SECOND_BRAIN.md directly on `main` at the same required milestones;
- during parallel work, each AI updates only its own owner/Feature section where possible;
- before continuing long-running work, the Feature branch must be synchronized with main;
- merge conflicts in SECOND_BRAIN.md must be resolved using Jira and GitHub as the live truth;
- SECOND_BRAIN.md must remain concise and must not duplicate the full Jira backlog.

Required update milestones:

- Feature selected
- Feature implementation started
- pull request opened
- review approved or changes requested
- QA started
- blocker or meaningful Bug discovered
- QA and regression completed
- Feature marked Ready for Deployment
- merge, deployment, and smoke test completed
- next safe action identified

## 16. Clean Code and Architecture

- Prefer simple and clear solutions.
- Do not use eval.
- Avoid AI-generated over engineering.
- Do not add abstractions without demonstrated need.
- Both human team members must be able to understand and explain merged code.
- Package choices must prioritize correctness, reliability, security, maintainability, and clarity.
- Existing repository configuration must be reviewed before being replaced.

## 17. Logging Rules

The application must log:

- successful calculations when relevant;
- calculation errors;
- invalid input;
- unexpected application errors;
- relevant state-changing actions when they provide useful evidence.

Do not log:

- every click;
- personal or sensitive information;
- secrets;
- excessive noise.

**Novelty-telemetry exception (CFL-90/CFL-91):** the "every click" restriction above does not apply to the deliberately comedic button-press/trace-span logging approved as its own in-scope item (see Product Summary). That data shares the same underlying logger as the real events above, bounded by a rolling 6-hour window rather than unbounded growth. It must never be written into or alter `logs/calcflow-submission-log.json` -- that file remains limited to the real calculation events this section otherwise governs. Computed novelty metrics (most-pressed button, most common error, etc.) are exported separately, on demand, not as an always-visible panel.

The application must support JSON log export. The final reviewed submission log will be committed under:

```text
logs/calcflow-submission-log.json
```

A logs/README.md file must explain how the log was produced and reviewed.

## 18. CI/CD and Release Rules

Pull requests and main must run appropriate GitHub Actions checks, including:

- dependency installation with npm ci;
- lint;
- formatting validation;
- unit tests;
- coverage when configured;
- production build.

Coverage threshold enforcement is introduced after a stable baseline exists. The target is at least 70% where applicable.

Each release must include:

- correct Jira Fix Version;
- completed release work items;
- passing CI;
- semantic version tag;
- GitHub Release;
- release notes;
- deployment verification;
- Production smoke test.

Release creation and final approval remain human-controlled even when the AI prepares the materials.

## 19. Dependency and License Governance

- Use npm as the package manager unless the team explicitly approves a change.
- Commit the lock file.
- Document meaningful dependency choices.
- Run a final dependency audit.
- Generate and review ALL_LICENSES or the approved equivalent.
- Do not add unnecessary packages.

## 20. Design Control

Before any UI change, the AI must read design.md.

Open design decisions listed in design.md require approval from both team members before permanent implementation.

No AI may independently introduce a new design system, UI library, layout, color system, or interaction pattern.

## 21. Definition of Ready

A Feature is ready to start when:

- ownership is assigned;
- the release is assigned;
- child work items and acceptance criteria are clear;
- dependencies are resolved or explicitly managed;
- the Feature appears in the approved sequence;
- the human owner approves the development plan;
- the WIP limit allows work to start.

## 22. Definition of Done

A Feature is Done only when:

- all approved child work items are complete;
- implementation and unit tests are complete;
- peer review is approved for non-Foundation Features;
- CI checks pass;
- QA and mandatory regression pass;
- relevant Bugs are fixed and retested;
- documentation is updated;
- the pull request is merged to main for non-Foundation Features, or the verified Foundation work is committed directly to `main` under the approved exception;
- Vercel Production deployment succeeds;
- Production smoke test is confirmed by a human;
- Jira and SECOND_BRAIN.md are updated.

## 23. Change Control

Any change to scope, architecture, release order, ownership, workflow, branch policy, approval points, or source-of-truth rules requires:

1. explicit human approval;
2. Jira updates when relevant;
3. PROJECT_PLAN.md update for permanent changes;
4. SECOND_BRAIN.md update for current operational impact.

AI agents must not silently change this plan.
