import { expect, test } from 'vitest';

import {
  expressionReducer,
  formatExpressionForDisplay,
  initialState,
} from '../src/lib/expressionEngine.js';

function dispatchAll(actions) {
  return actions.reduce(expressionReducer, initialState);
}

const digit = (d) => ({ type: 'DIGIT', digit: d });
const decimal = () => ({ type: 'DECIMAL' });
const operator = (op) => ({ type: 'OPERATOR', operator: op });
const openParen = () => ({ type: 'OPEN_PAREN' });
const closeParen = () => ({ type: 'CLOSE_PAREN' });
const equals = () => ({ type: 'EQUALS' });
const clear = () => ({ type: 'CLEAR' });
const del = () => ({ type: 'DELETE' });
const toggleSign = () => ({ type: 'TOGGLE_SIGN' });
const power = () => ({ type: 'POWER' });
const square = () => ({ type: 'POWER', square: true });
const squareRoot = () => ({ type: 'SQUARE_ROOT' });
const nthRoot = () => ({ type: 'NTH_ROOT' });
const func = (name) => ({ type: 'FUNCTION', name });

// --- entering multiple operands and operators ---

test('builds an expression from multiple operands and operators', () => {
  const state = dispatchAll([
    digit('1'),
    digit('2'),
    operator('+'),
    digit('3'),
    operator('*'),
    digit('4'),
  ]);
  expect(state.expression).toBe('12+3×4');
});

test('respects precedence when evaluating a multi-operand expression', () => {
  const state = dispatchAll([
    digit('1'),
    digit('2'),
    operator('+'),
    digit('3'),
    operator('*'),
    digit('4'),
    equals(),
  ]);
  expect(state.expression).toBe('24');
  expect(state.error).toBeNull();
});

test('leading zero is replaced by the first digit typed', () => {
  const state = dispatchAll([digit('5')]);
  expect(state.expression).toBe('5');
});

test('decimal point can only be entered once per number', () => {
  const state = dispatchAll([digit('1'), decimal(), digit('5'), decimal(), digit('9')]);
  expect(state.expression).toBe('1.59');
});

test('starting a number with a decimal point produces "0."', () => {
  const state = dispatchAll([decimal(), digit('5')]);
  expect(state.expression).toBe('0.5');
});

test('a decimal after an operator starts a fresh "0." for the next operand', () => {
  const state = dispatchAll([digit('1'), operator('+'), decimal(), digit('5')]);
  expect(state.expression).toBe('1+0.5');
});

test('power entry appends an exponent operator after an operand', () => {
  const state = dispatchAll([digit('2'), power(), digit('3')]);
  expect(state.expression).toBe('2^3');
});

test('square entry appends a squared exponent', () => {
  const state = dispatchAll([digit('2'), square()]);
  expect(state.expression).toBe('2^2');
});

test('square-root entry starts a root operand', () => {
  const state = dispatchAll([squareRoot(), digit('9')]);
  expect(state.expression).toBe('√9');
});

test('square-root entry starts a root exponent after power', () => {
  const state = dispatchAll([digit('2'), power(), squareRoot(), digit('9'), equals()]);
  expect(state.expression).toBe('8');
});

test('square-root entry does not turn an entered degree into an nth root', () => {
  const state = dispatchAll([digit('3'), squareRoot()]);
  expect(state.expression).toBe('3');
});

test('nth-root entry follows a degree with a root operator', () => {
  const state = dispatchAll([digit('3'), nthRoot(), digit('8')]);
  expect(state.expression).toBe('3√8');
});

// --- parentheses entered and displayed ---

test('parentheses are entered and displayed in the expression', () => {
  const state = dispatchAll([
    openParen(),
    digit('5'),
    operator('+'),
    digit('2'),
    closeParen(),
    operator('*'),
    digit('3'),
  ]);
  expect(state.expression).toBe('(5+2)×3');
});

test('parentheses override precedence when evaluated', () => {
  const state = dispatchAll([
    openParen(),
    digit('5'),
    operator('+'),
    digit('2'),
    closeParen(),
    operator('*'),
    digit('3'),
    equals(),
  ]);
  expect(state.expression).toBe('21');
});

test('nested parentheses are supported', () => {
  const state = dispatchAll([
    digit('2'),
    operator('*'),
    openParen(),
    digit('3'),
    operator('+'),
    openParen(),
    digit('4'),
    operator('*'),
    digit('5'),
    closeParen(),
    closeParen(),
    equals(),
  ]);
  expect(state.expression).toBe('46');
});

test('an extra closing parenthesis is ignored when there is nothing open to close', () => {
  const state = dispatchAll([digit('5'), closeParen()]);
  expect(state.expression).toBe('5');
});

test('a closing parenthesis is ignored once all open parentheses are already matched', () => {
  const state = dispatchAll([openParen(), digit('5'), closeParen(), closeParen()]);
  expect(state.expression).toBe('(5)');
});

// --- invalid editing states prevented ---

test('multiply cannot start an expression (no legitimate unary * )', () => {
  const state = dispatchAll([operator('*'), digit('5')]);
  expect(state.expression).toBe('5');
});

test('divide cannot start an expression', () => {
  const state = dispatchAll([operator('/'), digit('5')]);
  expect(state.expression).toBe('5');
});

test('multiply cannot immediately follow an open parenthesis', () => {
  const state = dispatchAll([openParen(), operator('*'), digit('5')]);
  expect(state.expression).toBe('(5');
});

test('a leading minus is allowed as a valid unary sign', () => {
  const state = dispatchAll([operator('-'), digit('5'), operator('+'), digit('2'), equals()]);
  expect(state.expression).toBe('−3');
});

// --- delete and clear work consistently ---

