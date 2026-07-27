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
- Scientific mode is the approved Basic / Scientific toggle on one shared
  calculator surface.
- Active-operator highlighting is obsolete.

Still open and not to be guessed:

- primary theme, final palette, and font family;
- final header/subtitle presentation;
- exact scientific control grid/order beyond preserving the shared surface;
- feature-owned scientific keyboard shortcuts.

## AI Rules

Before a UI change, read this document. Preserve the base keypad and
expression-controls row. Do not add a new layout, design system, library,
palette, typography choice, or future Feature behavior without the required
approval and owning Jira scope.
