# CalcFlow Codex Model Guide

## 1. Purpose

This file defines the approved Codex model and reasoning configuration for each CalcFlow Feature and delivery stage.

Its goals are to:

- use the lowest-cost configuration that is sufficient for the work;
- avoid quality loss in correctness, maintainability, testing, review, QA, and regression;
- avoid unnecessary model changes;
- require a clear pause when the next stage needs a different configuration.

This guide is Codex-specific. `PROJECT_PLAN.md` remains the authority for scope, ownership, Jira workflow, branches, reviews, QA, deployment, and approvals.

## 2. Mandatory Checkpoints

When working in Codex, read this file:

1. before starting every Feature;
2. before implementation begins;
3. before Code Review;
4. before QA and regression;
5. before difficult bug investigation;
6. whenever the current task materially changes in complexity.

At each checkpoint:

1. identify the Jira Feature and current stage;
2. locate the approved configuration below;
3. compare it with the configuration currently selected in the Codex interface;
4. continue when they match;
5. otherwise stop at a safe point and request the manual change from the user.

Do not change model merely because another model may be marginally better. Use the approved lowest sufficient configuration unless an escalation condition is met.

## 3. Available Configurations

Available models in Eldad's current Codex picker:

- GPT-5.6 Sol
- GPT-5.6 Terra
- GPT-5.6 Luna
- GPT-5.5
- GPT-5.4
- GPT-5.4 Mini

Available reasoning levels:

- Light
- Medium
- High
- Extra High

## 4. Cost and Selection Order

Current official Codex token-credit rates place the models in this approximate cost order:

1. GPT-5.4 Mini — lowest cost
2. GPT-5.6 Luna
3. GPT-5.6 Terra and GPT-5.4 — same rate tier
4. GPT-5.6 Sol and GPT-5.5 — same highest standard rate tier

Actual usage still depends on context size, cached input, output length, tool calls, test loops, and reasoning effort.

Selection policy:

- Prefer **GPT-5.4 Mini** for narrow documentation, repetitive checks, simple configuration, release administration, and report generation.
- Use the lowest sufficient model and reasoning for routine GitHub, Jira, status, and documentation work; a Feature's delivery stage alone does not increase that requirement.
- Prefer **GPT-5.6 Luna** for well-defined implementation with limited architectural risk.
- Prefer **GPT-5.6 Terra** for normal engineering work, moderate state logic, integration, testing, QA, and debugging.
- Prefer **GPT-5.6 Sol** only for genuinely high-complexity parser architecture, cross-Feature reasoning, high-risk logic, difficult debugging, or high-risk review.
- **GPT-5.4** is not the default because it costs the same as Terra; use it only after explicit human approval for a demonstrated compatibility or quality reason.
- **GPT-5.5** is not the default because it costs the same as Sol; use it only after explicit human approval for a demonstrated task-specific advantage.
- Use **Medium** reasoning by default.
- Use **Light** only for narrowly mechanical work with no meaningful design or logic decision.
- Use **High** for complex mathematical state, parser logic, accessibility review, or difficult debugging.
- Use **Extra High** only after explicit human approval when High has proved insufficient.

Official references checked on 2026-07-24:

- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card)
- [GPT-5.6 availability and positioning](https://help.openai.com/en/articles/20001354-gpt-56-in-chatgpt)

Recheck the current Codex picker and official rate card before changing this matrix. Availability or rates override this section. Any permanent matrix change requires human approval and an update to this file.

## 5. Manual Configuration Change Procedure

Model and reasoning changes are performed manually by the user in the Codex interface.

Before beginning a stage whose approved configuration differs from the currently selected configuration:

1. reach a safe stopping point;
2. save and summarize the current state;
3. stop before beginning the next stage;
4. tell the user exactly which model and reasoning level to select;
5. wait for explicit confirmation;
6. continue only after confirmation.

Do not interrupt an unfinished logical unit solely to reduce usage. Complete the safe unit first, then request the downgrade before the next stage.

Use this exact format:

```text
MODEL CHANGE REQUIRED

- Jira Feature:
- Stage:
- Current configuration:
- Required model:
- Required reasoning:
- Change type: Upgrade / Downgrade
- Reason:
- Safe stopping point:
- Next action after confirmation:
```

When the current configuration is not known, ask the user to state what is currently selected.

## 6. Feature Configuration Matrix

`Default work` covers planning, implementation, unit tests, normal bug fixing, and documentation unless another column overrides it.

For Gavi-owned Features, Codex will normally use the **Review / QA** configuration when Eldad reviews the PR or assists with QA. If Eldad temporarily performs implementation, use the **Default work** configuration.

| Jira Feature                                       | Owner | Default work                                                                                  | Review / QA            | Escalation condition and configuration                                                                          |
| -------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| CFL-2 — Application Foundation                     | Eldad | GPT-5.6 Luna / Medium                                                                         | GPT-5.4 Mini / Medium  | Toolchain conflict, broken package graph, or unexplained build failure → Terra / High                           |
| CFL-9 — Development Standards                      | Eldad | GPT-5.4 Mini / Medium                                                                         | GPT-5.4 Mini / Medium  | Complex ESLint or module-resolution conflict → Terra / Medium                                                   |
| CFL-10 — Unit Testing Foundation                   | Eldad | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Luna / Medium  | Test-environment or coverage behavior remains unexplained → Terra / High                                        |
| CFL-11 — Foundation Documentation and Verification | Eldad | GPT-5.4 Mini / Medium                                                                         | GPT-5.4 Mini / Medium  | Reproducibility failure across environments → Terra / Medium                                                    |
| CFL-12 — Basic Arithmetic                          | Gavi  | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Luna / Medium  | Precision, rounding, or numeric edge cases remain unresolved → Terra / High                                     |
| CFL-13 — Basic Calculator Interaction              | Gavi  | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Terra / Medium | State transitions interact incorrectly across multiple actions → Terra / High                                   |
| CFL-14 — Expression Input and Editing              | Gavi  | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / High   | Expression-state design becomes coupled to parser architecture → Sol / High                                     |
| CFL-16 — Expression Evaluation                     | Eldad | Planning, implementation, and unit tests: GPT-5.6 Terra / Medium; normal parser work included | GPT-5.6 Terra / Medium | Complex parser-safety or cross-Feature review and QA → Terra / High; Sol / High only for genuinely complex risk |
| CFL-17 — Powers and Roots                          | Eldad | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / Medium | Domain, precision, or nth-root edge cases remain unresolved → Terra / High                                      |
| CFL-18 — Logarithmic Functions                     | Gavi  | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Terra / Medium | Domain or parser-integration failures → Terra / High                                                            |
| CFL-19 — Trigonometric Functions                   | Eldad | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / Medium | Tangent tolerance, angle-mode contract, or cross-feature failure → Terra / High                                 |
| CFL-20 — Angle Mode                                | Eldad | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Terra / Medium | Mode state is inconsistent across trigonometric functions → Terra / High                                        |
| CFL-21 — Additional Scientific Operations          | Gavi  | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / Medium | Percentage semantics, factorial limits, or expression integration remain ambiguous → Terra / High               |
| CFL-22 — Calculation History                       | Gavi  | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Luna / Medium  | Reuse creates state corruption or parser coupling → Terra / Medium                                              |
| CFL-23 — Memory Operations                         | Gavi  | GPT-5.4 Mini / Medium                                                                         | GPT-5.6 Luna / Medium  | Memory state is corrupted by errors or expression transitions → Terra / Medium                                  |
| CFL-24 — Keyboard Support                          | Gavi  | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / High   | Global shortcut, focus, or event-order bugs are difficult to isolate → Sol / High                               |
| CFL-25 — Responsive Interface                      | Gavi  | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Luna / Medium  | Cross-breakpoint layout conflict or persistent overflow → Terra / Medium                                        |
| CFL-26 — Accessibility                             | Gavi  | GPT-5.6 Terra / High                                                                          | GPT-5.6 Terra / High   | Conflicting semantics, focus behavior, or live-region behavior → Sol / High                                     |
| CFL-27 — Application Logging                       | Eldad | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / Medium | Logging affects calculator behavior or unexpected failures are not isolated → Terra / High                      |
| CFL-28 — Log Export and Submission Evidence        | Gavi  | GPT-5.4 Mini / Medium                                                                         | GPT-5.6 Luna / Medium  | Browser download, JSON integrity, or final evidence is unreliable → Terra / Medium                              |
| CFL-29 — Continuous Integration                    | Eldad | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / Medium | CI differs from local results or coverage enforcement is unstable → Terra / High                                |
| CFL-30 — Vercel Deployment                         | Gavi  | GPT-5.4 Mini / Medium                                                                         | GPT-5.6 Luna / Medium  | Preview/production mismatch or unexplained deployment failure → Terra / High                                    |
| CFL-31 — Release Management                        | Eldad | GPT-5.4 Mini / Medium                                                                         | GPT-5.4 Mini / Medium  | Tag, release, deployment, and Jira states conflict → Terra / Medium                                             |
| CFL-32 — Dependency Governance                     | Eldad | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / High   | Security, maintenance, bundle, or dependency-tree risk is unclear → Sol / High                                  |
| CFL-33 — License Reporting                         | Gavi  | GPT-5.4 Mini / Medium                                                                         | GPT-5.6 Luna / Medium  | Unknown, custom, or incompatible licenses require investigation → Terra / High                                  |

## 7. Bug-Fixing Rule

Use the Feature's Default work configuration for normal Bugs.

Request escalation only when at least one of these is true:

- the Bug crosses multiple Features;
- repeated fixes fail;
- the root cause is architectural rather than local;
- calculation correctness or parser safety is uncertain;
- regression behavior is inconsistent or nondeterministic;
- the approved configuration cannot explain the failure after a reasonable investigation.

After the difficult step is resolved and verified, request a downgrade to the Feature's normal configuration before continuing routine work.

## 8. Review Rule

Substantive review and QA must use the Review / QA column, not automatically the implementation configuration. Routine GitHub, Jira, status, and documentation work uses the lowest sufficient configuration instead.

A review must verify:

- Jira acceptance criteria;
- scope discipline;
- correctness and edge cases;
- unit-test quality;
- regression risk;
- maintainability and clarity;
- compliance with `PROJECT_PLAN.md` and `design.md` where relevant.

A stronger model is justified only when the matrix or an escalation condition requires it.

## 9. Required Output at Feature Start

Before presenting the Feature development plan, Codex must include:

```text
CODEX CONFIGURATION CHECK

- Jira Feature:
- Stage:
- Approved model:
- Approved reasoning:
- Current configuration:
- Configuration status: Matches / Change required
- Escalation trigger currently present: Yes / No
```

When the configuration matches, continue to the normal planning approval point in `PROJECT_PLAN.md`.

When a change is required, use the mandatory model-change format and wait.
