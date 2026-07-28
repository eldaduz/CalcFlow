# CalcFlow Release Guide

This document defines the operational procedures for managing releases, semantic versioning, Git tags, GitHub Releases, release notes formatting, and human approval gates for **CalcFlow**.

---

## 1. Release Philosophy & Core Rules

In CalcFlow, **Merge**, **Deployment**, and **Release** are three distinct lifecycle events:

1. **Merge**: Code from a verified feature branch is integrated into `main` after pull request review approval and passing CI.
2. **Deployment**: Merges to `main` trigger an automated continuous deployment build (e.g., Vercel Production deployment).
3. **Release**: A human-approved milestone represented by an annotated Git tag, a published GitHub Release, comprehensive release notes, and updated Jira Fix Versions.

> [!IMPORTANT]
> A feature or fix is only marked **Done** in Jira after Production deployment, Production smoke-testing, and (for release milestones) tag and release creation.

---

## 2. Semantic Versioning Sequence

CalcFlow follows strict [Semantic Versioning (SemVer 2.0.0)](https://semver.org/):

`vMAJOR.MINOR.PATCH`

- **MAJOR (`v1.0.0`)**: Public stable production release / significant structural milestone.
- **MINOR (`v0.1.0`, `v0.2.0`, ...)**: Feature milestone releases (e.g., MVP, Expressions, Powers/Roots, Scientific Functions, UX).
- **PATCH (`v0.1.1`, `v1.0.1`)**: Bug fixes or emergency hotfixes applied post-release.

### Approved Release Milestones

- `v0.1.0` — Basic Calculator MVP
- `v0.2.0` — Expressions and Parentheses
- `v0.3.0` — Powers and Roots
- `v0.4.0` — Scientific Functions
- `v0.5.0` — History and Memory
- `v0.6.0` — Complete User Experience
- `v1.0.0` — Stable Final Release

---

## 3. Pre-Release Verification & Safety Checks

Before creating any release tag or GitHub Release:

1. **Verify local test & quality suite**:
   ```bash
   npm ci
   npm run lint
   npm run format:check
   npm test
   npm run coverage
   npm run build
   ```
2. **Verify CLI Release Readiness**:
   ```bash
   npm run release:verify
   ```
3. **Confirm Production Smoke Test**:
   - Verify live Vercel production URL loads cleanly.
   - Verify core calculator functionality and recent feature additions.
   - Verify browser console is free of unexpected errors.

---

## 4. Step-by-Step Release Process

### Step 1: Update `package.json` Version

Ensure `package.json` reflects the release version (`vX.Y.Z` without leading `v` in package.json):

```json
{
  "version": "1.0.0"
}
```

### Step 2: Create Annotated Git Tag

Create an annotated Git tag on `main` following the `vX.Y.Z` naming convention:

```bash
git tag -a v1.0.0 -m "Release v1.0.0 - Stable Final Release"
git push origin v1.0.0
```

### Step 3: Create GitHub Release

Using `github-mcp-server` or GitHub UI:

- **Tag name**: `vX.Y.Z` (e.g., `v1.0.0`)
- **Release title**: `CalcFlow vX.Y.Z — <Release Title>`
- **Body**: Use the standard release notes template below.

---

## 5. Release Notes Template

```markdown
# CalcFlow vX.Y.Z — [Release Title]

## Summary

Brief description of the release goal and delivered capabilities.

## Delivered Scope & Features

- **[CFL-XX] Feature Title**: Brief description of scope delivered.
- **[CFL-YY] Feature Title**: Brief description of scope delivered.

## Bug Fixes & Improvements

- **[CFL-ZZ] Fix Title**: Brief description of fix.

## Traceable Pull Requests & Artifacts

- PR #XX — [Title](https://github.com/eldaduz/CalcFlow/pull/XX)
- Final Submission Log: `logs/calcflow-submission-log.json` (if applicable)

## Verification Status

- [x] Unit & Integration Tests Passing
- [x] Code Linting & Formatting Clean
- [x] Production Build Succeeded
- [x] Vercel Production Smoke Test Confirmed

## Human Release Approval

- **Approved by**: [Eldad / Gavi]
- **Approval Date**: YYYY-MM-DD
```

---

## 6. Jira Release Synchronization

1. Transition all parent Features and child Tasks delivered in the release to **Done**.
2. Assign the target **Fix Version** in Jira (e.g., `v1.0.0`).
3. Mark the version as **Released** in Jira release settings.
