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

function currentValue() {
  return container.querySelector('.current-value').textContent;
}

function errorText() {
  return container.querySelector('.calculator-error').textContent;
}

test('a full click-through addition flow shows the correct result', () => {
  renderCalculator();

  clickButton('7');
  clickButton('+');
  clickButton('8');
  clickButton('=');

  expect(currentValue()).toBe('15');
});

test('a decimal entry flow shows the correct result', () => {
  renderCalculator();

  clickButton('1');
  clickButton('.');
  clickButton('5');
  clickButton('÷');
  clickButton('2');
  clickButton('=');

  expect(currentValue()).toBe('0.75');
});

test('division by zero displays a controlled error message, not a crash', () => {
  renderCalculator();

  clickButton('9');
  clickButton('÷');
  clickButton('0');
  clickButton('=');

  expect(errorText()).toMatch(/division by zero/i);
});

test('the user recovers from an error by entering a new digit, without reloading', () => {
  renderCalculator();

  clickButton('9');
  clickButton('÷');
  clickButton('0');
  clickButton('=');
  clickButton('4');

  expect(errorText()).toBe('');
  expect(currentValue()).toBe('4');
});

test('AC clears the display back to 0', () => {
  renderCalculator();

  clickButton('3');
  clickButton('+');
  clickButton('4');
  clickButton('AC');

  expect(currentValue()).toBe('0');
});
