import { expect, test } from 'vitest';

import { ArithmeticError, add, applyOperation, divide, multiply, subtract } from '../src/lib/arithmetic.js';

// --- addition ---

test('adds two positive integers', () => {
  expect(add(2, 3)).toBe(5);
});

test('adds negative and positive numbers', () => {
  expect(add(-5, 3)).toBe(-2);
});

test('adds decimals without floating point noise', () => {
  expect(add(0.1, 0.2)).toBe(0.3);
});

// --- subtraction ---

test('subtracts two positive integers', () => {
  expect(subtract(10, 4)).toBe(6);
});

test('subtracts producing a negative result', () => {
  expect(subtract(2, 5)).toBe(-3);
});

test('subtracts decimals', () => {
  expect(subtract(1, 0.9)).toBe(0.1);
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

test('multiplies decimals without floating point noise', () => {
  expect(multiply(0.1, 3)).toBe(0.3);
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
