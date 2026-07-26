import { expect, test } from 'vitest';

import { calculatorReducer, initialState } from '../src/lib/calculatorEngine.js';

function dispatchAll(actions) {
  return actions.reduce(calculatorReducer, initialState);
}

const digit = (d) => ({ type: 'DIGIT', digit: d });
const decimal = () => ({ type: 'DECIMAL' });
const operator = (op) => ({ type: 'OPERATOR', operator: op });
const equals = () => ({ type: 'EQUALS' });
const clear = () => ({ type: 'CLEAR' });
const del = () => ({ type: 'DELETE' });
const toggleSign = () => ({ type: 'TOGGLE_SIGN' });

// --- entering integers and decimals ---

test('entering digits builds a multi-digit number', () => {
  const state = dispatchAll([digit('1'), digit('2'), digit('3')]);
  expect(state.currentInput).toBe('123');
});

test('leading zero is replaced by the first digit typed', () => {
  const state = dispatchAll([digit('5')]);
  expect(state.currentInput).toBe('5');
});

test('decimal point can only be entered once per number', () => {
  const state = dispatchAll([digit('1'), decimal(), digit('5'), decimal(), digit('9')]);
  expect(state.currentInput).toBe('1.59');
});

test('starting a number with a decimal point produces "0."', () => {
  const state = dispatchAll([decimal(), digit('5')]);
  expect(state.currentInput).toBe('0.5');
});

// --- choosing an operator and continuing a calculation ---

test('selecting an operator stores the first operand and awaits the next', () => {
  const state = dispatchAll([digit('7'), operator('+')]);
  expect(state.previousOperand).toBe(7);
  expect(state.operator).toBe('+');
  expect(state.currentInput).toBe('7');
});

test('pressing = computes the pending operation', () => {
  const state = dispatchAll([digit('2'), operator('+'), digit('3'), equals()]);
  expect(state.currentInput).toBe('5');
  expect(state.error).toBeNull();
});

test('chaining operators continues the calculation without pressing =', () => {
  // 2 + 3 + 4 = 9
  const state = dispatchAll([
    digit('2'),
    operator('+'),
    digit('3'),
    operator('+'),
    digit('4'),
    equals(),
  ]);
  expect(state.currentInput).toBe('9');
});

test('changing the operator before entering the next operand replaces it', () => {
  const state = dispatchAll([digit('8'), operator('+'), operator('-'), digit('3'), equals()]);
  expect(state.currentInput).toBe('5');
});

test('starting a new number after = begins a fresh calculation', () => {
  const afterEquals = dispatchAll([digit('2'), operator('+'), digit('3'), equals()]);
  const next = calculatorReducer(afterEquals, digit('9'));
  expect(next.currentInput).toBe('9');
  expect(next.previousOperand).toBeNull();
  expect(next.operator).toBeNull();
});

// --- clear, delete, sign toggle ---

test('AC resets to the initial state', () => {
  const state = dispatchAll([digit('9'), operator('+'), digit('1'), clear()]);
  expect(state).toEqual(initialState);
});

test('delete removes the last character of the current input', () => {
  const state = dispatchAll([digit('1'), digit('2'), digit('3'), del()]);
  expect(state.currentInput).toBe('12');
});

test('deleting the last remaining digit resets the input to "0"', () => {
  const state = dispatchAll([digit('5'), del()]);
  expect(state.currentInput).toBe('0');
});

test('sign toggle flips the current input between positive and negative', () => {
  const negative = dispatchAll([digit('4'), toggleSign()]);
  expect(negative.currentInput).toBe('-4');

  const positive = calculatorReducer(negative, toggleSign());
  expect(positive.currentInput).toBe('4');
});

test('sign toggle on zero has no effect', () => {
  const state = dispatchAll([toggleSign()]);
  expect(state.currentInput).toBe('0');
});

test('delete does nothing while awaiting a new operand after choosing an operator', () => {
  const state = dispatchAll([digit('8'), operator('+'), del()]);
  expect(state.currentInput).toBe('8');
  expect(state.operator).toBe('+');
});

test('an unrecognized action leaves the state unchanged', () => {
  const state = calculatorReducer(initialState, { type: 'NOT_A_REAL_ACTION' });
  expect(state).toEqual(initialState);
});

// --- controlled errors and recovery ---

test('division by zero produces a controlled, displayable error instead of crashing', () => {
  const state = dispatchAll([digit('5'), operator('/'), digit('0'), equals()]);
  expect(state.error).not.toBeNull();
  expect(state.error.code).toBe('DIVIDE_BY_ZERO');
});

test('the user can recover from an error by starting a new number', () => {
  const errored = dispatchAll([digit('5'), operator('/'), digit('0'), equals()]);
  const recovered = calculatorReducer(errored, digit('7'));
  expect(recovered.error).toBeNull();
  expect(recovered.currentInput).toBe('7');
});

test('the user can recover from an error by deleting', () => {
  const errored = dispatchAll([digit('5'), operator('/'), digit('0'), equals()]);
  const recovered = calculatorReducer(errored, del());
  expect(recovered).toEqual(initialState);
});

test('sign toggle is inert while an error is displayed (does not silently change the value)', () => {
  const errored = dispatchAll([digit('5'), operator('/'), digit('0'), equals()]);
  expect(calculatorReducer(errored, toggleSign())).toEqual(errored);
});

test('the user can recover from an error with AC', () => {
  const errored = dispatchAll([digit('5'), operator('/'), digit('0'), equals()]);
  const recovered = calculatorReducer(errored, clear());
  expect(recovered).toEqual(initialState);
});

test('an overflow error is controlled the same way as division by zero', () => {
  // Number.MAX_VALUE is impractical to type digit-by-digit; construct the
  // pending-operation state directly to exercise the same EQUALS path.
  const pendingOverflow = {
    ...initialState,
    previousOperand: Number.MAX_VALUE,
    operator: '*',
    currentInput: '2',
  };
  const state = calculatorReducer(pendingOverflow, equals());
  expect(state.error).not.toBeNull();
  expect(state.error.code).toBe('OVERFLOW');
});
