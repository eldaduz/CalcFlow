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

### History and memory

- Calculation history: a collapsible list of past expressions and results,
  each reusable (restores the full editable expression) and independently
  clearable; persists for the session via `sessionStorage`
- Memory operations (`MC`, `MR`, `M+`, `M−`) in Scientific mode, surviving
  `AC` and controlled errors; only `MC` clears memory

### Keyboard and responsive

- Full keyboard entry: digits, the four basic operators, parentheses,
  decimal point, Enter/Backspace/Escape, plus the complete Scientific-mode
  shortcut set (`s`/`c`/`t` for sin/cos/tan, `l`/`n` for log/ln, `r`/`u` for
  square/nth root, `^`, `!`, `%`, `p`/`e` for constants, `d` for DEG/RAD),
  and a `?`-triggered shortcuts-help panel
- Responsive layout verified at phone, tablet, and desktop widths with no
  horizontal overflow and full-size touch targets

### Other

- Internal application logging: successful calculations, controlled
  errors, and unexpected evaluator failures are recorded in-memory with a
  timestamp and structured detail, isolated so a logging failure can never
  break a calculation
- Accessible by keyboard alone, with results and errors announced to
  assistive technology via distinct live regions

Log export (JSON) and license reporting are tracked in Jira for v1.0.0 but
not yet implemented.

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

## Deployment

CalcFlow deploys to [Vercel](https://calc-flow-fawn.vercel.app/) directly
from this repository: every pull request gets an automatic Preview
deployment, and every merge to `main` deploys to Production. See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for build settings, the full
deployment flow, and recorded smoke-test evidence.

## Releases

Tagged releases and notes are published under
[GitHub Releases](https://github.com/eldaduz/CalcFlow/releases); v0.1.0
through v0.5.0 are shipped (MVP arithmetic through history and memory).
v0.6.0 (keyboard support, responsive interface, accessibility) is in
progress toward v1.0.0.

## Project References

- [design.md](design.md) defines the shared UI and UX rules.
- [docs/agents/PROJECT_PLAN.md](docs/agents/PROJECT_PLAN.md) defines scope, roles, workflow, review policy, sources of truth, and release process.
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) documents the Vercel deployment approach and smoke-test evidence.
- [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md) documents dependency governance.
- [ALL_LICENSES](ALL_LICENSES) records third-party asset and dependency licensing.
