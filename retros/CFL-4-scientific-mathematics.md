---

# Retro: CFL-4 Scientific Mathematics (retroactive)

**Epic:** CFL-4 — Scientific Mathematics (Done)
**Scope covered:** CFL-17 Powers and Roots, CFL-18 Logarithmic Functions,
CFL-19 Trigonometric Functions, CFL-20 Angle Mode, CFL-21 Additional
Scientific Operations
**Retro held:** 2026-07-30 (retroactive)

## What happened

Denser, more error-prone epic than CFL-3 — five features touching the same
expression reducer concurrently (trig, logs, powers, angle mode, misc
operations), which is visible in the merge-conflict trail below.

## What went well

- `213b646` proactively resolved a high-severity `npm audit` finding
  (minimatch override) rather than letting it sit.
- Angle mode (CFL-20) got dedicated review attention — `9cbf2c8` "resolve
  PR-28 review comments on angle mode" and `2870d74` cleaning up static
  `initialState` and a non-compliant color token both show real review
  cycles, not rubber-stamping.

## What didn't go well

- **Parallel work on the shared reducer caused repeated conflicts.**
  `be97a3d` "fix: resolve CFL-19 merge conflict" and `cd6cf44` "fix:
  reconcile CFL-19 with CFL-21" — two separate reconciliation commits for
  the same pair of features. Trig (CFL-19) and additional operations
  (CFL-21) were developed in parallel against the same evaluator/reducer
  surface without an apparent ownership split, so conflicts had to be
  resolved after the fact rather than avoided.
- **This is the epic where the CFL-89 bug was introduced, not caught here.**
  Angle mode (CFL-20, this epic) added `justEvaluated`-reset branches to the
  reducer that omitted `angleMode` from the returned state literal. That
  regression shipped as part of this epic's "Done" status and was only
  discovered later, incidentally, while implementing CFL-22 (Calculator
  Experience epic) — two epics after the defect was introduced. A retro at
  the close of CFL-4 would have been the right time to ask "did every branch
  of the reducer preserve every top-level state field?" before calling angle
  mode Done.
- No test appears to assert that angle mode survives a `justEvaluated`
  continuation (`+`, `x^y`, nth-root, `x!`, `%`) — the exact gap CFL-89 later
  filled reactively.

## Action items

1. When multiple features touch the same reducer/module concurrently
   (CFL-19 + CFL-21 here), call that out explicitly at kickoff and assign an
   integration owner, rather than discovering the conflict at merge time.
2. Treat "preserve all top-level state fields across every reducer branch"
   as a structural invariant with a test, not a per-feature checklist item —
   this is exactly what let CFL-89 slip through Done. Consider a single
   parameterized test that evaluates every action type from a non-default
   state and asserts no known field is dropped.
3. Retroactively confirm no other `justEvaluated` branch (or future one) has
   the same class of omission beyond what CFL-89's fix already covered.
