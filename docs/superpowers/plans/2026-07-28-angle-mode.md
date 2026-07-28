# Angle Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to toggle between degree and radian modes for trigonometric functions and persist it.

**Architecture:** Extend expression engine reducer state with `angleMode` and implement immediate re-evaluation on toggle. Add DEG/RAD toggle button in Scientific keypad and small mode text in Display.

**Tech Stack:** React, CSS, Vitest, jsdom

## Global Constraints

- No keyboard shortcuts for angle mode (design.md contract).
- Selected mode persists in `sessionStorage` for the current tab session.
- Immediate re-evaluation when mode toggles.

---

### Task 1: Extend Expression Engine with Angle Mode

**Files:**

- Modify: `src/lib/expressionEngine.js`
- Test: `tests/expressionEngine.test.js`

**Interfaces:**

- Consumes: None
- Produces: `angleMode` in state, `TOGGLE_ANGLE_MODE` action in `expressionReducer`

- [ ] **Step 1: Write the failing tests**

Add these tests to `tests/expressionEngine.test.js`:

```javascript
test('initialState includes angleMode defaulting to rad', () => {
  expect(initialState.angleMode).toBe('rad');
});

test('TOGGLE_ANGLE_MODE toggles mode between rad and deg', () => {
  const state1 = expressionReducer(initialState, { type: 'TOGGLE_ANGLE_MODE' });
  expect(state1.angleMode).toBe('deg');
  const state2 = expressionReducer(state1, { type: 'TOGGLE_ANGLE_MODE' });
  expect(state2.angleMode).toBe('rad');
});

test('TOGGLE_ANGLE_MODE re-evaluates active expression immediately', () => {
  const state = expressionReducer(
    {
      expression: 'sin(90)',
      previousExpression: '',
      justEvaluated: false,
      error: null,
      angleMode: 'rad',
    },
    { type: 'TOGGLE_ANGLE_MODE' },
  ); // switches to deg

  // sin(90) in deg mode is 1
  const evaluated = expressionReducer(state, { type: 'EQUALS' });
  expect(evaluated.expression).toBe('1');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL (or compilation/import errors due to undefined tests/initialState properties)

- [ ] **Step 3: Write minimal implementation**

Modify `src/lib/expressionEngine.js` to update `initialState`, `evaluateCurrentExpression`, and `expressionReducer`:

```javascript
export const initialState = {
  expression: '',
  previousExpression: '',
  justEvaluated: false,
  error: null,
  angleMode:
    (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('calcflow_angle_mode')) ||
    'rad',
};

function evaluateCurrentExpression(state) {
  let result;
  try {
    result = evaluateExpression(toAsciiExpression(state.expression), {
      angleMode: state.angleMode,
    });
  } catch (error) {
    console.error('Unexpected expression evaluation failure', error);
    return {
      ...state,
      error: {
        code: 'UNEXPECTED_EVALUATION_ERROR',
        message:
          'Something went wrong while evaluating the expression. Please edit it and try again.',
      },
    };
  }

  if (result.ok) {
    return {
      ...state,
      expression: formatResultForExpression(result.value),
      previousExpression: state.expression,
      justEvaluated: true,
      error: null,
    };
  }

  return {
    ...state,
    error: { message: result.error.message, code: result.error.code },
  };
}
```

And in `expressionReducer`:

```javascript
    case 'TOGGLE_ANGLE_MODE': {
      const nextMode = state.angleMode === 'deg' ? 'rad' : 'deg';
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('calcflow_angle_mode', nextMode);
      }
      const nextState = { ...state, angleMode: nextMode, error: null };

      // Immediately re-evaluate if there is an active expression or just evaluated
      if (state.expression !== '') {
        return evaluateCurrentExpression(nextState);
      }
      return nextState;
    }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add src/lib/expressionEngine.js tests/expressionEngine.test.js
