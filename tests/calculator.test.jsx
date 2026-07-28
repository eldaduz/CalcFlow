import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, expect, test } from 'vitest';

import Calculator from '../src/components/Calculator.jsx';

let container;
let root;

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  container?.remove();
  root = undefined;
  container = undefined;
});

function renderCalculator() {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root.render(<Calculator />);
  });
}

function clickButton(text) {
  const button = Array.from(container.querySelectorAll('button')).find(
    (el) => el.textContent === text,
  );
  if (!button) {
    throw new Error(`No button found with text "${text}"`);
  }
  act(() => {
    button.click();
  });
}

function pressKey(key) {
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  });
}

function currentValue() {
  return container.querySelector('.current-value').textContent;
}

function previousExpression() {
  return container.querySelector('.previous-expression').textContent;
}

function errorText() {
  return container.querySelector('.calculator-error').textContent;
}

test('a multi-operand expression with parentheses evaluates with correct precedence', () => {
  renderCalculator();

  clickButton('(');
  clickButton('5');
  clickButton('+');
  clickButton('2');
  clickButton(')');
  clickButton('×');
  clickButton('3');
  clickButton('=');

  expect(currentValue()).toBe('21');
  expect(previousExpression()).toBe('(5 + 2) × 3');
});

test('delete and clear work consistently while editing an expression', () => {
  renderCalculator();

  clickButton('1');
  clickButton('2');
  clickButton('+');
  clickButton('(');
  clickButton('3');
  clickButton('⌫');
  expect(currentValue()).toBe('12 + (');

  clickButton('AC');
  expect(currentValue()).toBe('0');
});

test('an unclosed parenthesis shows a controlled error without losing the expression', () => {
  renderCalculator();

  clickButton('(');
  clickButton('2');
  clickButton('+');
  clickButton('3');
  clickButton('=');

  expect(errorText()).not.toBe('');
  expect(currentValue()).toBe('(2 + 3');
});

test('the user recovers from an error by editing in place, without reloading', () => {
  renderCalculator();

  clickButton('(');
  clickButton('2');
  clickButton('+');
  clickButton('3');
  clickButton('=');
  expect(errorText()).not.toBe('');

  clickButton(')');
  clickButton('=');

  expect(errorText()).toBe('');
  expect(currentValue()).toBe('5');
});

test('every digit, operator, decimal, and sign-toggle button works', () => {
  renderCalculator();

  clickButton('9');
  clickButton('6');
  clickButton('3');
  clickButton('2');
  clickButton('.');
  clickButton('5');
  clickButton('−');
  clickButton('4');
  clickButton('=');
  expect(currentValue()).toBe('9628.5');

  clickButton('AC');
  clickButton('8');
  clickButton('±');
  expect(currentValue()).toBe('−8');
});

test('keyboard decimal and parenthesis keys match their button behavior', () => {
  renderCalculator();

  pressKey('0');
  pressKey('.');
  pressKey('5');
  pressKey('/');
  pressKey('(');
  pressKey('2');
  pressKey(')');
  pressKey('Enter');

  expect(currentValue()).toBe('0.25');
});

test('closing parenthesis button is ignored when nothing is open to close', () => {
  renderCalculator();

  clickButton('5');
  clickButton(')');

  expect(currentValue()).toBe('5');
});

test('keyboard input builds and evaluates an expression, including parentheses', () => {
  renderCalculator();

  pressKey('(');
  pressKey('2');
  pressKey('+');
  pressKey('3');
  pressKey(')');
  pressKey('*');
  pressKey('4');
  pressKey('Enter');

  expect(currentValue()).toBe('20');
});

test('the Backspace and Escape keys delete and clear like their buttons', () => {
  renderCalculator();

  pressKey('1');
  pressKey('2');
  pressKey('Backspace');
  expect(currentValue()).toBe('1');

  pressKey('Escape');
  expect(currentValue()).toBe('0');
});

test('a nested, incomplete parenthesis stays editable and shows a clear error only on calculate', () => {
  renderCalculator();

  clickButton('(');
  clickButton('1');
  clickButton('+');
  clickButton('(');
  clickButton('2');
  clickButton('×');
  clickButton('3');

  expect(currentValue()).toBe('(1 + (2 × 3');
  expect(errorText()).toBe('');

  clickButton('=');
  expect(errorText()).not.toBe('');
});

test('the mode toggle exposes its selected state and preserves the current expression', () => {
  renderCalculator();

  const basic = Array.from(container.querySelectorAll('button')).find(
    (button) => button.textContent === 'Basic',
  );
  const scientific = Array.from(container.querySelectorAll('button')).find(
    (button) => button.textContent === 'Scientific',
  );

  expect(basic.getAttribute('aria-pressed')).toBe('true');
  expect(scientific.getAttribute('aria-pressed')).toBe('false');
  expect(() => clickButton('x²')).toThrow('No button found');
  expect(() => clickButton('log')).toThrow('No button found');
  expect(() => clickButton('ln')).toThrow('No button found');

  clickButton('2');
  clickButton('Scientific');

  expect(basic.getAttribute('aria-pressed')).toBe('false');
  expect(scientific.getAttribute('aria-pressed')).toBe('true');
  expect(currentValue()).toBe('2');
  clickButton('x²');
  clickButton('=');
  expect(currentValue()).toBe('4');

  clickButton('AC');
  clickButton('2');
  clickButton('xʸ');
  clickButton('3');
  clickButton('=');
  expect(currentValue()).toBe('8');

  clickButton('Basic');
  expect(currentValue()).toBe('8');
  expect(() => clickButton('x²')).toThrow('No button found');
});

