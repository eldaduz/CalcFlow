import { expect, test } from 'vitest';

import { evaluateExpression } from '../src/calculator/expression/evaluateExpression.js';

test('evaluates multiplication before addition', () => {
  expect(evaluateExpression('2 + 3 * 4')).toEqual({ ok: true, value: 14 });
});

test('evaluates subtraction from left to right', () => {
  expect(evaluateExpression('10 - 3 - 2')).toEqual({ ok: true, value: 5 });
});

test('evaluates division from left to right', () => {
  expect(evaluateExpression('24 / 3 / 2')).toEqual({ ok: true, value: 4 });
});

test('lets parentheses override precedence', () => {
  expect(evaluateExpression('(2 + 3) * 4')).toEqual({ ok: true, value: 20 });
});

test('evaluates nested parentheses', () => {
  expect(evaluateExpression('2 * (3 + (4 * 5))')).toEqual({
    ok: true,
    value: 46,
  });
});

test('evaluates decimal numbers', () => {
  expect(evaluateExpression('.5 * 8')).toEqual({ ok: true, value: 4 });
});

test('evaluates a unary negative operand', () => {
  expect(evaluateExpression('4 * -2')).toEqual({ ok: true, value: -8 });
});

test('evaluates a unary positive operand', () => {
  expect(evaluateExpression('4 * +2')).toEqual({ ok: true, value: 8 });
});

test('evaluates powers', () => {
  expect(evaluateExpression('2^3')).toEqual({ ok: true, value: 8 });
});

test('evaluates powers from right to left', () => {
  expect(evaluateExpression('2^3^2')).toEqual({ ok: true, value: 512 });
});

test('evaluates a parenthesized negative base raised to a power', () => {
  expect(evaluateExpression('(-2)^3')).toEqual({ ok: true, value: -8 });
});

test('evaluates decimal, zero, and negative exponents', () => {
  expect(evaluateExpression('9^0.5')).toEqual({ ok: true, value: 3 });
  expect(evaluateExpression('5^0')).toEqual({ ok: true, value: 1 });
  expect(evaluateExpression('2^-2')).toEqual({ ok: true, value: 0.25 });
});

test('evaluates square and nth roots', () => {
  expect(evaluateExpression('√9')).toEqual({ ok: true, value: 3 });
  expect(evaluateExpression('3√8')).toEqual({ ok: true, value: 2 });
  expect(evaluateExpression('3√-8')).toEqual({ ok: true, value: -2 });
  expect(evaluateExpression('2.5√32')).toEqual({ ok: true, value: 4 });
});

test('returns controlled errors for roots outside the real domain', () => {
  expect(evaluateExpression('2√-9')).toEqual({
    ok: false,
    error: {
      code: 'ROOT_DOMAIN_ERROR',
      message: 'This root is undefined in the real numbers.',
    },
  });
  expect(evaluateExpression('0√9')).toEqual({
    ok: false,
    error: {
      code: 'ROOT_DOMAIN_ERROR',
      message: 'This root is undefined in the real numbers.',
    },
  });
  expect(evaluateExpression('2.5√-32')).toEqual({
    ok: false,
    error: {
      code: 'ROOT_DOMAIN_ERROR',
      message: 'This root is undefined in the real numbers.',
    },
  });
});

test('returns a controlled error for zero to the zero power', () => {
  expect(evaluateExpression('0^0')).toEqual({
    ok: false,
    error: {
      code: 'POWER_DOMAIN_ERROR',
      message: 'This power is undefined in the real numbers.',
    },
  });
});

test('returns a controlled error for zero to a negative power', () => {
  expect(evaluateExpression('0^-1')).toEqual({
    ok: false,
    error: {
      code: 'POWER_DOMAIN_ERROR',
      message: 'This power is undefined in the real numbers.',
    },
  });
});

test('returns a controlled error for empty input', () => {
  expect(evaluateExpression('   ')).toEqual({
    ok: false,
    error: { code: 'EMPTY_EXPRESSION', message: 'Enter an expression.' },
  });
});

test('returns a controlled error for a non-string source', () => {
  expect(evaluateExpression(null)).toEqual({
    ok: false,
    error: {
      code: 'INVALID_EXPRESSION',
      message: 'Check the expression and try again.',
    },
  });
});

test('returns a controlled error for division by zero', () => {
  expect(evaluateExpression('1 / 0')).toEqual({
    ok: false,
    error: { code: 'DIVISION_BY_ZERO', message: 'Cannot divide by zero.' },
  });
});

test('returns a controlled error for an invalid character', () => {
  expect(evaluateExpression('2 + apples')).toEqual({
    ok: false,
    error: {
      code: 'INVALID_CHARACTER',
      message: 'Use only numbers and calculator operators.',
    },
  });
});

test('returns a controlled error for unbalanced parentheses', () => {
  expect(evaluateExpression('(2 + 3')).toEqual({
    ok: false,
    error: {
      code: 'UNMATCHED_PARENTHESIS',
      message: 'Check the parentheses in the expression.',
    },
  });
});

test('returns a controlled error for an incomplete expression', () => {
  expect(evaluateExpression('2 +')).toEqual({
    ok: false,
    error: {
      code: 'INVALID_EXPRESSION',
      message: 'Check the expression and try again.',
    },
  });
});

test('returns a controlled error for a malformed decimal', () => {
  expect(evaluateExpression('1..2')).toEqual({
    ok: false,
    error: {
      code: 'INVALID_EXPRESSION',
      message: 'Check the expression and try again.',
    },
  });
});

test('returns a controlled error for an extra closing parenthesis', () => {
  expect(evaluateExpression('2 + 3)')).toEqual({
    ok: false,
    error: {
      code: 'UNMATCHED_PARENTHESIS',
      message: 'Check the parentheses in the expression.',
    },
  });
});

test('returns a controlled error for implicit multiplication', () => {
  expect(evaluateExpression('2(3)')).toEqual({
    ok: false,
    error: {
      code: 'INVALID_EXPRESSION',
      message: 'Check the expression and try again.',
    },
  });
});

test('returns a controlled error for an expression longer than 512 characters', () => {
  expect(evaluateExpression('1'.repeat(513))).toEqual({
    ok: false,
    error: {
      code: 'EXPRESSION_TOO_LONG',
      message: 'The expression is too long.',
    },
  });
});

test('returns a controlled error for nesting deeper than 32 levels', () => {
  const expression = `${'('.repeat(33)}1${')'.repeat(33)}`;

  expect(evaluateExpression(expression)).toEqual({
    ok: false,
    error: {
      code: 'NESTING_LIMIT_EXCEEDED',
      message: 'The expression is nested too deeply.',
    },
  });
});

test('evaluates an expression nested exactly 32 levels deep', () => {
  const expression = `${'('.repeat(32)}1${')'.repeat(32)}`;

  expect(evaluateExpression(expression)).toEqual({ ok: true, value: 1 });
});

test('returns a controlled error for a non-finite result', () => {
  const largeNumber = '9'.repeat(200);

  expect(evaluateExpression(`${largeNumber} * ${largeNumber}`)).toEqual({
    ok: false,
    error: {
      code: 'NON_FINITE_RESULT',
      message: 'The result is outside the supported range.',
    },
  });
});
