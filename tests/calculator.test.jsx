import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, test } from 'vitest';

import Calculator from '../src/components/Calculator.jsx';

let container;
let root;

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
