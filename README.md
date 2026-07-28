# CalcFlow

CalcFlow is a frontend-only scientific calculator built with React and Vite.

Live deployment: https://calc-flow-fawn.vercel.app/

## Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- npm `11.16.0` (the project package manager)

## Installation

Install the locked dependency set from a clean checkout:

```sh
npm ci
```

## Features

CalcFlow ships as a single calculator surface with a Basic / Scientific mode
toggle. Basic mode covers everyday arithmetic; Scientific mode reveals
additional controls above the same expression flow, display, and error
recovery.

### Basic

- Addition, subtraction, multiplication, and division, including decimals
  and negative values
- Multi-step expression entry with parentheses, both by button and keyboard
- Operator precedence and nested parentheses, evaluated by a hand-written
  recursive-descent parser (no `eval`)
- Clear, delete, sign toggle, and in-place recovery from a controlled error
  without losing the expression being edited

### Scientific

- Powers and roots: square (`x²`), general power (`xʸ`), square root (`√`),
  and nth root (`ⁿ√`)
- Logarithms: `log` (base-10) and `ln` (natural), as real inline expression
  functions (e.g. `log(100)+5`)
- Trigonometric functions: `sin`, `cos`, and `tan`, with a DEG/RAD angle
  mode toggle that persists for the session and immediately re-evaluates
  the active result when switched
- Additional operations: percent (`%`, postfix divide-by-100), absolute
  value (`|x|`), factorial (`x!`, validated up to `170!`), and the
  constants `π` and `e`
- Controlled, recoverable errors for every domain case (division by zero,
  negative/fractional factorial, non-positive logarithm input, undefined
  tangent, etc.) -- the invalid expression stays on screen for editing
  rather than resetting

### Other

- Internal application logging: successful calculations, controlled
  errors, and unexpected evaluator failures are recorded in-memory with a
  timestamp and structured detail, isolated so a logging failure can never
  break a calculation
- Keyboard entry for digits, the four basic operators, parentheses,
  decimal point, Enter/Backspace/Escape

Calculation history, memory operations, full scientific keyboard shortcuts,
responsive/accessibility work, and log export are tracked in Jira but not
yet implemented.

## Structure

- `src/main.jsx` starts the React application.
- `src/App.jsx` is the application shell.
- `src/components/` -- `Calculator.jsx` (state/dispatch), `Display.jsx`, and
  `Keypad.jsx` (Basic and Scientific controls).
- `src/calculator/expression/evaluateExpression.js` -- the tokenizer and
  recursive-descent parser/evaluator for the full expression grammar.
- `src/lib/` -- `expressionEngine.js` (expression editing and display-glyph
  state), `arithmetic.js`, `logarithm.js`, `scientificOperations.js`
  (factorial/absolute value), and `logger.js` (internal event logging).
- `src/styles/calculator.css` -- centralized design tokens and component
  styles; see [design.md](design.md).
- `tests/` -- unit and integration tests for every module above.

## Commands

- `npm run dev` starts local development.
- `npm run build` creates the production build.
- `npm run preview` serves the production build locally.
- `npm run lint` checks JavaScript and JSX.
- `npm run lint:fix` applies lint fixes where safe.
- `npm run format:check` checks formatting.
- `npm run format` applies formatting.
- `npm test` runs the test suite once.
- `npm run coverage` produces the coverage report.

## Releases

Tagged releases and notes are published under
[GitHub Releases](https://github.com/eldaduz/CalcFlow/releases); v0.1.0
through v0.4.0 are shipped (MVP arithmetic, expressions and parentheses,
powers and roots, and the full scientific-function set described above).

## Project References

- [design.md](design.md) defines the shared UI and UX rules.
- [PROJECT_PLAN.md](PROJECT_PLAN.md) defines scope, roles, workflow, review policy, sources of truth, and release process.
- [ALL_LICENSES](ALL_LICENSES) records third-party asset and dependency licensing.
