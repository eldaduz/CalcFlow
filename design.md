# CalcFlow UI Design Specification

## Purpose

This document is the shared source of truth for the CalcFlow user interface and user experience. Codex and Claude must read this file before making any UI change.

The goal is to ensure that both AI-assisted development streams implement one consistent interface rather than introducing separate visual systems, layouts, or interaction patterns.

## Design Principles

CalcFlow should feel modern, clean, professional, and easy to understand.

The interface must be:

- simple and uncluttered;
- visually consistent;
- comfortable to use with a mouse or keyboard;
- responsive on desktop and mobile;
- clear without requiring instructions;
- focused on usability rather than decorative effects.

The calculator should not imitate an old physical calculator and should not introduce visual effects that do not improve usability.

## MVP Screen Structure

```text
Calculator Container
├── Header
├── Display
│   ├── Previous Expression
│   └── Current Input / Result
├── Error Message Area
└── Keypad
```

### Header

The header includes:

- product name: `CalcFlow`;
- optional short label: `Basic Calculator`;
- no complex navigation.

### Display

The display is the primary visual element.

It shows:

- the previous expression or selected operation on the upper line;
- the current input or result on the main line;
- right-aligned numeric content;
- horizontal scrolling or controlled text sizing for long values.

Example:

```text
12 × 4
48
```

### Error Area

Errors appear close to the display and not in a popup.

Example:

```text
Division by zero is not allowed
```

Error messages must be:

- concise;
- understandable;
- accessible through `aria-live`;
- cleared after new valid input or a reset action.

Do not use `alert()` for normal calculator errors.

## Keypad Layout

### Expression Controls Row

For v0.2.0 — Expressions and Parentheses, a dedicated expression-controls
row appears directly above the approved four-column calculator keypad:

```text
┌────┬────┐
│ (  │ )  │
└────┴────┘
```

- `(` and `)` are adjacent, standard-size controls aligned with the first two
  keypad columns;
- this row adds expression controls without replacing, shrinking, or
  reordering any control in the existing keypad grid;
- the controls use the same spacing, button height, focus treatment, and
  responsive behavior as the keypad;
- an expression may be temporarily incomplete while it is being edited;
  attempting to calculate an incomplete or unbalanced expression uses the
  existing inline error area and recovery behavior.

The controls are part of the v0.2.0 expression workflow, not a future
scientific-mode feature.

### Base Keypad

```text
┌────┬────┬────┬────┐
│ AC │ ±  │ ⌫  │ ÷  │
├────┼────┼────┼────┤
│ 7  │ 8  │ 9  │ ×  │
├────┼────┼────┼────┤
│ 4  │ 5  │ 6  │ −  │
├────┼────┼────┼────┤
│ 1  │ 2  │ 3  │ +  │
├────┼────┼────┼────┤
│ 0       │ .  │ =  │
└────┴────┴────┴────┘
```

### Button Groups

1. Expression controls
2. Numeric buttons
3. Arithmetic operators
4. System actions
5. Equals action

### Expression Controls

- `(` — open parenthesis;
- `)` — close parenthesis.

Both controls append to the expression being edited. They do not calculate the
expression themselves.

### Numeric Buttons

- digits `0–9`;
- decimal separator `.`;
- `0` may occupy double width.

### Arithmetic Operators

- `+`
- `−`
- `×`
- `÷`

### System Actions

- `AC` — clear the complete calculation;
- `⌫` — delete the last digit;
- `±` — toggle positive or negative value.

### Equals

- `=` must be more visually prominent than numeric buttons.

## Visual Hierarchy

The visual priority is:

1. current result;
2. previous expression;
3. equals button;
4. arithmetic operators;
5. numeric buttons;
6. clear and delete actions.

The user must immediately understand:

- where input and results appear;
- which operation is active;
- how to calculate;
- how to clear or correct input.

## Color System

Final color values are not yet approved. Use centralized design tokens rather than hardcoded component colors.

Required tokens:

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

Rules:

- use a calm page background;
- separate the calculator surface from the page background;
- visually distinguish operator buttons from numeric buttons;
- make the equals button the strongest action;
- do not communicate errors by color alone;
- maintain sufficient contrast;
- do not introduce component-specific random colors.