test('scientific power and root controls use the shared expression and error recovery flow', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('√');
  clickButton('9');
  clickButton('=');
  expect(currentValue()).toBe('3');
  expect(previousExpression()).toBe('√9');

  clickButton('AC');
  clickButton('2');
  clickButton('ⁿ√');
  clickButton('−');
  clickButton('9');
  clickButton('=');
  expect(errorText()).not.toBe('');
  expect(currentValue()).toBe('2√−9');

  clickButton('⌫');
  clickButton('⌫');
  clickButton('4');
  clickButton('=');
  expect(errorText()).toBe('');
  expect(currentValue()).toBe('2');
});

test('log and ln controls insert editable function expressions', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('log');
  expect(currentValue()).toBe('log(');

  clickButton('AC');
  clickButton('ln');
  expect(currentValue()).toBe('ln(');
});

test('sine control inserts an editable function expression', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('sin');

  expect(currentValue()).toBe('sin(');
});

test('cosine control inserts an editable function expression', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('cos');

  expect(currentValue()).toBe('cos(');
});

test('tangent control inserts an editable function expression', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('tan');

  expect(currentValue()).toBe('tan(');
});

test('tangent error remains editable and recovers through the shared expression flow', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('tan');
  for (const character of '1.5707963267948966') {
    clickButton(character);
  }
  clickButton(')');
  clickButton('=');

  expect(errorText()).toBe('Tangent is undefined for this angle.');
  clickButton('⌫');
  for (let index = 0; index < 5; index += 1) {
    clickButton('⌫');
  }
  clickButton(')');
  clickButton('=');

  expect(errorText()).toBe('');
});

test('sine control evaluates through the shared expression flow', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('sin');
  clickButton('0');
  clickButton(')');
  clickButton('=');

  expect(currentValue()).toBe('0');
});

test('scientific controls support a square-root exponent', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('2');
  clickButton('xʸ');
  clickButton('√');
  clickButton('9');
  clickButton('=');

  expect(currentValue()).toBe('8');
});

test('log and ln buttons insert inline expression functions and are hidden in Basic mode', () => {
  renderCalculator();

  expect(() => clickButton('log')).toThrow('No button found');
  expect(() => clickButton('ln')).toThrow('No button found');

  clickButton('Scientific');
  clickButton('log');
  clickButton('1');
  clickButton('0');
  clickButton('0');
  clickButton(')');
  clickButton('+');
  clickButton('5');
  clickButton('=');

  expect(currentValue()).toBe('7');
  expect(previousExpression()).toBe('log(100) + 5');

  clickButton('AC');
  clickButton('ln');
  clickButton('1');
  clickButton(')');
  clickButton('=');
  expect(currentValue()).toBe('0');
});

test('absolute value, factorial, and constant buttons are hidden in Basic mode', () => {
  renderCalculator();

  expect(() => clickButton('|x|')).toThrow('No button found');
  expect(() => clickButton('x!')).toThrow('No button found');
  expect(() => clickButton('%')).toThrow('No button found');
  expect(() => clickButton('π')).toThrow('No button found');
  expect(() => clickButton('e')).toThrow('No button found');
});

test('percent divides the preceding operand by 100 using the shared expression flow', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('5');
  clickButton('0');
  clickButton('%');
  clickButton('=');

  expect(currentValue()).toBe('0.5');
  expect(previousExpression()).toBe('50%');
});

test('absolute value wraps a negative operand using the shared expression flow', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('|x|');
  clickButton('−');
  clickButton('5');
  clickButton('|x|');
  clickButton('=');

  expect(currentValue()).toBe('5');
  expect(previousExpression()).toBe('|−5|');
});

test('factorial applies to the preceding operand and combines with power', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('5');
  clickButton('x!');
  clickButton('=');

  expect(currentValue()).toBe('120');
});

test('factorial reports a controlled domain error for a negative operand', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('(');
  clickButton('−');
  clickButton('1');
  clickButton(')');
  clickButton('x!');
  clickButton('=');

  expect(errorText()).not.toBe('');
  expect(currentValue()).toBe('(−1)!');
});

test('pi and e constants evaluate to their known values', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('π');
  clickButton('=');
  expect(currentValue()).toBe('3.14159265359');

  clickButton('AC');
  clickButton('e');
  clickButton('=');
  expect(currentValue()).toBe('2.71828182846');
});

