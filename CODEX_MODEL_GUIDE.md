# CalcFlow Model and Tool Guide

## 1. Purpose

This file defines the approved model and tool configuration for each CalcFlow Feature and delivery stage.

It covers two separate environments:

- **AGY IDE** — the Antigravity IDE, which provides Claude Sonnet 4.6 (Thinking), Claude Opus 4.6 (Thinking), Gemini 3.6 Flash, Gemini 3.5 Flash, and Gemini 3.1 Pro.
- **Codex** — the OpenAI Codex environment, which provides GPT-5.x models with configurable reasoning levels.

Its goals are to:

- use the lowest-cost configuration that is sufficient for the work;
- prefer AGY IDE models by default to conserve Codex quota;
- reserve Codex for tasks that are genuinely quota-justified;
- avoid quality loss in correctness, maintainability, testing, review, QA, and regression;
- avoid unnecessary model changes;
- require a clear pause when the next stage needs a different configuration.

`PROJECT_PLAN.md` remains the authority for scope, ownership, Jira workflow, branches, reviews, QA, deployment, and approvals.

## 2. Mandatory Checkpoints

Read this file:

1. before starting every Feature;
2. before implementation begins;
3. before Code Review;
4. before QA and regression;
5. before difficult bug investigation;
6. whenever the current task materially changes in complexity.

At each checkpoint:

1. identify the Jira Feature and current stage;
2. identify the current tool (AGY IDE or Codex);
3. locate the approved configuration in §6 for the active tool;
4. compare it with the configuration currently selected;
5. continue when they match;
6. otherwise stop at a safe point and request the manual change from the user.

Do not change model or tool merely because another option may be marginally better. Use the approved lowest sufficient configuration unless an escalation condition is met.

## 3. Available Configurations

### AGY IDE (default tool)

Available models in the AGY IDE picker:

| Model                        | Reasoning levels available |
| ---------------------------- | -------------------------- |
| Claude Sonnet 4.6 (Thinking) | Always on (no level dial)  |
| Claude Opus 4.6 (Thinking)   | Always on (no level dial)  |
| Gemini 3.6 Flash             | High / Medium / Low        |
| Gemini 3.5 Flash             | High / Medium / Low        |
| Gemini 3.1 Pro               | High / Low                 |

Claude models are always in Thinking mode with no reasoning-level dial.
Gemini models expose a reasoning-level picker: **High**, **Medium**, and **Low** (Gemini 3.1 Pro exposes High and Low only).

Reasoning-level selection policy for Gemini models in AGY IDE:

- **Low** — narrowly mechanical work with no meaningful design or logic decision (documentation updates, repetitive checks, release administration).
- **Medium** — default for routine engineering, implementation, integration, testing, QA, and debugging.
- **High** — complex state, parser logic, accessibility review, difficult debugging, or substantive code review.

Use **Medium** by default. Use **Low** only for mechanical tasks. Use **High** only when the task genuinely warrants it per the matrix (§6) or an active escalation condition.

### Codex

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

### Tool selection policy

AGY IDE is the default tool for all CalcFlow work. Codex is reserved for tasks that meet at least one of these justifications:

- the task requires agentic multi-step execution in the Codex environment;
- the Codex workspace, worktree setup, or Codex-specific tooling is needed;
- an AGY IDE model explicitly failed to resolve the issue after a reasonable attempt;
- the Feature's configuration matrix (§6) specifies Codex by name for a demonstrated reason.

Always request explicit human approval before switching from AGY IDE to Codex for a non-justified task.

### AGY IDE tooling

AGY IDE agents access GitHub and Jira exclusively through the configured MCP servers:

- **GitHub**: use the `github-mcp-server` MCP tools for all repository, branch, pull request, review, commit, and CI operations.
- **Jira**: use the `mcp-atlassian` MCP tools for all issue, transition, comment, sprint, and status operations.

Do not use direct API calls, curl, or browser automation for GitHub or Jira when MCP tools are available. If an MCP tool is unavailable or returns an error, report the failure and wait for human guidance rather than substituting an alternative access method.

Codex uses its own native built-in tools for GitHub and Jira access and is unaffected by this rule.

### AGY IDE tier order

