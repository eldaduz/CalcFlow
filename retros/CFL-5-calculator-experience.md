---

# Retro: CFL-5 Calculator Experience (retroactive)

**Epic:** CFL-5 — Calculator Experience (Done)
**Scope covered:** CFL-22 Calculation History, CFL-23 Memory Operations,
CFL-24 Keyboard Support, CFL-25 Responsive Interface, CFL-26 Accessibility
**Retro held:** 2026-07-30 (retroactive)

## What happened

UX-facing epic, delivered across PRs #34–#48. v0.5.0 was tagged
(`c6c6b04` "chore(release): prepare v0.5.0") partway through this epic —
after CFL-22/CFL-23/CFL-31 (Release Management) but _before_ CFL-24, 25, 26
landed. The CFL-89 angle-mode regression (introduced in CFL-4) was also
discovered and fixed during this epic's CFL-22 work.

## What went well

- CFL-89 was handled correctly once found: `d667fbe`/`4125033` recorded
  review handoff and a return-to-review after rebase, `3d1fab8` recorded QA
  evidence, and the fix (`975ca9e`) preserved `angleMode` across _all_
  `justEvaluated` continuation branches, not just the one that surfaced the
  bug — the right generalized fix rather than a narrow patch.
- CFL-26 Accessibility didn't just add ARIA labels — `4febfb6` "announce
  results, fix a real contrast bug, verify focus/keyboard reach" shows an
  accessibility pass that found and fixed a genuine issue, not a checkbox
  exercise.
- Governance/compliance work (CFL-32 Dependency Governance, CFL-28/CFL-33
  logging and license reporting) was folded in alongside feature work rather
  than deferred indefinitely.

## What didn't go well

- **The v0.5.0 release boundary didn't line up with the epic boundary.**
  Cutting the release before CFL-24/25/26 were Done means "v0.5.0" and
  "CFL-5 Done" describe different scopes of work — worth a retro question:
  was that intentional (ship what's ready) or did it blur what "v0.5.0"
  actually contains when someone reads back the release notes later?
- **CFL-89 exposes a cross-epic gap, not just a CFL-4 gap.** It was found
  "incidentally while implementing CFL-22" per the bug's own description —
  i.e. by luck of a developer working adjacent code, not by a systematic
  check run at the end of CFL-4 or the start of CFL-5. Nothing in this
  epic's process (kickoff, QA gate) appears to have included "re-verify
  prior epics' reducer branches" as a step.
- Continued SECOND_BRAIN.md status-correction commits throughout this epic
  (`2eb96ab` "correct SECOND_BRAIN status ahead of CFL-25 handoff", `325cc6b`
  "correct SECOND_BRAIN top summary to reflect v0.5.0 Done") — the same
  status-drift pattern flagged in earlier epics kept recurring rather than
  being fixed at the source.

## Action items

1. Decide explicitly whether release tags should always align with epic
   "Done" boundaries going forward, and if not, say so in the release notes
   so v0.5.0's actual scope (CFL-22/23/31, minus 24/25/26) is unambiguous.
2. At the _start_ of a new epic, do a quick sweep of the immediately prior
   epic's changed files for the "did we preserve all state fields / all
   invariants" class of bug CFL-89 represents — don't rely on incidental
   discovery.
3. SECOND_BRAIN.md status corrections are still recurring 3 epics in —
   revisit whether the update mechanism itself needs to change (e.g.
   update-at-transition-time enforcement) rather than continuing to patch
   drift after the fact. Related: existing standing rule to always update
   every Jira status explicitly.
