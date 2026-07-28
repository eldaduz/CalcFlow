# Design Spec: CFL-20 — Angle Mode

Allow users to switch between degree and radian modes for trigonometric functions.

## 1. Requirements

- A visible control toggles DEG and RAD in Scientific mode.
- Display shows small DEG or RAD indicator.
- Toggling the angle mode immediately re-evaluates the active expression.
- Selected angle mode persists in `sessionStorage` for the current tab session.
- No keyboard shortcuts for angle mode (following design.md scope).

## 2. Proposed Changes

### Reducer & Engine

- **Modify** `initialState` in [expressionEngine.js](file:///home/dev/Desktop/Fullstack/CalcFlow/src/lib/expressionEngine.js):
  - Add `angleMode: sessionStorage.getItem('calcflow_angle_mode') || 'rad'`.
- **Modify** `evaluateCurrentExpression(state)`:
  - Pass `{ angleMode: state.angleMode }` to `evaluateExpression`.
- **Modify** `expressionReducer`:
  - Handle `TOGGLE_ANGLE_MODE` action:
    - Toggle `angleMode` between `deg` and `rad`.
    - Persist to `sessionStorage` under `'calcflow_angle_mode'`.
    - If `justEvaluated` or an expression exists, re-evaluate by calling `evaluateCurrentExpression` with the new mode.

### Calculator UI

- **Modify** [Calculator.jsx](file:///home/dev/Desktop/Fullstack/CalcFlow/src/components/Calculator.jsx):
  - Pass `state.angleMode` to `Display` and `Keypad`.
  - Add handler `onToggleAngleMode={() => dispatch({ type: 'TOGGLE_ANGLE_MODE' })}`.
- **Modify** [Display.jsx](file:///home/dev/Desktop/Fullstack/CalcFlow/src/components/Display.jsx):
  - Add a small text indicator showing the current `angleMode.toUpperCase()` (e.g. `DEG` or `RAD`).
- **Modify** [Keypad.jsx](file:///home/dev/Desktop/Fullstack/CalcFlow/src/components/Keypad.jsx):
  - Add `angleMode` and `onToggleAngleMode` props.
  - Render an angle mode button inside the scientific controls row:
    ```jsx
    <button
      type="button"
      className="calculator-button"
      aria-label={`Angle mode: current is ${angleMode.toUpperCase()}. Click to switch.`}
      onClick={onToggleAngleMode}
    >
      {angleMode.toUpperCase()}
    </button>
    ```

### Styles

- **Modify** [calculator.css](file:///home/dev/Desktop/Fullstack/CalcFlow/src/styles/calculator.css):
  - Add styles for the display indicator and angle mode button if needed.

## 3. Verification Plan

### Automated Tests

- In `tests/expressionEngine.test.js`:
  - Verify initial state is loaded correctly.
  - Verify `TOGGLE_ANGLE_MODE` updates state and persists to `sessionStorage`.
  - Verify toggling angle mode immediately re-evaluates expressions.
- In `tests/calculator.test.jsx`:
  - Verify the DEG/RAD button is rendered and clickable in Scientific mode.
  - Verify display indicator updates when clicked.
  - Verify trigonometric operations calculate in selected mode (e.g. `sin(90)` in DEG is `1`, in RAD is `0.89399...`).

### Manual Verification

- Toggle to Scientific mode.
- Type `sin(90) =`. Verify output is `0.893996663601` (default RAD).
- Click `RAD` button to toggle to `DEG`. Verify output immediately updates to `1`, and button/display updates to `DEG`.
- Reload page. Verify `DEG` mode persists.
