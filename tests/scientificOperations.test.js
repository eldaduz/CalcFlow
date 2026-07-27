import { expect, test } from 'vitest';

import {
  ScientificOperationError,
  absoluteValue,
  factorial,
} from '../src/lib/scientificOperations.js';

// --- factorial: normal values ---

test('factorial of small integers matches known values', () => {
  expect(factorial(1)).toBe(1);
  expect(factorial(5)).toBe(120);
  expect(factorial(10)).toBe(3628800);
});

test('factorial of zero is one', () => {
  expect(factorial(0)).toBe(1);
});

// --- factorial: boundary values ---

test('factorial supports the largest input that stays finite', () => {
  expect(Number.isFinite(factorial(170))).toBe(true);
  expect(factorial(170)).toBe(7.257415615307994e306);
});

test('factorial rejects an input past the documented practical limit with a controlled error', () => {
  expect(() => factorial(171)).toThrow(ScientificOperationError);
  try {
    factorial(171);
  } catch (error) {
    expect(error.code).toBe('FACTORIAL_LIMIT_EXCEEDED');
  }
});

// --- factorial: invalid domain ---

test('factorial of a negative number throws a controlled domain error', () => {
  expect(() => factorial(-1)).toThrow(ScientificOperationError);
  try {
    factorial(-1);
  } catch (error) {
    expect(error.code).toBe('FACTORIAL_DOMAIN_ERROR');
  }
});

test('factorial of a non-integer throws a controlled domain error', () => {
  expect(() => factorial(2.5)).toThrow(ScientificOperationError);
  try {
    factorial(2.5);
  } catch (error) {
    expect(error.code).toBe('FACTORIAL_DOMAIN_ERROR');
  }
});

test('factorial rejects non-numeric or non-finite operands instead of coercing them', () => {
  expect(() => factorial('5')).toThrow(ScientificOperationError);
  expect(() => factorial(NaN)).toThrow(ScientificOperationError);
  expect(() => factorial(Infinity)).toThrow(ScientificOperationError);
  try {
    factorial(NaN);
  } catch (error) {
    expect(error.code).toBe('INVALID_OPERAND');
  }
});

// --- absoluteValue ---

test('absoluteValue returns the non-negative magnitude', () => {
  expect(absoluteValue(5)).toBe(5);
  expect(absoluteValue(-5)).toBe(5);
  expect(absoluteValue(0)).toBe(0);
  expect(absoluteValue(-3.5)).toBe(3.5);
});

test('absoluteValue rejects non-numeric or non-finite operands instead of coercing them', () => {
  expect(() => absoluteValue('5')).toThrow(ScientificOperationError);
  expect(() => absoluteValue(NaN)).toThrow(ScientificOperationError);
  expect(() => absoluteValue(Infinity)).toThrow(ScientificOperationError);
  try {
    absoluteValue(NaN);
  } catch (error) {
    expect(error.code).toBe('INVALID_OPERAND');
  }
});
