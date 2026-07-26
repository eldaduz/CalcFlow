/**
 * Basic arithmetic engine (CFL-12).
 *
 * Pure, side-effect-free functions for the four basic operations.
 * No `eval` or dynamic code execution is used anywhere here.
 *
 * This module returns the raw JavaScript arithmetic result for every
 * accepted finite input -- it does not round or truncate precision (e.g.
 * 0.1 + 0.2 stays 0.30000000000000004). CFL-12 requires correct results,
 * not a specific display precision; rounding/formatting for display is a
 * UI-feature concern (CFL-13/CFL-14), not this module's.
 */

/**
 * Thrown when an operation is mathematically undefined (e.g. division by
 * zero) or when a mathematically valid operation overflows the range of
 * representable numbers. Callers (UI layer) can catch this and show a
 * controlled error instead of letting the app crash or show NaN/Infinity.
 */
export class ArithmeticError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ArithmeticError';
    this.code = code;
  }
}

function assertFiniteNumber(value, label) {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new ArithmeticError(`${label} must be a finite number`, 'INVALID_OPERAND');
  }
}

/**
 * Guards against genuine overflow (e.g. multiplying two very large finite
 * numbers past Number.MAX_VALUE) without altering any result that is
 * actually finite. Unlike the previous implementation, this never
 * multiplies the value by a scaling factor, so it cannot itself introduce
 * an overflow for otherwise-valid finite results.
 */
function assertFiniteResult(value) {
  if (!Number.isFinite(value)) {
    throw new ArithmeticError('Result is too large to represent', 'OVERFLOW');
  }
  return value;
}

export function add(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  return assertFiniteResult(a + b);
}

export function subtract(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  return assertFiniteResult(a - b);
}

export function multiply(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  return assertFiniteResult(a * b);
}

export function divide(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  if (b === 0) {
    throw new ArithmeticError('Division by zero is undefined', 'DIVIDE_BY_ZERO');
  }
  return assertFiniteResult(a / b);
}

/**
 * Dispatch table used by the calculator UI (CFL-13) to apply an operator
 * selected by the user without a switch statement or eval.
 */
export const operations = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
};

export function applyOperation(operator, a, b) {
  const operation = operations[operator];
  if (!operation) {
    throw new ArithmeticError(`Unsupported operator: ${operator}`, 'UNSUPPORTED_OPERATOR');
  }
  return operation(a, b);
}
