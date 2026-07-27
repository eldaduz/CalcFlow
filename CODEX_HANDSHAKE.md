# CalcFlow handoff

## Verified state

- CFL-17, CFL-55, CFL-56: Done; PR #13 merged; Vercel and production smoke passed.
- PR #14: draft, `chore/cfl17-done-docs`; updates `SECOND_BRAIN.md`.
- CFL-18: Gavi-owned, Code Review; PR #10 open.
- CFL-19: Eldad-owned, Backlog; blocks CFL-20.

## Current decision

- User approved CFL-19 task-level model escalation: Terra / Medium by default; Terra / High only for tangent tolerance, angle-mode contract, or cross-feature failure.
- `CODEX_MODEL_GUIDE.md` still conflicts: CFL-19 default is Terra / High.

## Next action

1. Create a separate CFL-19 guide-update branch from `main`; update its matrix to Terra / Medium with the approved High escalation triggers; open PR and merge it.
2. Re-read required project documents, verify Jira/GitHub, present CFL-19 plan, and begin after approval.

## Restart prompt

Continue CalcFlow CFL-19. Read `AGENTS.md`, `PROJECT_PLAN.md`, `SECOND_BRAIN.md`, `CODEX_MODEL_GUIDE.md`, and `design.md`. Verify live Jira/GitHub. Preserve PR #14 scope. Use Caveman and Ponytail. Update the CFL-19 model matrix before starting Feature work.
