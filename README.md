# CalcFlow

CalcFlow is a React and Vite calculator application.

## Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- npm `>=10.0.0` (the project package manager)

## Installation

Install the locked dependency set from a clean checkout:

```sh
npm ci
```

## Structure

- `src/main.jsx` starts the React application.
- `src/App.jsx` is the current application shell.
- `tests/` contains lightweight foundation checks.

Calculator logic, utilities, and UI folders will be added with the work that uses them; no empty future structure is maintained.

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

## Project References

- [design.md](design.md) defines the shared UI and UX rules.
- [PROJECT_PLAN.md](PROJECT_PLAN.md) defines scope, roles, workflow, review policy, sources of truth, and release process.
