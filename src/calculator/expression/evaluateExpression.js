const errorMessages = {
  DIVISION_BY_ZERO: 'Cannot divide by zero.',
  EMPTY_EXPRESSION: 'Enter an expression.',
  EXPRESSION_TOO_LONG: 'The expression is too long.',
  INVALID_CHARACTER: 'Use only numbers and calculator operators.',
  INVALID_EXPRESSION: 'Check the expression and try again.',
  NESTING_LIMIT_EXCEEDED: 'The expression is nested too deeply.',
  NON_FINITE_RESULT: 'The result is outside the supported range.',
  UNMATCHED_PARENTHESIS: 'Check the parentheses in the expression.',
};

const maximumExpressionLength = 512;
const maximumNestingDepth = 32;

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

    if ('+-*/()'.includes(character)) {
      tokens.push({ type: character, value: character });
      index += 1;
      continue;
    }

    throw new ExpressionError('INVALID_CHARACTER');
  }

  return tokens;
}

function parse(tokens) {
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

    return parsePrimary();
  }

  function parsePrimary() {
    if (current()?.type === 'number') {
      const value = current().value;
      index += 1;
      return value;
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

export function evaluateExpression(source) {
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

  try {
    const value = parse(tokenize(source));
    if (!Number.isFinite(value)) {
      throw new ExpressionError('NON_FINITE_RESULT');
    }

    return { ok: true, value };
  } catch (error) {
    if (error instanceof ExpressionError) {
      return {
        ok: false,
        error: { code: error.code, message: error.message },
      };
    }

    throw error;
  }
}