## Typography

Use one clear and readable font family unless another is explicitly approved.

Suggested hierarchy:

```text
Product title: 20–24px
Previous expression: 16–18px
Current result: 36–48px
Button labels: 18–22px
Error message: 14–16px
```

The numeric display must make digits easy to distinguish.

## Spacing and Sizing

Use the following spacing scale:

```text
4px
8px
12px
16px
24px
32px
```

Rules:

- use consistent gaps between keypad buttons;
- use consistent internal padding;
- keep button heights uniform;
- avoid arbitrary spacing values;
- maintain a minimum interactive height of approximately `48px`.

## Button States

Every button must support:

- default;
- hover;
- active / pressed;
- focus;
- disabled, when relevant.

The keyboard focus indicator must remain clearly visible. Do not remove `outline` without providing an accessible replacement.

The currently selected arithmetic operation may remain visually active until the next operand is entered.

## Responsive Design

### Desktop

- center the calculator on the page;
- use a constrained width;
- keep the complete keypad visible without scrolling.

### Mobile

- fit the calculator within the viewport;
- preserve page padding;
- keep buttons large enough for touch;
- prevent horizontal page scrolling;
- handle long display values gracefully.

Recommended sizing:

```text
Maximum calculator width: approximately 380–440px
Mobile width: calc(100% - page padding)
```

Do not build the entire layout using fixed pixel positioning.

## Keyboard Support

Supported keys:

```text
0–9
+
-
*
/
.
(
)
Enter
=
Backspace
Escape
```

Mapping:

- `Enter` or `=` — calculate;
- `Escape` — clear all;
- `Backspace` — delete the last digit;
- `*` is displayed as `×`;
- `/` is displayed as `÷`.
- `(` and `)` enter the corresponding parenthesis in the expression.

Keyboard interaction should provide visual feedback similar to button interaction.

## Accessibility

All controls must use semantic `button` elements. Do not implement clickable controls with `div` elements.

Requirements:

- full keyboard navigation;
- logical focus order;
- visible focus state;
- `aria-label` for symbols that may be unclear;
- error message region using `aria-live`;
- sufficient contrast;
- no information communicated by color alone;
- reduced-motion support if animations are introduced.

Suggested labels:

```text
⌫ → Delete last digit
± → Toggle positive or negative
÷ → Divide
× → Multiply
( → Open parenthesis
) → Close parenthesis
```

## Motion and Feedback

Animations must be short and subtle.

Allowed examples:

- small pressed-state feedback;
- short color transition;
- subtle state change.

Avoid large movement, glow, glass effects, or 3D effects unless both team members explicitly approve them.

## Error and Recovery Behaviour

For errors such as division by zero:

- show a clear inline message;
- do not crash the application;
- allow the user to begin a new calculation;
- allow `AC` to restore the initial state.

## Future Scientific Expansion

The MVP includes only the basic calculator interface, but the design should not prevent future scientific expansion.

Possible later additions:

- Basic / Scientific mode switch;
- a wider desktop keypad;
- `sin`, `cos`, `tan`;
- `log`, `ln`;
- powers and roots;
- degree / radian mode.

Do not reserve empty visual space for future features when it harms the MVP experience.

## AI Implementation Rules

Before changing any UI, read this file completely.

Do not:

- introduce a new color system;
- change the keypad layout;
- add visual effects;
- replace approved typography;
- add a UI library;
- change responsive behaviour;
- add new interface features;

unless the change is approved by both team members and documented here.

Codex and Claude must:

- use the same design tokens;
- preserve the approved base keypad grid and expression-controls row;
- use consistent naming;
- avoid unnecessary inline styles;
- avoid unapproved UI libraries;
- avoid unsolicited visual redesigns.

## Open Design Decisions

The following decisions remain open and require joint approval before implementation:

1. primary theme: light or dark;
2. final color palette;
3. font family;
4. whether the `0` button uses double width;
5. whether the previous expression is always displayed;
6. whether the active operator is highlighted;
7. whether the calculator includes a visible header;
8. whether future Scientific Mode uses a toggle or a separate layout.

Until approved, AI tools must not make permanent assumptions about these items.