Current approximate capability and cost order, lowest to highest:

1. **Gemini 3.6 Flash / Low** — lowest cost; narrowly mechanical tasks (docs, release admin, repetitive checks)
2. **Gemini 3.6 Flash / Medium** — routine documentation, simple configuration, report generation
3. **Gemini 3.5 Flash / Medium** — well-defined implementation with limited architectural risk
4. **Gemini 3.1 Pro / Medium** — normal engineering, moderate state logic, long-context tasks
5. **Claude Sonnet 4.6 (Thinking)** — complex state, parser logic, difficult debugging, substantive review, QA
6. **Claude Opus 4.6 (Thinking)** — highest capability; genuinely high-complexity architecture, cross-Feature reasoning, high-risk review

Selection policy:

- Prefer **Gemini 3.6 Flash / Low** for the most mechanical tasks: pure documentation edits, release-note formatting, status-update pings.
- Prefer **Gemini 3.6 Flash / Medium** for narrow documentation, repetitive checks, simple configuration, release administration, and report generation.
- Use the lowest sufficient model for routine GitHub, Jira, status, and documentation work.
- Prefer **Gemini 3.5 Flash / Medium** for well-defined implementation with limited architectural risk.
- Prefer **Gemini 3.1 Pro / Medium** for normal engineering, integration, testing, QA, and long-context work.
- Use **Gemini 3.x / High** when a Gemini model is the approved tier but the current task is meaningfully complex (e.g., a tricky bug at the Gemini tier before escalating to Sonnet).
- Prefer **Claude Sonnet 4.6 (Thinking)** for complex mathematical state, parser logic, accessibility review, difficult debugging, or substantive code review.
- Reserve **Claude Opus 4.6 (Thinking)** only for genuinely high-complexity parser architecture, cross-Feature reasoning, high-risk logic, or high-risk review — same threshold as GPT-5.6 Sol / Extra High.

### AGY–Codex tier equivalence

| AGY IDE model                | Approximate Codex equivalent  |
| ---------------------------- | ----------------------------- |
| Gemini 3.6 Flash / Low       | GPT-5.4 Mini / Light          |
| Gemini 3.6 Flash / Medium    | GPT-5.4 Mini / Medium         |
| Gemini 3.5 Flash / Medium    | GPT-5.6 Luna / Medium         |
| Gemini 3.1 Pro / Medium      | GPT-5.6 Terra / Medium        |
| Gemini 3.x / High            | GPT-5.6 Terra / High          |
| Claude Sonnet 4.6 (Thinking) | GPT-5.6 Terra / High          |
| Claude Opus 4.6 (Thinking)   | GPT-5.6 Sol / High–Extra High |

This equivalence is for capability reference only. When working in AGY IDE, use the AGY columns in §6. When working in Codex, use the Codex columns.

### Codex tier order

Current official Codex token-credit rates place the models in this approximate cost order:

1. GPT-5.4 Mini — lowest cost
2. GPT-5.6 Luna
3. GPT-5.6 Terra and GPT-5.4 — same rate tier
4. GPT-5.6 Sol and GPT-5.5 — same highest standard rate tier

Codex selection policy:

- Prefer **GPT-5.4 Mini** for narrow documentation, repetitive checks, simple configuration, release administration, and report generation.
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

Recheck the current Codex picker and official rate card before changing this matrix. Any permanent matrix change requires human approval and an update to this file.

## 5. Manual Configuration Change Procedure

Model and reasoning changes in Codex are performed manually by the user in the Codex interface.
Model changes in the AGY IDE are performed manually by the user in the AGY IDE model picker.
Tool switches (AGY IDE ↔ Codex) are a human decision and require explicit approval.

Before beginning a stage whose approved configuration differs from the currently selected one:

1. reach a safe stopping point;
2. save and summarize the current state;
3. stop before beginning the next stage;
4. tell the user exactly which tool, model, and (for Codex) reasoning level to select;
5. wait for explicit confirmation;
6. continue only after confirmation.

Do not interrupt an unfinished logical unit solely to reduce usage. Complete the safe unit first, then request the change before the next stage.

Use this exact format for a Codex model change:

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

Use this exact format for a tool switch:

