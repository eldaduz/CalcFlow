/**
 * Additional scientific operations (CFL-21): absolute value and factorial.
 *
 * Pure, side-effect-free, dependency-free functions -- deliberately
 * self-contained (no imports from arithmetic.js, logarithm.js, or
 * evaluateExpression.js), matching the pattern already established by
 * those modules. Returns raw JS results; rounding for display is a
 * UI-layer concern, not this module's.
 *
 * Percentage is intentionally excluded here pending Eldad's answer on
 * percent semantics (CFL-63).
 */

export class ScientificOperationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ScientificOperationError';
    this.code = code;
  }
}

const MAX_FACTORIAL_INPUT = 170;

function assertFiniteNumber(value, label) {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new ScientificOperationError(`${label} must be a finite number`, 'INVALID_OPERAND');
  }
}

export function factorial(n) {
  assertFiniteNumber(n, 'Value');

  if (!Number.isInteger(n) || n < 0) {
    throw new ScientificOperationError(
      'Factorial is only defined for non-negative integers',
      'FACTORIAL_DOMAIN_ERROR',
    );
  }

  if (n > MAX_FACTORIAL_INPUT) {
    throw new ScientificOperationError(
      `Factorial is only supported up to ${MAX_FACTORIAL_INPUT}!`,
      'FACTORIAL_LIMIT_EXCEEDED',
    );
  }

  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }
  return result;
}

export function absoluteValue(x) {
  assertFiniteNumber(x, 'Value');
  return Math.abs(x);
}
