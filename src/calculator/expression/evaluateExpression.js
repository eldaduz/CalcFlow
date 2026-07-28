import { ln, log10, LogarithmError } from '../../lib/logarithm.js';
import {
  ScientificOperationError,
  absoluteValue,
  factorial,
} from '../../lib/scientificOperations.js';

const errorMessages = {
  DIVISION_BY_ZERO: 'Cannot divide by zero.',
  EMPTY_EXPRESSION: 'Enter an expression.',
  EXPRESSION_TOO_LONG: 'The expression is too long.',
  FACTORIAL_DOMAIN_ERROR: 'Factorial is only defined for non-negative integers.',
  FACTORIAL_LIMIT_EXCEEDED: 'Factorial is only supported up to 170!.',
  INVALID_CHARACTER: 'Use only numbers and calculator operators.',
  INVALID_EXPRESSION: 'Check the expression and try again.',
  LOG_DOMAIN_ERROR: 'Logarithm is only defined for positive numbers.',
  NESTING_LIMIT_EXCEEDED: 'The expression is nested too deeply.',
  NON_FINITE_RESULT: 'The result is outside the supported range.',
  POWER_DOMAIN_ERROR: 'This power is undefined in the real numbers.',
  ROOT_DOMAIN_ERROR: 'This root is undefined in the real numbers.',
  TANGENT_UNDEFINED: 'Tangent is undefined for this angle.',
  UNMATCHED_PARENTHESIS: 'Check the parentheses in the expression.',
};

const functionsByName = { log: log10, ln };
const constantsByName = { e: Math.E };
const maximumExpressionLength = 512;
const maximumNestingDepth = 32;
const trigonometricTolerance = 1e-12;

class ExpressionError extends Error {
  constructor(code) {
    super(errorMessages[code]);
    this.code = code;
  }
}

function tokenize(source) {
  const tokens = [];
  let index = 0;

  while (index < source.length) {
    const character = source[index];

    if (/\s/.test(character)) {
      index += 1;
      continue;
    }

    if (/\d|\./.test(character)) {
      const start = index;
      let decimalPoints = 0;

      while (/\d|\./.test(source[index] ?? '')) {
        if (source[index] === '.') {
          decimalPoints += 1;
        }
        index += 1;
      }

      const value = source.slice(start, index);
      if (decimalPoints > 1 || value === '.') {
        throw new ExpressionError('INVALID_EXPRESSION');
      }

      tokens.push({ type: 'number', value: Number(value) });
      continue;
    }

    if (character === 'π') {
      tokens.push({ type: 'number', value: Math.PI });
      index += 1;
      continue;
    }

    if ('+-*/^√()!|'.includes(character)) {
      tokens.push({ type: character, value: character });
      index += 1;
      continue;
    }
    if (/[a-z]/i.test(character)) {
      const start = index;
      while (/[a-z]/i.test(source[index] ?? '')) {
        index += 1;
      }

      const name = source.slice(start, index);
      if (Object.hasOwn(functionsByName, name) || ['sin', 'cos', 'tan'].includes(name)) {
        tokens.push({ type: 'function', value: name });
        continue;
      }

      if (Object.hasOwn(constantsByName, name)) {
        tokens.push({ type: 'number', value: constantsByName[name] });
        continue;
      }

      throw new ExpressionError('INVALID_CHARACTER');
    }

    throw new ExpressionError('INVALID_CHARACTER');
  }

  return tokens;
}

function normalizeTrigonometricResult(result) {
  const nearestInteger = Math.round(result);
  return Math.abs(result - nearestInteger) < trigonometricTolerance ? nearestInteger : result;
}

function evaluateFunctionCall(name, value, angleMode) {
  if (Object.hasOwn(functionsByName, name)) {
    try {
      return functionsByName[name](value);
    } catch (error) {
      if (error instanceof LogarithmError) {
        throw new ExpressionError(
          error.code === 'LOG_DOMAIN_ERROR' ? 'LOG_DOMAIN_ERROR' : 'NON_FINITE_RESULT',
        );
      }
      throw error;
    }
  }

  const angle = angleMode === 'deg' ? (value * Math.PI) / 180 : value;

  if (name === 'tan' && Math.abs(Math.cos(angle)) < trigonometricTolerance) {
    throw new ExpressionError('TANGENT_UNDEFINED');
  }

  const result =
    name === 'sin' ? Math.sin(angle) : name === 'cos' ? Math.cos(angle) : Math.tan(angle);
  return normalizeTrigonometricResult(result);
}