```text
TOOL SWITCH REQUIRED

- Jira Feature:
- Stage:
- Current tool:
- Required tool:
- Required model:
- Switch type: AGY → Codex / Codex → AGY
- Quota justification (AGY → Codex only):
- Reason:
- Safe stopping point:
- Next action after confirmation:
```

When the current configuration is not known, ask the user to state what is currently selected.

## 6. Feature Configuration Matrix

`Default work` covers planning, implementation, unit tests, normal bug fixing, and documentation unless another column overrides it.

For Gavi-owned Features, the AI will normally use the **Review / QA** configuration when Eldad reviews the PR or assists with QA. If Eldad temporarily performs implementation, use the **Default work** configuration.

When working in **AGY IDE**, use the AGY columns. When working in **Codex**, use the Codex columns.

For AGY IDE Gemini models, the reasoning level is shown as `Model / Level` (e.g., `Gemini 3.5 Flash / Medium`). When only a model name appears without a level, use **Medium** by default.

| Jira Feature                                       | Owner | AGY Default work             | AGY Review / QA              | Codex Default work                                                                            | Codex Review / QA      | Escalation condition and configuration                                                                                                    |
| -------------------------------------------------- | ----- | ---------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| CFL-2 — Application Foundation                     | Eldad | Gemini 3.5 Flash / Medium    | Gemini 3.6 Flash / Medium    | GPT-5.6 Luna / Medium                                                                         | GPT-5.4 Mini / Medium  | Toolchain conflict, broken package graph, or unexplained build failure → Sonnet (AGY) / Terra High (Codex)                                |
| CFL-9 — Development Standards                      | Eldad | Gemini 3.6 Flash / Medium    | Gemini 3.6 Flash / Low       | GPT-5.4 Mini / Medium                                                                         | GPT-5.4 Mini / Medium  | Complex ESLint or module-resolution conflict → Sonnet (AGY) / Terra Medium (Codex)                                                        |
| CFL-10 — Unit Testing Foundation                   | Eldad | Gemini 3.5 Flash / Medium    | Gemini 3.5 Flash / Medium    | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Luna / Medium  | Test-environment or coverage behavior remains unexplained → Sonnet (AGY) / Terra High (Codex)                                             |
| CFL-11 — Foundation Documentation and Verification | Eldad | Gemini 3.6 Flash / Low       | Gemini 3.6 Flash / Low       | GPT-5.4 Mini / Medium                                                                         | GPT-5.4 Mini / Medium  | Reproducibility failure across environments → Sonnet (AGY) / Terra Medium (Codex)                                                         |
| CFL-12 — Basic Arithmetic                          | Gavi  | Gemini 3.5 Flash / Medium    | Gemini 3.5 Flash / Medium    | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Luna / Medium  | Precision, rounding, or numeric edge cases remain unresolved → Sonnet (AGY) / Terra High (Codex)                                          |
| CFL-13 — Basic Calculator Interaction              | Gavi  | Gemini 3.5 Flash / Medium    | Gemini 3.1 Pro / Medium      | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Terra / Medium | State transitions interact incorrectly across multiple actions → Sonnet (AGY) / Terra High (Codex)                                        |
| CFL-14 — Expression Input and Editing              | Gavi  | Gemini 3.1 Pro / Medium      | Gemini 3.1 Pro / Medium      | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / High   | Expression-state design becomes coupled to parser architecture → Opus (AGY) / Sol High (Codex)                                            |
| CFL-16 — Expression Evaluation                     | Eldad | Gemini 3.1 Pro / Medium      | Gemini 3.1 Pro / Medium      | Planning, implementation, and unit tests: GPT-5.6 Terra / Medium; normal parser work included | GPT-5.6 Terra / Medium | Complex parser-safety or cross-Feature review and QA → Sonnet (AGY) / Terra High (Codex); Opus / Sol High only for genuinely complex risk |
| CFL-17 — Powers and Roots                          | Eldad | Gemini 3.1 Pro / Medium      | Gemini 3.1 Pro / Medium      | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / Medium | Domain, precision, or nth-root edge cases remain unresolved → Sonnet (AGY) / Terra High (Codex)                                           |
| CFL-18 — Logarithmic Functions                     | Gavi  | Gemini 3.5 Flash / Medium    | Gemini 3.1 Pro / Medium      | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Terra / Medium | Domain or parser-integration failures → Sonnet (AGY) / Terra High (Codex)                                                                 |
| CFL-19 — Trigonometric Functions                   | Eldad | Gemini 3.1 Pro / Medium      | Gemini 3.1 Pro / Medium      | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / Medium | Tangent tolerance, angle-mode contract, or cross-feature failure → Sonnet (AGY) / Terra High (Codex)                                      |
| CFL-20 — Angle Mode                                | Eldad | Gemini 3.5 Flash / Medium    | Gemini 3.1 Pro / Medium      | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Terra / Medium | Mode state is inconsistent across trigonometric functions → Sonnet (AGY) / Terra High (Codex)                                             |
| CFL-21 — Additional Scientific Operations          | Gavi  | Gemini 3.1 Pro / Medium      | Gemini 3.1 Pro / Medium      | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / Medium | Percentage semantics, factorial limits, or expression integration remain ambiguous → Sonnet (AGY) / Terra High (Codex)                    |
| CFL-22 — Calculation History                       | Gavi  | Gemini 3.5 Flash / Medium    | Gemini 3.5 Flash / Medium    | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Luna / Medium  | Reuse creates state corruption or parser coupling → Sonnet (AGY) / Terra Medium (Codex)                                                   |
| CFL-23 — Memory Operations                         | Gavi  | Gemini 3.6 Flash / Medium    | Gemini 3.5 Flash / Medium    | GPT-5.4 Mini / Medium                                                                         | GPT-5.6 Luna / Medium  | Memory state is corrupted by errors or expression transitions → Sonnet (AGY) / Terra Medium (Codex)                                       |
| CFL-24 — Keyboard Support                          | Gavi  | Gemini 3.1 Pro / Medium      | Claude Sonnet 4.6 (Thinking) | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / High   | Global shortcut, focus, or event-order bugs are difficult to isolate → Opus (AGY) / Sol High (Codex)                                      |
| CFL-25 — Responsive Interface                      | Gavi  | Gemini 3.5 Flash / Medium    | Gemini 3.5 Flash / Medium    | GPT-5.6 Luna / Medium                                                                         | GPT-5.6 Luna / Medium  | Cross-breakpoint layout conflict or persistent overflow → Sonnet (AGY) / Terra Medium (Codex)                                             |
| CFL-26 — Accessibility                             | Gavi  | Claude Sonnet 4.6 (Thinking) | Claude Sonnet 4.6 (Thinking) | GPT-5.6 Terra / High                                                                          | GPT-5.6 Terra / High   | Conflicting semantics, focus behavior, or live-region behavior → Opus (AGY) / Sol High (Codex)                                            |
| CFL-27 — Application Logging                       | Eldad | Gemini 3.1 Pro / Medium      | Gemini 3.1 Pro / Medium      | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / Medium | Logging affects calculator behavior or unexpected failures are not isolated → Sonnet (AGY) / Terra High (Codex)                           |
| CFL-28 — Log Export and Submission Evidence        | Gavi  | Gemini 3.6 Flash / Medium    | Gemini 3.5 Flash / Medium    | GPT-5.4 Mini / Medium                                                                         | GPT-5.6 Luna / Medium  | Browser download, JSON integrity, or final evidence is unreliable → Sonnet (AGY) / Terra Medium (Codex)                                   |
| CFL-29 — Continuous Integration                    | Eldad | Gemini 3.1 Pro / Medium      | Gemini 3.1 Pro / Medium      | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / Medium | CI differs from local results or coverage enforcement is unstable → Sonnet (AGY) / Terra High (Codex)                                     |
| CFL-30 — Vercel Deployment                         | Gavi  | Gemini 3.6 Flash / Medium    | Gemini 3.5 Flash / Medium    | GPT-5.4 Mini / Medium                                                                         | GPT-5.6 Luna / Medium  | Preview/production mismatch or unexplained deployment failure → Sonnet (AGY) / Terra High (Codex)                                         |
| CFL-31 — Release Management                        | Eldad | Gemini 3.6 Flash / Low       | Gemini 3.6 Flash / Low       | GPT-5.4 Mini / Medium                                                                         | GPT-5.4 Mini / Medium  | Tag, release, deployment, and Jira states conflict → Sonnet (AGY) / Terra Medium (Codex)                                                  |
| CFL-32 — Dependency Governance                     | Eldad | Gemini 3.1 Pro / Medium      | Claude Sonnet 4.6 (Thinking) | GPT-5.6 Terra / Medium                                                                        | GPT-5.6 Terra / High   | Security, maintenance, bundle, or dependency-tree risk is unclear → Opus (AGY) / Sol High (Codex)                                         |
| CFL-33 — License Reporting                         | Gavi  | Gemini 3.6 Flash / Low       | Gemini 3.5 Flash / Medium    | GPT-5.4 Mini / Medium                                                                         | GPT-5.6 Luna / Medium  | Unknown, custom, or incompatible licenses require investigation → Sonnet (AGY) / Terra High (Codex)                                       |

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

