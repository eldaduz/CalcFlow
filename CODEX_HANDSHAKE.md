# CalcFlow CFL-19 handoff

## Verified state

- Branch/worktree: `feature/CFL-19-trigonometric-functions`, `C:\tmp\calcflow-cfl19`.
- Jira: CFL-19, CFL-59, and CFL-60 are In Progress.
- PR #14 and #15 are merged. CFL-19 matrix is Terra/Medium; Terra/High escalation is active for tangent tolerance.
- Baseline: 119 tests passed. After CFL-59: lint, format, 127 tests, 94.81% statement coverage, build, and diff check passed.

## Changes

- CFL-59: editable Scientific `sin`/`cos` controls; parser supports `sin(...)` and `cos(...)`; evaluator takes DEG/RAD context, defaults RAD, normalizes near-zero residue.
- `SECOND_BRAIN.md` records CFL-59 milestone. Jira CFL-59 comment 10445 records verification.
- CFL-60: `tan` control inserts an editable expression; `tan(45°)` normalizes to `1`; `tan(90°)` returns a controlled error when cosine magnitude is below `1e-12`.
- Approved boundary: CFL-19 supplies evaluator-level DEG/RAD context and defaults UI evaluation to RAD. CFL-20 owns visible DEG/RAD selection, calculator UI forwarding, and session persistence.

## Verification

- Focused evaluator and UI RED/GREEN cycles passed.
- Lint, format check, production build, `git diff --check`, 132 tests, and 94.92% statement coverage passed.

## Next safe action

1. Request the required Terra/Medium configuration for Code Review.
2. Self-review the CFL-19 diff; do not open a PR, begin QA, commit, or change Jira status without approval.

## Restart prompt

Continue CalcFlow CFL-19/CFL-60 from `C:\tmp\calcflow-cfl19`. Read `AGENTS.md`, `PROJECT_PLAN.md`, `SECOND_BRAIN.md`, `CODEX_MODEL_GUIDE.md`, `design.md`, and this file. CFL-60 is locally verified; change to GPT-5.6 Terra / Medium before Code Review. Preserve existing CFL-59 work. Do not open a PR, start QA, commit, or move Jira status without approval.
