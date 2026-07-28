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

test('evaluates sine in degree mode', () => {
  expect(evaluateExpression('sin(90)', { angleMode: 'deg' })).toEqual({ ok: true, value: 1 });
});

test('evaluates cosine in degree mode', () => {
  expect(evaluateExpression('cos(180)', { angleMode: 'deg' })).toEqual({ ok: true, value: -1 });
});

test('normalizes cosine of a right angle to zero', () => {
  expect(evaluateExpression('cos(90)', { angleMode: 'deg' })).toEqual({ ok: true, value: 0 });
});

test('evaluates tangent in degree mode', () => {
  expect(evaluateExpression('tan(45)', { angleMode: 'deg' })).toEqual({ ok: true, value: 1 });
});

test('returns a controlled error for tangent of a right angle', () => {
  expect(evaluateExpression('tan(90)', { angleMode: 'deg' })).toEqual({
    ok: false,
    error: {
      code: 'TANGENT_UNDEFINED',
      message: 'Tangent is undefined for this angle.',
    },
  });
});

test('treats angles within tangent tolerance of a right angle as undefined', () => {
  expect(evaluateExpression('tan(90.00000000001)', { angleMode: 'deg' })).toEqual({
    ok: false,
    error: {
      code: 'TANGENT_UNDEFINED',
      message: 'Tangent is undefined for this angle.',
    },
  });
});

test('defaults trigonometry to radians for decimal values', () => {
  expect(evaluateExpression('sin(0.5)')).toEqual({ ok: true, value: 0.479425538604203 });
});

test('evaluates trigonometric functions inside expressions', () => {
  expect(evaluateExpression('2 + sin(90) + cos(180)', { angleMode: 'deg' })).toEqual({
    ok: true,
    value: 2,
  });
});