git commit -m "feat: integrate angleMode into expression engine state and evaluation"
```

---

### Task 2: Display Component Indicator

**Files:**

- Modify: `src/components/Calculator.jsx`
- Modify: `src/components/Display.jsx`
- Modify: `src/styles/calculator.css`
- Test: `tests/calculator.test.jsx`

**Interfaces:**

- Consumes: `state.angleMode` from `expressionReducer`
- Produces: Visual active angle mode indicator on the display

- [ ] **Step 1: Write the failing tests**

Add these tests to `tests/calculator.test.jsx`:

```javascript
test('renders angle mode indicator inside display', () => {
  renderCalculator();
  // By default, displays RAD
  const indicator = container.querySelector('.calculator-angle-mode-indicator');
  expect(indicator).not.toBeNull();
  expect(indicator.textContent).toBe('RAD');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Modify `src/components/Display.jsx` to render the indicator:

```jsx
export default function Display({ currentValue, previousExpression, error, angleMode }) {
  return (
    <div className="calculator-display-container">
      <div className="calculator-display">
        <div className="previous-expression">{previousExpression}</div>
        <div className="calculator-display-row">
          <span className="calculator-angle-mode-indicator">
            {angleMode ? angleMode.toUpperCase() : 'RAD'}
          </span>
          <div className="current-value" aria-live="polite">
            {currentValue}
          </div>
        </div>
      </div>
      <div className="calculator-error" role="alert">
        {error ? error.message : ''}
      </div>
    </div>
  );
}
```

In `Calculator.jsx`, pass `state.angleMode` to `<Display>`:

```jsx
<Display
  currentValue={formatExpressionForDisplay(state.expression) || '0'}
  previousExpression={formatExpressionForDisplay(state.previousExpression)}
  error={state.error}
  angleMode={state.angleMode}
/>
```

In `src/styles/calculator.css`, style the indicator:

```css
.calculator-display-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
}

.calculator-angle-mode-indicator {
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: bold;
  margin-bottom: var(--space-8);
  padding: var(--space-4) var(--space-8);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--space-4);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add src/components/Calculator.jsx src/components/Display.jsx src/styles/calculator.css tests/calculator.test.jsx
git commit -m "feat: add angle mode indicator to calculator display"
```

---

### Task 3: Keypad Control Integration

**Files:**

- Modify: `src/components/Keypad.jsx`
- Modify: `src/components/Calculator.jsx`
- Test: `tests/calculator.test.jsx`

**Interfaces:**

- Consumes: `state.angleMode` and `dispatch({ type: 'TOGGLE_ANGLE_MODE' })`
- Produces: Interactive DEG/RAD button in the Scientific keypad

- [ ] **Step 1: Write the failing tests**

Add these tests to `tests/calculator.test.jsx`:

```javascript
test('clicking the DEG/RAD button toggles angle mode and re-evaluates', () => {
  renderCalculator();
  clickButton('Scientific');

  // Default is RAD
  expect(container.querySelector('.calculator-angle-mode-indicator').textContent).toBe('RAD');

  // Type sin(90)
  clickButton('sin');
  clickButton('9');
  clickButton('0');
  clickButton(')');
  clickButton('=');

  // sin(90) in RAD is 0.893996663601
  expect(currentValue()).toBe('0.893996663601');

  // Click RAD to toggle to DEG
  clickButton('RAD');

  // Button text updates to DEG
  const degBtn = Array.from(container.querySelectorAll('button')).find(
    (el) => el.textContent === 'DEG',
  );
  expect(degBtn).not.toBeNull();

  // Display updates immediately to 1
  expect(currentValue()).toBe('1');
  expect(container.querySelector('.calculator-angle-mode-indicator').textContent).toBe('DEG');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

In `Calculator.jsx`, pass `state.angleMode` and a handler to `Keypad`:

```jsx
<Keypad
  onDigit={(digit) => dispatch({ type: 'DIGIT', digit })}
  onDecimal={() => dispatch({ type: 'DECIMAL' })}
  onOperator={(operator) => dispatch({ type: 'OPERATOR', operator })}
  onOpenParen={() => dispatch({ type: 'OPEN_PAREN' })}
  onCloseParen={() => dispatch({ type: 'CLOSE_PAREN' })}
  onEquals={() => dispatch({ type: 'EQUALS' })}
  onClear={() => dispatch({ type: 'CLEAR' })}
  onDelete={() => dispatch({ type: 'DELETE' })}
  onToggleSign={() => dispatch({ type: 'TOGGLE_SIGN' })}
  scientific={mode === 'scientific'}
  angleMode={state.angleMode}
  onToggleAngleMode={() => dispatch({ type: 'TOGGLE_ANGLE_MODE' })}
  onPower={(square) => dispatch({ type: 'POWER', square })}
  onSquareRoot={() => dispatch({ type: 'SQUARE_ROOT' })}
  onNthRoot={() => dispatch({ type: 'NTH_ROOT' })}
  onFunction={(name) => dispatch({ type: 'FUNCTION', name })}
  onFactorial={() => dispatch({ type: 'FACTORIAL' })}
  onAbs={() => dispatch({ type: 'ABS' })}
  onConstant={(symbol) => dispatch({ type: 'CONSTANT', symbol })}
/>
```

In `Keypad.jsx`, accept `angleMode` and `onToggleAngleMode` props, and render the button at the beginning of the scientific row:

```jsx
export default function Keypad({
  onDigit,
  onDecimal,
  onOperator,
  onOpenParen,
  onCloseParen,
  onEquals,
  onClear,
  onDelete,
  onToggleSign,
  scientific,
  angleMode,
  onToggleAngleMode,
  onPower,
  onSquareRoot,
  onNthRoot,
  onFunction,
  onFactorial,
  onAbs,
  onConstant,
}) {
  return (
    <div className="calculator-keypad-section">
      {scientific && (
        <div className="calculator-scientific-row">
          <button
            type="button"
            className="calculator-button"
            aria-label={`Angle mode: current is ${angleMode ? angleMode.toUpperCase() : 'RAD'}. Click to switch.`}
            onClick={onToggleAngleMode}
          >
            {angleMode ? angleMode.toUpperCase() : 'RAD'}
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Sine"
            onClick={() => onFunction('sin')}
          >
            sin
          </button>
...
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add src/components/Keypad.jsx src/components/Calculator.jsx tests/calculator.test.jsx
git commit -m "feat: add DEG/RAD toggle button to Keypad scientific controls"
```
