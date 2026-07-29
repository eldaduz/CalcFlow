# Dependency Governance

## 1. Objective

Ensure every package added to CalcFlow is selected deliberately, maintained reproducibly, and understood by the team.

## 2. General Policy

- **Approval Required**: New dependencies require explicit team approval (Eldad and Gavi) before being merged into `main`.
- **Reproducibility**: `package-lock.json` must always be committed. CI must use `npm ci`.
- **Minimization**: Do not add abstractions without a demonstrated need. Native browser and JavaScript features are preferred.

## 3. Current Dependencies

### Production Dependencies

- **react** & **react-dom** (^19.2.8)
  - **Purpose**: Core declarative UI library for building the calculator components.
  - **Alternatives Considered**: Vanilla JS (too verbose for complex UI state), Preact (rejected to ensure standard React ecosystem compatibility if needed).
  - **Maintenance & Security**: Actively maintained by Meta. Low security risk when properly used.
  - **License**: MIT.
  - **Bundle Impact**: Acceptable baseline for the application.

### Development Dependencies

- **Vite** (`vite`, `@vitejs/plugin-react`): Fast build tool and development server.
- **Vitest & jsdom** (`vitest`, `@vitest/coverage-v8`, `jsdom`): Unit testing framework matching Vite's environment.
- **ESLint & Prettier** (`eslint`, `prettier`, and related plugins): Code linting and formatting.
- **Husky & lint-staged** (`husky`, `lint-staged`): Pre-commit hooks for enforcing code quality.

### Overrides

- **minimatch** (^10.2.5): Pinned explicitly to resolve a `brace-expansion` vulnerability (GHSA-mh99-v99m-4gvg) within the `eslint` / `eslint-plugin-react` toolchain (implemented in PR #16).

## 4. Evaluation Checklist for New Dependencies

Before requesting a new package, document:

1. **Purpose**: What specific problem does this solve that native code cannot?
2. **Alternatives**: What else was considered?
3. **Maintenance**: Is the project actively maintained (recent commits, issues addressed)?
4. **Security**: Are there known audit vulnerabilities?
5. **License**: Is it MIT, ISC, or Apache 2.0? (GPL or restrictive licenses are prohibited).
6. **Bundle Impact**: How much size does it add?
