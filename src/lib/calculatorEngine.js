/**
 * Basic calculator interaction engine (CFL-13).
 *
 * A pure, framework-free reducer that owns the calculator's interaction
 * state (current input, pending operand/operator, error) and delegates
 * actual arithmetic to CFL-12's `applyOperation`. Kept separate from React
 * so the primary MVP flow can be unit tested directly, the same way
 * CFL-12's arithmetic functions are tested.
 */

import { applyOperation, ArithmeticError } from './arithmetic.js';

export const initialState = {
  currentInput: '0',
  previousOperand: null,
  operator: null,
  // True once an operator has been chosen but the user hasn't yet typed a
  // digit for the next operand. The display keeps showing the previous
  // operand until then; the next digit/decimal replaces it instead of
  // appending, so `2 + 3` doesn't turn into `23`.
  awaitingOperand: false,
  justEvaluated: false,
  error: null,
};

function formatOperand(value) {
  // Keeps trailing zeros/decimal points out of the operand history text.
  return String(value);
}

function inputDigit(state, digit) {
  if (state.error) {
    return { ...initialState, currentInput: digit === '0' ? '0' : digit };
  }
  if (state.justEvaluated) {
    return {
      ...initialState,
      currentInput: digit,
    };
  }
  if (state.awaitingOperand || state.currentInput === '0') {
    return { ...state, currentInput: digit, awaitingOperand: false };
  }
  return { ...state, currentInput: state.currentInput + digit };
}

function inputDecimal(state) {
  if (state.error) {
    return { ...initialState, currentInput: '0.' };
  }
  if (state.justEvaluated) {
    return {
      ...initialState,
      currentInput: '0.',
    };
  }
  if (state.awaitingOperand) {
    return { ...state, currentInput: '0.', awaitingOperand: false };
  }
  if (state.currentInput.includes('.')) {
    return state;
  }
  return { ...state, currentInput: state.currentInput + '.' };
}

function chooseOperator(state, operator) {
  if (state.error) {
    return state;
  }

  // An operator was already chosen and the user hasn't typed a new operand
  // yet (e.g. pressed "+" then changed their mind to "-"): just swap the
  // pending operator, nothing to evaluate yet.
  if (state.operator && state.awaitingOperand) {
    return { ...state, operator };
  }

  const currentValue = Number(state.currentInput);

  if (state.operator && !state.justEvaluated) {
    try {
      const result = applyOperation(state.operator, state.previousOperand, currentValue);
      return {
        currentInput: formatOperand(result),
        previousOperand: result,
        operator,
        awaitingOperand: true,
        justEvaluated: false,
        error: null,
      };
    } catch (err) {
      return stateFromError(err);
    }
  }

  return {
    ...state,
    previousOperand: currentValue,
    operator,
    awaitingOperand: true,
    justEvaluated: false,
  };
}

function stateFromError(err) {
  if (err instanceof ArithmeticError) {
    return { ...initialState, error: { message: err.message, code: err.code } };
  }
  throw err;
}

function evaluate(state) {
  if (state.error || !state.operator || state.previousOperand === null) {
    return state;
  }
  const currentValue = Number(state.currentInput);
  try {
    const result = applyOperation(state.operator, state.previousOperand, currentValue);
    return {
      currentInput: formatOperand(result),
      previousOperand: state.previousOperand,
      operator: state.operator,
      awaitingOperand: false,
      justEvaluated: true,
      error: null,
    };
  } catch (err) {
    return stateFromError(err);
  }
}

function clearAll() {
  return { ...initialState };
}

function deleteLast(state) {
  if (state.error) {
    return { ...initialState };
  }
  if (state.justEvaluated || state.awaitingOperand) {
    return state;
  }
  if (state.currentInput.length <= 1 || /^-?\d$/.test(state.currentInput)) {
    return { ...state, currentInput: '0' };
  }
  return { ...state, currentInput: state.currentInput.slice(0, -1) };
}

function toggleSign(state) {
  if (state.error) {
    return state;
  }
  if (state.currentInput === '0') {
    return state;
  }
  const toggled = state.currentInput.startsWith('-')
    ? state.currentInput.slice(1)
    : `-${state.currentInput}`;
  return { ...state, currentInput: toggled, justEvaluated: false };
}

export function calculatorReducer(state, action) {
  switch (action.type) {
    case 'DIGIT':
      return inputDigit(state, action.digit);
    case 'DECIMAL':
      return inputDecimal(state);
    case 'OPERATOR':
      return chooseOperator(state, action.operator);
    case 'EQUALS':
      return evaluate(state);
    case 'CLEAR':
      return clearAll();
    case 'DELETE':
      return deleteLast(state);
    case 'TOGGLE_SIGN':
      return toggleSign(state);
    default:
      return state;
  }
}
