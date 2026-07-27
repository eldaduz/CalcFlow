# CFL-17 Powers and Roots Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Add expression-integrated powers and real-domain roots without changing the base calculator workflow.

**Architecture:** Extend the existing `evaluateExpression(source)` parser and existing expression reducer. Scientific mode is a thin presentation switch; it shares the same calculator state and keypad surface. No new dependency or standalone math engine.

**Tech Stack:** React 19, Vite, Vitest, native JavaScript math.

## Global Constraints

- Preserve base keypad, expression controls, inline error recovery, and glyph display.
- Use `^` for power, prefix `√` for square root, and infix `√` for nth root.
- Keep roots in the real domain: reject zero root degree, even roots of negative radicands, non-integer degrees for negative radicands, and non-finite results.
- Do not implement CFL-18 through CFL-28 behavior.
- New behavior is test-first and must be observed failing before production code.

### Task 1: Record approved design and kickoff

**Files:**

- Modify: `design.md`
- Modify: `SECOND_BRAIN.md`
- Create: `docs/superpowers/specs/2026-07-27-cfl-17-scientific-surface-design.md`

- [ ] Record the shared-surface contract and document future Feature boundaries.
- [ ] Record branch, active CFL-55 work item, approved notation, and next safe action in `SECOND_BRAIN.md`.

### Task 2: Powers evaluator and expression entry

**Files:**

- Modify: `tests/expression-evaluation.test.js`
- Modify: `tests/expressionEngine.test.js`
- Modify: `src/calculator/expression/evaluateExpression.js`
- Modify: `src/lib/expressionEngine.js`

- [ ] Write failing tests for `2^3`, `2^3^2`, `(-2)^3`, decimal/zero/negative exponents, `0^0`, and zero raised to a negative exponent.
- [ ] Run `npm test -- --run tests/expression-evaluation.test.js tests/expressionEngine.test.js`; expect new assertions to fail because `^` is unsupported.
- [ ] Implement right-associative power parsing and controlled domain errors; add reducer action that appends `^` or `^2`.
- [ ] Re-run those tests; expect passing.

### Task 3: Root evaluator and expression entry

**Files:**

- Modify: `tests/expression-evaluation.test.js`
- Modify: `tests/expressionEngine.test.js`
- Modify: `src/calculator/expression/evaluateExpression.js`
- Modify: `src/lib/expressionEngine.js`

- [ ] Write failing tests for `√9`, `3√8`, `3√-8`, `2√-9`, `0√9`, and decimal degrees.
- [ ] Run targeted tests; expect new assertions to fail because `√` is unsupported.
- [ ] Implement minimal prefix/infix root parsing, real-domain validation, and reducer actions for square/nth root entry.
- [ ] Re-run targeted tests; expect passing.

### Task 4: Scientific mode controls

**Files:**

- Modify: `tests/calculator.test.jsx`
- Modify: `src/components/Calculator.jsx`
- Modify: `src/components/Keypad.jsx`
- Modify: `src/styles/calculator.css`

- [ ] Write failing DOM tests for mode selection, scientific controls, expression display, inline errors, and recovery.
- [ ] Run `npm test -- --run tests/calculator.test.jsx`; expect controls to be absent.
- [ ] Add only Basic/Scientific toggle plus CFL-17 controls, routed through existing reducer actions.
- [ ] Re-run DOM tests; expect passing.

### Task 5: Verify and review

- [ ] Run `npm run lint`, `npm run format:check`, `npm test`, `npm run coverage`, `npm run build`, and `git diff --check`.
- [ ] Perform self-review for scope, controlled errors, accessibility, and no future Feature behavior.
- [ ] Update `SECOND_BRAIN.md`; move CFL-55/CFL-56 only when their actual milestones are reached.