Before presenting the Feature development plan, the active agent must include:

```text
CONFIGURATION CHECK

- Jira Feature:
- Stage:
- Active tool: AGY IDE / Codex
- If AGY IDE — Approved model:
- If AGY IDE — Approved reasoning level (Gemini only):
- If Codex — Approved model:
- If Codex — Approved reasoning:
- Current configuration:
- Configuration status: Matches / Change required
- Escalation trigger currently present: Yes / No
- Codex quota justification (if Codex): [reason or N/A]
```

When the configuration matches, continue to the normal planning approval point in `PROJECT_PLAN.md`.

When a change is required, use the mandatory format from §5 and wait.

## 10. AGY IDE Context-Window Monitoring

The AGY IDE agent must monitor its own context-window usage during every session.

### 60 % threshold rule

When the agent estimates it has consumed approximately **60 % or more** of the available context window in the current conversation, it must:

1. **Flag the threshold** immediately in the chat using this exact block:

   ```text
   ⚠️ CONTEXT WINDOW — 60 % REACHED

   - Conversation ID:
   - Estimated context used: ~X %
   - Active Jira Feature:
   - Active stage:
   - Active branch / PR:
   - Last verified state:
   - Safe stopping point:
   - Recommended next action:
   ```

2. **Write or overwrite `CODEX_HANDSHAKE.md`** in the repository root with a structured handoff snapshot so a new session (AGY IDE or Codex) can resume without re-reading the full conversation.