test('evaluates trigonometric and logarithmic functions together', () => {
  expect(evaluateExpression('log(100) + sin(90)', { angleMode: 'deg' })).toEqual({
    ok: true,
    value: 3,
  });
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

test('returns a power-domain error for a negative base with a fractional exponent', () => {
  expect(evaluateExpression('(-4)^0.5')).toEqual({
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
  expect(evaluateExpression('2 @ 3')).toEqual({
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

test('evaluates log and ln as inline expression functions', () => {
  expect(evaluateExpression('log(100)')).toEqual({ ok: true, value: 2 });
  expect(evaluateExpression('log(100)+5')).toEqual({ ok: true, value: 7 });
  expect(evaluateExpression('ln(1)')).toEqual({ ok: true, value: 0 });
});

test('evaluates nested and combined log/ln expressions', () => {
  const nested = evaluateExpression('log(log(100))');
  expect(nested.ok).toBe(true);
  expect(nested.value).toBeCloseTo(Math.log10(2), 12);

  expect(evaluateExpression('log(100)^2')).toEqual({ ok: true, value: 4 });
  expect(evaluateExpression('2^log(100)')).toEqual({ ok: true, value: 4 });
});

test('returns a controlled domain error for log and ln of non-positive values', () => {
  const expectedError = {
    ok: false,
    error: {
      code: 'LOG_DOMAIN_ERROR',
      message: 'Logarithm is only defined for positive numbers.',
    },
  };

  expect(evaluateExpression('log(-1)')).toEqual(expectedError);
  expect(evaluateExpression('log(0)')).toEqual(expectedError);
  expect(evaluateExpression('ln(-5)')).toEqual(expectedError);
});

test('returns a controlled error for a non-finite log argument', () => {
  const largeNumber = '9'.repeat(400);

  expect(evaluateExpression(`log(${largeNumber})`)).toEqual({
    ok: false,
    error: {
      code: 'NON_FINITE_RESULT',
      message: 'The result is outside the supported range.',
    },
  });
});

test('returns controlled errors for malformed log/ln syntax', () => {
  expect(evaluateExpression('log(')).toEqual({
    ok: false,
    error: {
      code: 'INVALID_EXPRESSION',
      message: 'Check the expression and try again.',
    },
  });
  expect(evaluateExpression('log)')).toEqual({
    ok: false,
    error: {
      code: 'INVALID_EXPRESSION',
      message: 'Check the expression and try again.',
    },
  });
  expect(evaluateExpression('log 5')).toEqual({
    ok: false,
    error: {
      code: 'INVALID_EXPRESSION',
      message: 'Check the expression and try again.',
    },
  });
  expect(evaluateExpression('log()')).toEqual({
    ok: false,
    error: {
      code: 'UNMATCHED_PARENTHESIS',
      message: 'Check the parentheses in the expression.',
    },
  });
  expect(evaluateExpression('log(5')).toEqual({
    ok: false,
    error: {
      code: 'UNMATCHED_PARENTHESIS',
      message: 'Check the parentheses in the expression.',
    },
  });
});

test('log/ln function-call parentheses share the expression nesting limit', () => {
  const nested = `${'log('.repeat(33)}1${')'.repeat(33)}`;

  expect(evaluateExpression(nested)).toEqual({
    ok: false,
    error: {
      code: 'NESTING_LIMIT_EXCEEDED',
      message: 'The expression is nested too deeply.',
    },
  });
});

test('still rejects unsupported identifiers as invalid characters', () => {
  expect(evaluateExpression('sinh(1)')).toEqual({
    ok: false,
    error: {
      code: 'INVALID_CHARACTER',
      message: 'Use only numbers and calculator operators.',
    },
  });
});

test('evaluates absolute value, including a nested case', () => {
  expect(evaluateExpression('|5|')).toEqual({ ok: true, value: 5 });
  expect(evaluateExpression('|-5|')).toEqual({ ok: true, value: 5 });
  expect(evaluateExpression('|3-8|')).toEqual({ ok: true, value: 5 });
  expect(evaluateExpression('|1-|2-5||')).toEqual({ ok: true, value: 2 });
});

test('absolute-value bars share the expression nesting limit', () => {
  const nested = `${'|'.repeat(33)}1${'|'.repeat(33)}`;

  expect(evaluateExpression(nested)).toEqual({
    ok: false,
    error: {
      code: 'NESTING_LIMIT_EXCEEDED',
      message: 'The expression is nested too deeply.',
    },
  });
});

test('returns a controlled error for an unclosed absolute-value bar', () => {
  expect(evaluateExpression('|3')).toEqual({
    ok: false,
    error: {
      code: 'UNMATCHED_PARENTHESIS',
      message: 'Check the parentheses in the expression.',
    },
  });
});

test('evaluates factorial, including combined with power', () => {
  expect(evaluateExpression('5!')).toEqual({ ok: true, value: 120 });
  expect(evaluateExpression('0!')).toEqual({ ok: true, value: 1 });
  expect(evaluateExpression('2^3!')).toEqual({ ok: true, value: 64 });
});

test('returns a controlled domain error for negative or fractional factorial', () => {
  const expectedError = {
    ok: false,
    error: {
      code: 'FACTORIAL_DOMAIN_ERROR',
      message: 'Factorial is only defined for non-negative integers.',
    },
  };

  expect(evaluateExpression('(-1)!')).toEqual(expectedError);
  expect(evaluateExpression('2.5!')).toEqual(expectedError);
});

test('returns a controlled error for a factorial past the practical limit', () => {
  expect(evaluateExpression('171!')).toEqual({
    ok: false,
    error: {
      code: 'FACTORIAL_LIMIT_EXCEEDED',
      message: 'Factorial is only supported up to 170!.',
    },
  });
});

test('evaluates the pi and e constants in expressions', () => {
  expect(evaluateExpression('π')).toEqual({ ok: true, value: Math.PI });
  expect(evaluateExpression('e')).toEqual({ ok: true, value: Math.E });
  expect(evaluateExpression('2*π')).toEqual({ ok: true, value: 2 * Math.PI });
  const sum = evaluateExpression('π+e');
  expect(sum.ok).toBe(true);
  expect(sum.value).toBeCloseTo(Math.PI + Math.E, 12);
});
