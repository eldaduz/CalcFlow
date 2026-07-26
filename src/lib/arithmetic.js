/**
 * Basic arithmetic engine (CFL-12).
 *
 * Pure, side-effect-free functions for the four basic operations.
 * No `eval` or dynamic code execution is used anywhere here.
 *
 * Floating point note: JavaScript's IEEE-754 numbers produce results like
 * 0.1 + 0.2 === 0.30000000000000004. For a calculator, results are rounded
 * to a fixed number of significant decimal places to avoid surfacing this
 * artifact to the user, while still supporting decimals and negative values.
 */

const DECIMAL_PLACES = 12;

/**
 * Thrown when an operation is mathematically undefined (e.g. division by
 * zero). Callers (UI layer) can catch this and show a controlled error
 * instead of letting the app crash or show NaN/Infinity.
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
 * Rounds away IEEE-754 floating point noise without turning the calculator
 * into a fixed-decimal system. Values with more precision than
 * DECIMAL_PLACES are truncated at that precision.
 */
function roundResult(value) {
  if (!Number.isFinite(value)) {
    throw new ArithmeticError('Result is too large to represent', 'OVERFLOW');
  }
  const factor = 10 ** DECIMAL_PLACES;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function add(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  return roundResult(a + b);
}

export function subtract(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  return roundResult(a - b);
}

export function multiply(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  return roundResult(a * b);
}

export function divide(a, b) {
  assertFiniteNumber(a, 'First operand');
  assertFiniteNumber(b, 'Second operand');
  if (b === 0) {
    throw new ArithmeticError('Division by zero is undefined', 'DIVIDE_BY_ZERO');
  }
  return roundResult(a / b);
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
