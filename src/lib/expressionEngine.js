/**
 * Expression input and editing engine (CFL-14 / CFL-51).
 *
 * Unlike CFL-13's two-operand reducer, this builds a growing expression
 * string (digits, operators, parentheses) and defers all correctness of
 * evaluation -- precedence, parentheses, malformed input -- to CFL-16's
 * `evaluateExpression`. This module owns editing, glyph display, and the
 * "expression-state contract": a plain string handed to that evaluator.
 *
 * The expression is stored internally using display glyphs (×, ÷, −) so
 * editing operations (trailing-zero replacement, decimal-token detection,
 * paren counting, sign toggling) work directly on what's shown. Spacing
 * around binary operators is added only at render time by
 * `formatExpressionForDisplay`, not during editing.
 */

import { evaluateExpression } from '../calculator/expression/evaluateExpression.js';

export const initialState = {
  expression: '',
  previousExpression: '',
  justEvaluated: false,
  error: null,
};

const OPERATOR_GLYPHS = { '+': '+', '-': '−', '*': '×', '/': '÷' };
const GLYPH_TO_ASCII = { '−': '-', '×': '*', '÷': '/' };

function toAsciiExpression(expression) {
  return expression.replace(/[−×÷]/g, (glyph) => GLYPH_TO_ASCII[glyph]);
}

/**
 * Spaces are inserted only around a glyph used as a binary operator (one
 * immediately preceded by a digit, decimal point, or closing parenthesis).
 * A unary sign -- preceded by another operator, "(", or the start of the
 * expression -- stays tight against its operand (e.g. "2 × −5", not
 * "2 × − 5").
 */
export function formatExpressionForDisplay(expression) {
  return expression.replace(/([)\d.])([+−×÷])/g, '$1 $2 ');
}

function currentNumberToken(expression) {
  return expression.match(/[\d.]*$/)[0];
}

function appendDigit(expression, digit) {
  if (/(^|[^\d.])0$/.test(expression)) {
    return expression.slice(0, -1) + digit;
  }
  return expression + digit;
}

function appendDecimal(expression) {
  const token = currentNumberToken(expression);
  if (token.includes('.')) {
    return expression;
  }
  return token === '' ? `${expression}0.` : `${expression}.`;
}

function appendOperator(expression, operator) {
  const glyph = OPERATOR_GLYPHS[operator];
  const isMultiplyOrDivide = operator === '*' || operator === '/';
  const hasNoPrecedingOperand = expression === '' || expression.endsWith('(');
  if (isMultiplyOrDivide && hasNoPrecedingOperand) {
    return expression;
  }
  return expression + glyph;
}

function appendOpenParen(expression) {
  return `${expression}(`;
}

function appendCloseParen(expression) {
  const openCount = (expression.match(/\(/g) || []).length;
  const closeCount = (expression.match(/\)/g) || []).length;
  if (closeCount >= openCount) {
    return expression;
  }
  return `${expression})`;
}

function deleteLastCharacter(expression) {
  return expression.slice(0, -1);
}

/**
 * Toggles the sign of the trailing number. Distinguishes a unary minus
 * (preceded by another operator, "(", or nothing) from a binary minus
 * (preceded by a digit or ")"): removing the former flips the number's
 * sign, but the latter is a real subtraction operator that must be kept,
 * so a new unary minus is inserted after it instead of eating it.
 */
function toggleTrailingSign(expression) {
  const numberMatch = expression.match(/(\d+\.?\d*|\.\d+)$/);
  if (!numberMatch) {
    return expression;
  }

  const numberStart = expression.length - numberMatch[0].length;
  const before = expression.slice(0, numberStart);
  const number = numberMatch[0];

  if (before.endsWith('−')) {
    const beforeSign = before.slice(0, -1);
    const precedingChar = beforeSign.slice(-1);
    const isUnary = precedingChar === '' || '+−×÷('.includes(precedingChar);
    if (isUnary) {
      return beforeSign + number;
    }
  }

  return `${before}−${number}`;
}

function formatResultForExpression(value) {
  const rounded = Number(value.toPrecision(12));
  return String(rounded).replace('-', '−');
}

function evaluateCurrentExpression(state) {
  const result = evaluateExpression(toAsciiExpression(state.expression));

  if (result.ok) {
    return {
      expression: formatResultForExpression(result.value),
      previousExpression: state.expression,
      justEvaluated: true,
      error: null,
    };
  }

  return {
    ...state,
    error: { message: result.error.message, code: result.error.code },
  };
}

export function expressionReducer(state, action) {
  switch (action.type) {
    case 'DIGIT': {
      if (state.justEvaluated) {
        return { ...initialState, expression: appendDigit('', action.digit) };
      }
      return { ...state, error: null, expression: appendDigit(state.expression, action.digit) };
    }
    case 'DECIMAL': {
      if (state.justEvaluated) {
        return { ...initialState, expression: appendDecimal('') };
      }
      return { ...state, error: null, expression: appendDecimal(state.expression) };
    }
    case 'OPERATOR': {
      if (state.justEvaluated) {
        return {
          expression: appendOperator(state.expression, action.operator),
          previousExpression: '',
          justEvaluated: false,
          error: null,
        };
      }
      return {
        ...state,
        error: null,
        expression: appendOperator(state.expression, action.operator),
      };
    }
    case 'OPEN_PAREN': {
      if (state.justEvaluated) {
        return { ...initialState, expression: '(' };
      }
      return { ...state, error: null, expression: appendOpenParen(state.expression) };
    }
    case 'CLOSE_PAREN': {
      if (state.justEvaluated) {
        return state;
      }
      return { ...state, error: null, expression: appendCloseParen(state.expression) };
    }
    case 'EQUALS':
      return evaluateCurrentExpression(state);
    case 'CLEAR':
      return { ...initialState };
    case 'DELETE': {
      if (state.justEvaluated) {
        return state;
      }
      return { ...state, error: null, expression: deleteLastCharacter(state.expression) };
    }
    case 'TOGGLE_SIGN': {
      if (state.error) {
        return state;
      }
      if (state.justEvaluated) {
        return {
          ...state,
          expression: toggleTrailingSign(state.expression),
          justEvaluated: false,
        };
      }
      return { ...state, expression: toggleTrailingSign(state.expression) };
    }
    default:
      return state;
  }
}