test('AC resets to the initial state', () => {
  const state = dispatchAll([digit('1'), operator('+'), openParen(), digit('2'), clear()]);
  expect(state).toEqual(initialState);
});

test('delete removes the last character, including parentheses and operators', () => {
  const state = dispatchAll([
    digit('1'),
    operator('+'),
    openParen(),
    digit('2'),
    del(),
    del(),
    del(),
  ]);
  expect(state.expression).toBe('1');
});

test('deleting down to nothing leaves an empty expression, not an error', () => {
  const state = dispatchAll([digit('5'), del()]);
  expect(state.expression).toBe('');
  expect(state.error).toBeNull();
});

test('delete is inert immediately after a result', () => {
  const evaluated = dispatchAll([digit('9'), operator('+'), digit('1'), equals()]);
  const afterDelete = expressionReducer(evaluated, del());
  expect(afterDelete).toEqual(evaluated);
});

// --- controlled errors and recovery, without resetting the expression ---

test('an invalid expression shows a controlled error and keeps the expression on screen', () => {
  const state = dispatchAll([digit('9'), operator('/'), digit('0'), equals()]);
  expect(state.error).not.toBeNull();
  expect(state.error.message.toLowerCase()).toContain('divide');
  expect(state.expression).toBe('9÷0');
});

test('the user recovers from an error by continuing to edit, not by losing the expression', () => {
  const errored = dispatchAll([digit('9'), operator('/'), digit('0'), equals()]);
  const fixed = [del(), digit('3'), equals()].reduce(expressionReducer, errored);
  expect(fixed.error).toBeNull();
  expect(fixed.expression).toBe('3');
});

test('AC still fully clears an error state', () => {
  const errored = dispatchAll([digit('9'), operator('/'), digit('0'), equals()]);
  const cleared = expressionReducer(errored, clear());
  expect(cleared).toEqual(initialState);
});

test('an unbalanced expression produces a clear error at evaluation time', () => {
  const state = dispatchAll([openParen(), digit('2'), operator('+'), digit('3'), equals()]);
  expect(state.error).not.toBeNull();
  expect(state.expression).toBe('(2+3');
});

// --- continuing a calculation after "=" ---

test('a digit after "=" starts a fresh expression', () => {
  const evaluated = dispatchAll([digit('9'), operator('+'), digit('1'), equals()]);
  const next = expressionReducer(evaluated, digit('7'));
  expect(next.expression).toBe('7');
  expect(next.previousExpression).toBe('');
});

test('an operator after "=" continues the calculation from the result', () => {
  const evaluated = dispatchAll([digit('9'), operator('+'), digit('1'), equals()]);
  const next = [operator('*'), digit('2'), equals()].reduce(expressionReducer, evaluated);
  expect(next.expression).toBe('20');
});

test('square root after "=" starts a fresh prefix expression', () => {
  const evaluated = dispatchAll([digit('9'), operator('+'), digit('1'), equals()]);
  const next = expressionReducer(evaluated, squareRoot());
  expect(next).toEqual({ ...initialState, expression: '√' });
});

// --- sign toggle ---

test('sign toggle flips a plain trailing number', () => {
  const state = dispatchAll([digit('5'), toggleSign()]);
  expect(state.expression).toBe('−5');
  const back = expressionReducer(state, toggleSign());
  expect(back.expression).toBe('5');
});

test('sign toggle after a binary minus inserts a new unary sign rather than eating the operator', () => {
  const state = dispatchAll([digit('1'), digit('2'), operator('-'), digit('5'), toggleSign()]);
  expect(state.expression).toBe('12−−5');
});

test('sign toggle after multiply correctly removes an existing unary sign', () => {
  const state = dispatchAll([digit('2'), operator('*'), operator('-'), digit('5'), toggleSign()]);
  expect(state.expression).toBe('2×5');
});

test('sign toggle is inert when the expression does not end in a number', () => {
  const state = dispatchAll([digit('1'), operator('+')]);
  const toggled = expressionReducer(state, toggleSign());
  expect(toggled).toEqual(state);
});

test('sign toggle on a result continues editing rather than starting fresh', () => {
  const evaluated = dispatchAll([digit('9'), operator('+'), digit('1'), equals()]);
  const toggled = expressionReducer(evaluated, toggleSign());
  expect(toggled.expression).toBe('−10');
  expect(toggled.justEvaluated).toBe(false);
  const next = expressionReducer(toggled, digit('5'));
  expect(next.expression).toBe('−105');
});

// --- log/ln expression functions ---

test('function entry appends the function name and an opening parenthesis', () => {
  const state = dispatchAll([func('log'), digit('1'), digit('0'), digit('0')]);
  expect(state.expression).toBe('log(100');
});

test('function entry after "=" starts a fresh expression rather than continuing the result', () => {
  const evaluated = dispatchAll([digit('9'), operator('+'), digit('1'), equals()]);
  const next = expressionReducer(evaluated, func('ln'));
  expect(next).toEqual({ ...initialState, expression: 'ln(' });
});

test('function entry clears an existing error and keeps editing in place', () => {
  const errored = dispatchAll([openParen(), digit('2'), operator('+'), digit('3'), equals()]);
  expect(errored.error).not.toBe(null);
  const next = expressionReducer(errored, func('log'));
  expect(next.error).toBe(null);
  expect(next.expression).toBe('(2+3log(');
});

// --- display formatting ---

test('formatExpressionForDisplay spaces binary operators but not unary signs', () => {
  expect(formatExpressionForDisplay('12+3×4')).toBe('12 + 3 × 4');
  expect(formatExpressionForDisplay('2×−5')).toBe('2 × −5');
  expect(formatExpressionForDisplay('−5')).toBe('−5');
  expect(formatExpressionForDisplay('(2+3)×4')).toBe('(2 + 3) × 4');
});
