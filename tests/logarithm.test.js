import { expect, test } from 'vitest';

import { LogarithmError, ln, log10 } from '../src/lib/logarithm.js';

// --- log10: normal values ---

test('log10 of a power of ten returns an exact integer', () => {
  expect(log10(100)).toBe(2);
  expect(log10(10)).toBe(1);
  expect(log10(1000000)).toBe(6);
});

test('log10 of one is zero', () => {
  expect(log10(1)).toBe(0);
});

// --- log10: fractional values ---

test('log10 of a fractional value returns a negative result', () => {
  expect(log10(0.001)).toBe(-3);
});

// --- log10: boundary values ---

test('log10 stays finite for the smallest and largest representable positive numbers', () => {
  expect(log10(Number.MIN_VALUE)).toBeCloseTo(-323.306, 2);
  expect(log10(Number.MAX_VALUE)).toBeCloseTo(308.255, 2);
});

// --- log10: invalid domain ---

test('log10 of zero throws a controlled domain error', () => {
  expect(() => log10(0)).toThrow(LogarithmError);
  try {
    log10(0);
  } catch (error) {
    expect(error.code).toBe('LOG_DOMAIN_ERROR');
  }
});

test('log10 of a negative number throws a controlled domain error', () => {
  expect(() => log10(-5)).toThrow(LogarithmError);
  try {
    log10(-5);
  } catch (error) {
    expect(error.code).toBe('LOG_DOMAIN_ERROR');
  }
});

// --- ln: normal values ---

test('ln of Euler’s number is one', () => {
  expect(ln(Math.E)).toBe(1);
});

test('ln of one is zero', () => {
  expect(ln(1)).toBe(0);
});

test('ln of ten matches the known constant', () => {
  expect(ln(10)).toBeCloseTo(2.302585092994046, 12);
});

// --- ln: fractional values ---

test('ln of a fractional value returns a negative result', () => {
  expect(ln(0.5)).toBeCloseTo(-0.6931471805599453, 12);
});

// --- ln: invalid domain ---

test('ln of zero throws a controlled domain error', () => {
  expect(() => ln(0)).toThrow(LogarithmError);
  try {
    ln(0);
  } catch (error) {
    expect(error.code).toBe('LOG_DOMAIN_ERROR');
  }
});

test('ln of a negative number throws a controlled domain error', () => {
  expect(() => ln(-1)).toThrow(LogarithmError);
  try {
    ln(-1);
  } catch (error) {
    expect(error.code).toBe('LOG_DOMAIN_ERROR');
  }
});

// --- invalid operands (shared behavior) ---

test('rejects non-numeric or non-finite operands instead of coercing them', () => {
  expect(() => log10('100')).toThrow(LogarithmError);
  expect(() => log10(NaN)).toThrow(LogarithmError);
  expect(() => log10(Infinity)).toThrow(LogarithmError);
  expect(() => ln(undefined)).toThrow(LogarithmError);
  expect(() => ln(-Infinity)).toThrow(LogarithmError);
});

test('invalid operands report the INVALID_OPERAND code, distinct from domain errors', () => {
  try {
    log10(NaN);
  } catch (error) {
    expect(error.code).toBe('INVALID_OPERAND');
  }
});
