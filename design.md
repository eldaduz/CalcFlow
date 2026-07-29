# CalcFlow UI Design Specification

## Purpose

This document is the shared UI and UX contract for CalcFlow. It preserves one
calculator workflow as features are added; it does not authorize future
implementation before its Jira Feature begins.

## Product Surface

CalcFlow has one calculator surface with a `Basic` / `Scientific` mode toggle
in the header.

- Basic mode shows the approved expression-controls row and unchanged
  four-column base keypad.
- Scientific mode reveals a scientific-controls section above those controls.
- Scientific mode never replaces, shrinks, or reorders the base keypad.
- Mode is presentation state only: both modes use the same editable expression,
  display, equals action, inline errors, and recovery behavior.
- The toggle uses semantic buttons, exposes its selected state, and does not
  reset a calculation.

No separate scientific calculator layout is approved.

## Shared Screen Structure

```text
Calculator Container
├── Header: CalcFlow and Basic / Scientific toggle
├── Display: previous expression and current input/result
├── Inline error / status area
├── Scientific controls (Scientific mode only)
├── Expression controls row
└── Base keypad
```

The display remains the primary visual element. Numeric content is right
aligned and handles long values through controlled sizing or horizontal
scrolling. Errors stay near the display, use `aria-live`, preserve the
editable expression, and clear after valid editing or reset.

## Base Keypad and Expression Workflow

The base keypad is permanent:

```text
AC  ±  ⌫  ÷
7   8  9  ×
4   5  6  −
1   2  3  +
0      .  =
```

- `0` is double width.
- `(` and `)` remain in the expression-controls row directly above the base
  keypad.
- `AC`, delete, sign toggle, keyboard entry, and equals retain their existing
  expression behavior.
- The expression may be incomplete while being edited; calculation reports the
  existing inline controlled error rather than blocking entry.
- Do not restore active-operator highlighting: multi-operator expressions make
  it misleading.

## Scientific Control Contracts

Controls append to or edit the same expression. They never calculate by
themselves unless their Feature explicitly approves an immediate operation.

| Feature                                     | Controls and behavior contract                                                                                                                                                                                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CFL-17 Powers and Roots                     | `x²`, `xʸ`, `√`, and `ⁿ√` support expression entry. `x²` appends `^2`; `xʸ` appends `^`; prefix `√` starts a square-root operand; infix `√` follows a degree and starts an nth-root radicand. Power and root domains report controlled real-number errors inline.                |
| CFL-18 Logarithms                           | `log` and `ln` are Scientific expression functions: each control inserts `log(` or `ln(` at the cursor for continued editable entry (for example, `log(100)`). They never replace the expression with its current evaluated value. Evaluator serialization remains CFL-18 scope. |
| CFL-19 / CFL-20 Trigonometry and angle mode | `sin`, `cos`, `tan` use the shared expression. A visible `DEG` / `RAD` mode control makes the active mode unambiguous and keeps it for the current session.                                                                                                                      |
| CFL-21 Additional operations                | `%`, `&#124;x&#124;`, `x!`, `π`, and `e` use the same scientific-controls section and expression flow.                                                                                                                                                                           |

Keyboard support invokes the same actions as controls. Existing basic keys stay
supported. Scientific shortcuts must not be added until their owning Feature
documents them; controls remain discoverable without hidden shortcuts.

## Future Information Controls

History and memory add no permanently reserved blank space.

- CFL-22 history is a collapsible region below the keypad. Each entry displays
  an expression and result, can be reused, and clears independently.
- CFL-23 memory controls (`MC`, `MR`, `M+`, `M−`) live in Scientific mode. Any
  visible memory state is accessible; errors and `AC` do not silently erase it.
- CFL-27 logging adds no click-by-click UI.
- CFL-28 adds an `Export Logs` control that downloads JSON. Export success or
  failure uses inline status feedback and never exposes sensitive data.

## Accessibility and Responsive Rules

- Use semantic `button` elements, logical focus order, visible focus, and
  descriptive labels for symbols.
- Keep the display, error, status, toggle, angle mode, history, and memory
  state programmatically available to assistive technology.
- Communicate state with text or semantics, not color alone.
- Desktop keeps one constrained calculator surface. Mobile stacks or wraps
  scientific controls without horizontal page scrolling, clipping, or
  undersized targets.
- Keep touch targets approximately 48px high and preserve reduced-motion
  support if motion is introduced.

## Visual System

Use centralized tokens only:

```css
--color-background;
--color-surface;
--color-display;
--color-text-primary;
--color-text-secondary;
--color-number-button;
--color-operator-button;
--color-action-button;
--color-equals-button;
--color-error;
--color-focus;
```

Use the existing spacing scale: 4px, 8px, 12px, 16px, 24px, and 32px. Keep
equals visually prominent. No UI library, animation system, component-specific
palette, or fixed-position layout is authorized.

## Decisions

Resolved:

- `0` is double width.
- The calculator has a visible header.
- Scientific mode is the approved Basic / Scientific toggle on one shared
  calculator surface.
- Active-operator highlighting is obsolete.
- CFL-24/CFL-70 scientific keyboard shortcuts (approved by both Gavi and
  Eldad): bare letter/symbol keys, active only in Scientific mode since
  their controls are only visible there — `s`/`c`/`t` sin/cos/tan, `l`/`n`
  log/ln, `r` square root, `u` nth root, `^` power, `!` factorial, `%`
  percent, `p`/`e` constants, `d` toggles DEG/RAD. No shortcut for `x²`
  since `^` then `2` already produces the same token. Memory shortcuts
  (MC/MR/M+/M−) are intentionally excluded from this pass — not part of
  this control set. A `?` key (any mode) toggles a shortcuts-help panel
  listing all shortcuts. `Esc` while the panel is open closes the panel
  **only** — it does not also clear the expression in that same keypress.
  A second, separate `Esc` press (with the panel already closed) then
  clears, same as always. This is deliberate, not an oversight: the panel
  exists so a user can look something up mid-calculation (e.g. "what's the
  shortcut for π?") without losing their in-progress expression as a side
  effect of dismissing it. Collapsing "close panel" and "clear" into one
  keypress would make checking the help panel destructive for the exact
  case it's meant to serve. The panel is non-modal and never blocks
  interaction while open (per CFL-70's "focus is not trapped" AC), so nothing is lost by requiring the second press.
- Scoped exception to the "no fixed-position layout" rule below (approved
  by both Gavi and Eldad, CFL-24/CFL-70 only): the `?` shortcuts-help panel
  is a floating window (`position: fixed`), not in-flow. It does not
  capture focus, does not block interaction with the rest of the
  calculator while open, and uses only existing color/spacing tokens — no
  new UI library or backdrop/dimming layer. This exception does not extend
  to any other future panel; a new floating element still needs its own
  explicit joint approval.

Still open and not to be guessed:

- primary theme, final palette, and font family;
- final header/subtitle presentation;
- whether the previous-expression line is always displayed when empty;
- exact scientific control grid/order beyond preserving the shared surface.

## AI Rules

Before a UI change, read this document. Preserve the base keypad and
expression-controls row. Do not add a new layout, design system, library,
palette, typography choice, or future Feature behavior without the required
approval and owning Jira scope.