### CODEX_HANDSHAKE.md content at 60 %

The file must contain:

```markdown
# CalcFlow session handoff — [Feature / Work Item]

## Session metadata

- Timestamp (UTC):
- Tool: AGY IDE
- Model:
- Conversation ID:
- Context used at handoff: ~X %

## Verified state

- Branch:
- Open PR (if any):
- Jira items in progress:
- Last passing test run:
- Last verified coverage:

## Changes made this session

<!-- Bullet summary of all meaningful changes, one bullet per file or logical group -->

## Pending work

<!-- What was in progress or not yet started when the handoff was triggered -->

## Known issues / risks

<!-- Anything the next session must be aware of -->

## Restart prompt

Continue CalcFlow [Feature/Work Item] from [branch]. Read `AGENTS.md`, `PROJECT_PLAN.md`, `SECOND_BRAIN.md`, `CODEX_MODEL_GUIDE.md`, `design.md`, and this file. [Brief state summary]. [Next concrete action].
```

### 90 % hard stop

If the agent reaches approximately **90 % context usage** without having already flagged at 60 %, it must immediately:

1. Reach the nearest safe stopping point (finish the current file write or tool call).
2. Write `CODEX_HANDSHAKE.md` as described above.
3. Output the 60 % flag block in chat (marked as late).
4. Stop accepting new implementation work and wait for the user to start a new session.

### Estimation guidance

The agent does not have a direct token counter. Use these signals as proxies:

- Conversation has exceeded approximately 20–25 turns of substantive tool use.
- The system has warned about context length or responses feel truncated.
- A previous section of the conversation is no longer fully visible in working memory.
- The user asks to "start a new chat" or "continue in a new session".

When any of these signals appear, treat the threshold as reached and write the handshake file.
