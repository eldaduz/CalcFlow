/**
 * Logarithmic functions (CFL-18).
 *
 * Pure, side-effect-free, dependency-free functions for base-10 and
 * natural logarithms -- deliberately self-contained (no imports from
 * arithmetic.js or evaluateExpression.js), matching the pattern already
 * established by those modules. Returns raw JS results; rounding for
 * display is a UI-layer concern, not this module's, same as arithmetic.js.
 *
 * UI/keypad wiring and any expression-grammar integration are out of
 * scope here pending two open questions flagged on CFL-18/CFL-16.
 */

export class LogarithmError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'LogarithmError';
    this.code = code;
  }
}

function assertFiniteNumber(value, label) {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new LogarithmError(`${label} must be a finite number`, 'INVALID_OPERAND');
  }
}

function assertPositiveDomain(value) {
  if (value <= 0) {
    throw new LogarithmError('Logarithm is only defined for positive numbers', 'LOG_DOMAIN_ERROR');
  }
}

export function log10(x) {
  assertFiniteNumber(x, 'Value');
  assertPositiveDomain(x);
  return Math.log10(x);
}

export function ln(x) {
  assertFiniteNumber(x, 'Value');
  assertPositiveDomain(x);
  return Math.log(x);
}
