import { expect, test } from 'vitest';

import {
  ArithmeticError,
  add,
  applyOperation,
  divide,
  multiply,
  subtract,
} from '../src/lib/arithmetic.js';

// --- addition ---

test('adds two positive integers', () => {
  expect(add(2, 3)).toBe(5);
});

test('adds negative and positive numbers', () => {
  expect(add(-5, 3)).toBe(-2);
});

test('adds decimals, preserving the actual JavaScript arithmetic result', () => {
  // Intentionally not rounded: this module returns raw JS arithmetic.
  // 0.1 + 0.2 is not exactly 0.3 in IEEE-754 -- display rounding, if any,
  // is a UI-feature concern, not this module's.
  expect(add(0.1, 0.2)).toBe(0.1 + 0.2);
  expect(add(0.1, 0.2)).toBeCloseTo(0.3, 10);
});

// --- subtraction ---

test('subtracts two positive integers', () => {
  expect(subtract(10, 4)).toBe(6);
});

test('subtracts producing a negative result', () => {
  expect(subtract(2, 5)).toBe(-3);
});

test('subtracts decimals, preserving the actual JavaScript arithmetic result', () => {
  expect(subtract(1, 0.9)).toBe(1 - 0.9);
  expect(subtract(1, 0.9)).toBeCloseTo(0.1, 10);
});

// --- multiplication ---

test('multiplies two positive integers', () => {
  expect(multiply(4, 5)).toBe(20);
});

test('multiplies by zero', () => {
  expect(multiply(123.456, 0)).toBe(0);
});

test('multiplies negative numbers', () => {
  expect(multiply(-3, -4)).toBe(12);
});

test('multiplies decimals, preserving the actual JavaScript arithmetic result', () => {
  expect(multiply(0.1, 3)).toBe(0.1 * 3);
  expect(multiply(0.1, 3)).toBeCloseTo(0.3, 10);
});

// --- division ---

test('divides two positive integers', () => {
  expect(divide(10, 2)).toBe(5);
});

test('divides producing a decimal result', () => {
  expect(divide(1, 4)).toBe(0.25);
});

test('divides negative numbers', () => {
  expect(divide(-9, 3)).toBe(-3);
});

test('dividing a very large finite value by 1 remains finite and unchanged (no false-positive overflow)', () => {
  expect(divide(Number.MAX_VALUE, 1)).toBe(Number.MAX_VALUE);
  expect(Number.isFinite(divide(Number.MAX_VALUE, 1))).toBe(true);
});

test('preserves precision beyond 12 decimal places instead of truncating it', () => {
  // 1/3 has far more than 12 significant decimal digits in IEEE-754.
  // This module must not silently truncate that precision.
  expect(divide(1, 3)).toBe(1 / 3);
  expect(divide(1, 3).toString().replace('0.', '').length).toBeGreaterThan(12);
});

test('division by zero throws a controlled ArithmeticError, not Infinity/NaN', () => {
  expect(() => divide(5, 0)).toThrow(ArithmeticError);
  try {
    divide(5, 0);
  } catch (error) {
    expect(error.code).toBe('DIVIDE_BY_ZERO');
  }
});

test('zero divided by zero is also a controlled error', () => {
  expect(() => divide(0, 0)).toThrow(ArithmeticError);
});

// --- invalid operands ---

test('rejects non-numeric operands instead of using eval-like coercion', () => {
  expect(() => add('2', 3)).toThrow(ArithmeticError);
  expect(() => multiply(NaN, 3)).toThrow(ArithmeticError);
  expect(() => subtract(Infinity, 1)).toThrow(ArithmeticError);
});

// --- operator dispatch (used by CFL-13 UI) ---

test('applyOperation dispatches to the correct operation', () => {
  expect(applyOperation('+', 2, 3)).toBe(5);
  expect(applyOperation('-', 5, 2)).toBe(3);
  expect(applyOperation('*', 4, 2)).toBe(8);
  expect(applyOperation('/', 10, 5)).toBe(2);
});

test('applyOperation rejects an unsupported operator', () => {
  expect(() => applyOperation('%', 5, 2)).toThrow(ArithmeticError);
});

// --- overflow ---

test('multiplication overflow throws a controlled OVERFLOW error instead of returning Infinity', () => {
  expect(() => multiply(Number.MAX_VALUE, 2)).toThrow(ArithmeticError);
  try {
    multiply(Number.MAX_VALUE, 2);
  } catch (error) {
    expect(error.code).toBe('OVERFLOW');
  }
});