test('log recovers from a domain error by editing the argument in place', () => {
  renderCalculator();

  clickButton('Scientific');
  clickButton('log');
  clickButton('0');
  clickButton(')');
  clickButton('=');
  expect(errorText()).not.toBe('');

  clickButton('⌫');
  clickButton('⌫');
  clickButton('1');
  clickButton('0');
  clickButton(')');
  clickButton('=');

  expect(errorText()).toBe('');
  expect(currentValue()).toBe('1');
});

test('renders angle mode indicator inside display', () => {
  renderCalculator();
  // By default, displays RAD
  const indicator = container.querySelector('.calculator-angle-mode-indicator');
  expect(indicator).not.toBeNull();
  expect(indicator.textContent).toBe('RAD');
});

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

test('toggling angle mode mid-expression does not evaluate or show spurious errors', () => {
  renderCalculator();
  clickButton('Scientific');

  // Type sin( without completing it
  clickButton('sin');
  expect(currentValue()).toBe('sin(');

  // Toggle angle mode
  clickButton('RAD');
  expect(container.querySelector('.calculator-angle-mode-indicator').textContent).toBe('DEG');
  expect(currentValue()).toBe('sin(');
  expect(container.querySelector('.calculator-error').textContent).toBe('');
});

test('toggling angle mode on a complete-but-unsubmitted expression does not auto-evaluate', () => {
  renderCalculator();
  clickButton('Scientific');

  // Type sin(90) but do NOT press equals
  clickButton('sin');
  clickButton('9');
  clickButton('0');
  clickButton(')');
  expect(currentValue()).toBe('sin(90)');

  // Toggle angle mode
  clickButton('RAD');
  expect(container.querySelector('.calculator-angle-mode-indicator').textContent).toBe('DEG');

  // Verify expression is still editable and not evaluated to 1
  expect(currentValue()).toBe('sin(90)');

  // Submit now to verify it evaluates in DEG mode to 1
  clickButton('=');
  expect(currentValue()).toBe('1');
});

test('initial angle mode is loaded from sessionStorage if present', () => {
  sessionStorage.setItem('calcflow_angle_mode', 'deg');
  renderCalculator();

  const indicator = container.querySelector('.calculator-angle-mode-indicator');
  expect(indicator.textContent).toBe('DEG');

  // Clean up
  sessionStorage.removeItem('calcflow_angle_mode');
});

// --- memory operations (CFL-67 / CFL-68) ---

function memoryIndicator() {
  return container.querySelector('.calculator-memory-indicator').textContent;
}

test('memory controls are only available in Scientific mode', () => {
  renderCalculator();

  expect(() => clickButton('M+')).toThrow('No button found');
  expect(() => clickButton('MR')).toThrow('No button found');

  clickButton('Scientific');
  expect(memoryIndicator()).toBe('M: 0');
});

test('M+ stores the evaluated current value and shows it in the indicator', () => {
  renderCalculator();
  clickButton('Scientific');

  clickButton('2');
  clickButton('+');
  clickButton('3');
  clickButton('M+');

  expect(memoryIndicator()).toBe('M: 5');
  // the visible expression is untouched by the memory operation
  expect(currentValue()).toBe('2 + 3');
});

test('M+ then M− accumulate and subtract across calculations', () => {
  renderCalculator();
  clickButton('Scientific');

  clickButton('1');
  clickButton('0');
  clickButton('M+');
  clickButton('AC');
  clickButton('4');
  clickButton('M−');

  expect(memoryIndicator()).toBe('M: 6');
});

test('MR recalls the stored value into the expression for further editing', () => {
  renderCalculator();
  clickButton('Scientific');

  clickButton('7');
  clickButton('M+');
  clickButton('AC');
  clickButton('3');
  clickButton('×');
  clickButton('MR');
  expect(currentValue()).toBe('3 × 7');

  clickButton('=');
  expect(currentValue()).toBe('21');
});

test('MC clears memory and its indicator', () => {
  renderCalculator();
  clickButton('Scientific');

  clickButton('9');
  clickButton('M+');
  expect(memoryIndicator()).toBe('M: 9');

  clickButton('MC');
  expect(memoryIndicator()).toBe('M: 0');
});

test('an error state does not corrupt stored memory', () => {
  renderCalculator();
  clickButton('Scientific');

  clickButton('5');
  clickButton('M+');
  clickButton('AC');

  clickButton('9');
  clickButton('÷');
  clickButton('0');
  clickButton('=');
  expect(errorText()).not.toBe('');

  clickButton('M+');
  expect(memoryIndicator()).toBe('M: 5');
});

test('AC does not erase memory', () => {
  renderCalculator();
  clickButton('Scientific');

  clickButton('6');
  clickButton('M+');
  clickButton('AC');

  expect(currentValue()).toBe('0');
  expect(memoryIndicator()).toBe('M: 6');
});

test('memory persists across a fresh Calculator mount via sessionStorage', () => {
  renderCalculator();
  clickButton('Scientific');
  clickButton('8');
  clickButton('M+');

  act(() => {
    root.unmount();
  });
  container.remove();

  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root.render(<Calculator />);
  });

  clickButton('Scientific');
  expect(memoryIndicator()).toBe('M: 8');
});
