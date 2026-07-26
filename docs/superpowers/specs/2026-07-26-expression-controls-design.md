# Expression Controls Design

## Approved decision

CalcFlow v0.2.0 will expose `(` and `)` through a dedicated expression-controls
row above the existing four-column keypad. The controls are also available from
the keyboard.

Eldad and Gavi approved this decision on 2026-07-26.

## Layout and interaction

The new row contains two adjacent, standard-size controls aligned with the
first two keypad columns. It preserves the approved base keypad rather than
replacing or moving `AC`, `±`, `⌫`, or the arithmetic operators.

Buttons and keyboard input append parentheses to the expression being edited.
An unfinished expression is permitted during entry. On calculation, malformed
or unbalanced input uses the existing accessible inline error region; a valid
subsequent input or reset clears the error.

## Ownership and boundaries

- CFL-14 / CFL-51 own expression editing, display synchronization, the button
  controls, and keyboard entry.
- CFL-16 owns `evaluateExpression(source)` and its result/error contract.
- CFL-54 integrates the approved editor state with the evaluator after the
  CFL-14 contract is available.

No application code is included in this documentation change.

## Verification when implemented

- Button and keyboard entry both append opening and closing parentheses.
- Nested and incomplete input remains editable.
- The base keypad retains its existing controls and order.
- Evaluation errors are rendered inline and recover without reload.
- Keyboard focus and accessible labels remain correct.