function parse(tokens, angleMode) {
  let index = 0;
  let nestingDepth = 0;

  function current() {
    return tokens[index];
  }

  function consume(type) {
    if (current()?.type === type) {
      index += 1;
      return true;
    }
    return false;
  }

  function parseExpression() {
    let value = parseTerm();

    while (current()?.type === '+' || current()?.type === '-') {
      const operator = current().type;
      index += 1;
      const right = parseTerm();
      value = operator === '+' ? value + right : value - right;
    }

    return value;
  }

  function parseTerm() {
    let value = parseUnary();

    while (current()?.type === '*' || current()?.type === '/') {
      const operator = current().type;
      index += 1;
      const right = parseUnary();

      if (operator === '/' && right === 0) {
        throw new ExpressionError('DIVISION_BY_ZERO');
      }

      value = operator === '*' ? value * right : value / right;
    }

    return value;
  }

  function parseUnary() {
    if (consume('-')) {
      return -parseUnary();
    }

    if (consume('+')) {
      return parseUnary();
    }

    return parsePower();
  }

  function parsePower() {
    const left = parsePostfix();
    if (consume('^')) {
      const right = parseUnary();
      if (left === 0 && right <= 0) {
        throw new ExpressionError('POWER_DOMAIN_ERROR');
      }

      const result = left ** right;
      if (Number.isNaN(result)) {
        throw new ExpressionError('POWER_DOMAIN_ERROR');
      }

      return result;
    }

    if (consume('√')) {
      return evaluateRoot(left, parseUnary());
    }

    return left;
  }

  function parsePostfix() {
    let value = parsePrimary();

    while (current()?.type === '!') {
      index += 1;
      try {
        value = factorial(value);
      } catch (error) {
        if (error instanceof ScientificOperationError) {
          throw new ExpressionError(
            error.code === 'FACTORIAL_LIMIT_EXCEEDED'
              ? 'FACTORIAL_LIMIT_EXCEEDED'
              : 'FACTORIAL_DOMAIN_ERROR',
          );
        }
        throw error;
      }
    }

    return value;
  }

  function parseFunctionCall(name) {
    if (!consume('(')) {
      throw new ExpressionError('INVALID_EXPRESSION');
    }

    nestingDepth += 1;
    if (nestingDepth > maximumNestingDepth) {
      throw new ExpressionError('NESTING_LIMIT_EXCEEDED');
    }

    const argument = parseExpression();
    if (!consume(')')) {
      throw new ExpressionError('UNMATCHED_PARENTHESIS');
    }
    nestingDepth -= 1;

    return evaluateFunctionCall(name, argument, angleMode);
  }
  function parsePrimary() {
    if (consume('√')) {
      return evaluateRoot(2, parseUnary());
    }

    if (current()?.type === 'number') {
      const value = current().value;
      index += 1;
      return value;
    }

    if (current()?.type === 'function') {
      const functionName = current().value;
      index += 1;
      return parseFunctionCall(functionName);
    }

    if (consume('(')) {
      nestingDepth += 1;
      if (nestingDepth > maximumNestingDepth) {
        throw new ExpressionError('NESTING_LIMIT_EXCEEDED');
      }

      const value = parseExpression();
      if (!consume(')')) {
        throw new ExpressionError('UNMATCHED_PARENTHESIS');
      }
      nestingDepth -= 1;
      return value;
    }

    if (consume('|')) {
      nestingDepth += 1;
      if (nestingDepth > maximumNestingDepth) {
        throw new ExpressionError('NESTING_LIMIT_EXCEEDED');
      }

      const value = parseExpression();
      if (!consume('|')) {
        throw new ExpressionError('UNMATCHED_PARENTHESIS');
      }
      nestingDepth -= 1;
      return absoluteValue(value);
    }

    if (current()?.type === ')') {
      throw new ExpressionError('UNMATCHED_PARENTHESIS');
    }

    throw new ExpressionError('INVALID_EXPRESSION');
  }

  const value = parseExpression();

  if (current()?.type === ')') {
    throw new ExpressionError('UNMATCHED_PARENTHESIS');
  }

  if (current()) {
    throw new ExpressionError('INVALID_EXPRESSION');
  }

  return value;
}

function evaluateRoot(degree, radicand) {
  if (degree === 0) {
    throw new ExpressionError('ROOT_DOMAIN_ERROR');
  }

  if (radicand < 0) {
    if (!Number.isInteger(degree) || Math.abs(degree) % 2 === 0) {
      throw new ExpressionError('ROOT_DOMAIN_ERROR');
    }
    return -((-radicand) ** (1 / degree));
  }

  return radicand ** (1 / degree);
}

export function evaluateExpression(source, options = {}) {
  if (typeof source !== 'string') {
    return {
      ok: false,
      error: {
        code: 'INVALID_EXPRESSION',
        message: errorMessages.INVALID_EXPRESSION,
      },
    };
  }

  if (source.length > maximumExpressionLength) {
    return {
      ok: false,
      error: {
        code: 'EXPRESSION_TOO_LONG',
        message: errorMessages.EXPRESSION_TOO_LONG,
      },
    };
  }

  if (source.trim() === '') {
    return {
      ok: false,
      error: {
        code: 'EMPTY_EXPRESSION',
        message: errorMessages.EMPTY_EXPRESSION,
      },
    };
  }

  const angleMode = options?.angleMode === 'deg' ? 'deg' : 'rad';

  try {
    const value = parse(tokenize(source), angleMode);
    if (!Number.isFinite(value)) {
      throw new ExpressionError('NON_FINITE_RESULT');
    }

    return { ok: true, value };
  } catch (error) {
    if (error instanceof ExpressionError || error instanceof LogarithmError) {
      if (error instanceof LogarithmError && error.code === 'INVALID_OPERAND') {
        return {
          ok: false,
          error: {
            code: 'NON_FINITE_RESULT',
            message: errorMessages.NON_FINITE_RESULT,
          },
        };
      }

      return {
        ok: false,
        error: { code: error.code, message: error.message },
      };
    }

    throw error;
  }
}
