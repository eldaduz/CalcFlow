# Submission Log

This directory holds the final, reviewed application log evidence
required by CFL-28 (Log Export and Submission Evidence).

## What gets logged

`src/lib/logger.js` records structured, in-memory events during normal use
(see CFL-27, Application Logging). Every event has a `timestamp` and a
`type`, plus event-specific detail. As of this writing, the recorded event
types are:

- `CALCULATION_SUCCESS` — a successful evaluation: the expression, the
  result, and the active angle mode.
- `CALCULATION_ERROR` — a controlled, expected error (e.g. division by
  zero, a logarithm domain error): the expression, angle mode, and the
  error code.
- `UNEXPECTED_EVALUATION_ERROR` — a genuinely unexpected evaluator
  exception, contained so it can never crash the calculator: the
  expression, angle mode, and the underlying error's name/message.

Logging never records personal or sensitive information — only
calculator-internal data (expressions, results, error codes).

## How the log is produced

1. Use the live application (https://calc-flow-fawn.vercel.app/, or a local
   `npm run dev` / `npm run preview`) to exercise a representative set of
   calculator behavior: successful calculations in both Basic and
   Scientific mode, at least one controlled error and its recovery, and
   ideally a broad sample of the shipped functionality.
2. Click **Export Logs** (below History) to download the accumulated
   in-memory log as a JSON file.
3. Rename/move the exported file to `logs/calcflow-submission-log.json` in
   this directory and commit it.

## Review requirement

Per `PROJECT_PLAN.md`'s Feature Delivery Cycle and CFL-28's acceptance
criteria: **one teammate exports and commits the log; the second teammate
reviews the final file before submission.** Do not consider the submission
log final until that second-person review has happened — this mirrors the
project's standard peer-review requirement and is not satisfied by the
exporting teammate alone.
