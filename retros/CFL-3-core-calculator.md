---

# Retro: CFL-3 Core Calculator (retroactive)

**Epic:** CFL-3 — Core Calculator (Done)
**Scope covered:** CFL-12 Basic Arithmetic, CFL-13 Basic Calculator Interaction,
CFL-14 Expression Input and Editing, CFL-16 Expression Evaluation
**Retro held:** 2026-07-30 (retroactive — no retro was run at the time)

## What happened

First full feature-delivery cycle after CFL-2/CFL-9/CFL-10 foundation work.
Delivered basic arithmetic, calculator interaction, expression input/editing,
and expression evaluation across PRs #1–#9.

## What went well

- Clean PR-per-feature cadence (PR #1 CFL-12, #2 CFL-13, #6/#9 CFL-16, #7
  CFL-14) with review-fix rounds visible in history (e.g. `dade78f` dropping
  `prop-types` per PR #2 review) — review feedback was acted on, not ignored.
- CFL-16's evaluator scope was pinned down in a written decision doc
  (`docs/decisions/CFL-52-expression-parser.md`) before implementation, which
  kept the grammar bounded (no `eval`, explicit length/nesting limits).
- Controlled-error discipline held up early: `04a1270` raised an explicit
  `OVERFLOW` error instead of leaking `Infinity`, and `cb05f2e` contained
  unexpected evaluator failures rather than letting them surface raw.

## What didn't go well

- **Rounding ownership flip-flopped.** `0320094` removed calculation-layer
  rounding from `arithmetic.js` to avoid overflow/truncation, then `e63cb4f`
  (CFL-13) added rounding back at the display layer. The end state is
  probably right (round at display, not at the calculation core), but it
  took two commits and a bug-shaped detour to land there instead of being
  decided up front — this is the same class of problem CFL-89 hit later
  (see CFL-4/CFL-5 retros): state-shape decisions made per-branch instead of
  as a documented invariant.
- **Sequencing exceptions were worked around live, not planned.** `8dc298c`
  and `e508fe8` record a CFL-12/13/14 parallel-sequencing exception and
  sandbox git-lock/npm limitations discovered mid-session, with SECOND_BRAIN
  corrections following (`278919c` "correct SECOND_BRAIN.md CFL-12 PR
  status"). A retro at the end of this epic would have caught that
  "features running in parallel need an explicit sequencing note before
  they start" is a recurring need, not a one-off.
- No regression tests appear to have been added specifically to lock in the
  overflow/rounding fix — nothing in this window's history indicates a test
  was added asserting `OVERFLOW` is raised or that display rounding doesn't
  reintroduce truncation.

## Action items (retroactively identified — consider applying forward)

1. Write down "where rounding happens" as a standing invariant (display
   layer only) so it doesn't get re-litigated per feature — candidate for a
   short decisions doc alongside `CFL-52-expression-parser.md`.
2. When features are deliberately run in parallel, record the sequencing
   exception _before_ starting, not after hitting the conflict.
3. Add a regression test for the CFL-12 overflow fix if one doesn't already
   exist, since the bug was real (`Infinity` leak) and had no PR-linked test
   evidence found in this history scan.
