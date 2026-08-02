# Deployment

## 1. Objective

Document how CalcFlow is built and deployed via Vercel, so the process is
reproducible and reviewable rather than implicit tribal knowledge.

## 2. Platform and Project

- **Host**: Vercel, connected directly to this GitHub repository via the
  Vercel GitHub App (no deployment secrets or tokens are stored in this
  repository).
- **Production URL**: https://calc-flow-fawn.vercel.app/

## 3. Build Settings

- **Framework preset**: Vite (auto-detected).
- **Install command**: `npm ci` (uses the committed `package-lock.json`,
  same as CI — see `docs/DEPENDENCIES.md`).
- **Build command**: `npm run build` (`vite build`).
- **Output directory**: `dist`.
- **Node.js version**: pinned via the `engines` field in `package.json`
  (Node 20.19 or newer, or Node 22.12 or newer), matching the version CI
  and local development use.

- No project-specific environment variables are required; CalcFlow is a
  frontend-only, backend-less application (see `docs/agents/PROJECT_PLAN.md`, Out of
  scope: Backend or API, Database).

## 4. Deployment Flow

- **Pull requests** automatically receive a Vercel Preview deployment;
  Vercel posts the preview URL as a PR comment (`vercel[bot]`). Feature QA
  uses the Preview when it's reachable — some preview URLs sit behind
  Vercel's own SSO gate for this project's account tier and are
  unreachable to automated checks, in which case QA runs against a local
  production build (`npm run build` + `npm run preview`) instead; this has
  been the case for prior Features (e.g. CFL-22, CFL-25, CFL-26) and is a
  known, accepted limitation, not a defect.
- **`main`** deploys automatically to Production on every merge — there is
  no separate manual deploy step.
- A **Production smoke test** is performed after every merge to `main`
  before the corresponding Jira Feature is moved to Done, per
  `docs/agents/PROJECT_PLAN.md` §12/§13.

## 5. Post-Deployment Smoke Test (recorded for v1.0.0, 2026-07-29)

Run against the live Production URL (https://calc-flow-fawn.vercel.app/)
via Playwright (system Chrome), covering every area CFL-82 requires:

- **Application load**: page returns HTTP 200, calculator renders, no
  console errors.
- **Basic calculation**: arithmetic, decimals, negative values, and
  divide-by-zero controlled-error recovery all correct.
- **Scientific calculation**: mode toggle, powers/roots, logarithms,
  trigonometric functions with DEG/RAD, percent, factorial, constants all
  correct.
- **Keyboard input**: digits, operators, parentheses, Enter/Backspace/
  Escape, and the full Scientific-mode shortcut set all work, matching
  their on-screen controls.
- **Responsive access**: verified at 320px, 375px, 768px, and 1280px in
  both Basic and Scientific mode — no horizontal overflow, all touch
  targets ≥48px, correct layout at every width.

This is a rollup of smoke evidence already independently recorded per
Feature at merge time (CFL-12 through CFL-26 in `docs/agents/SECOND_BRAIN.md`); this
document exists so the deployment approach and its evidence trail are
discoverable in one place rather than scattered across individual Feature
entries.

## 6. Secrets

No Vercel token, deployment secret, or `.env` file is committed to this
repository. The GitHub-to-Vercel connection is authorized through the
Vercel GitHub App at the account/repository level, outside of source
control.
