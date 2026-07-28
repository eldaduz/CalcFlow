import { afterEach, expect, test, vi } from 'vitest';

vi.mock('../src/calculator/expression/evaluateExpression.js', () => ({
  evaluateExpression: () => {
    throw new Error('unexpected parser failure');
  },
}));

import * as logger from '../src/lib/logger.js';
vi.mock('../src/lib/logger.js', () => ({
  logEvent: vi.fn(),
}));

import { expressionReducer, initialState } from '../src/lib/expressionEngine.js';

afterEach(() => {
  vi.restoreAllMocks();
});

test('contains an unexpected evaluator failure without losing the expression', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  const state = { ...initialState, expression: '1+2' };
  let nextState;

  expect(() => {
    nextState = expressionReducer(state, { type: 'EQUALS' });
  }).not.toThrow();

  expect(nextState).toMatchObject({
    expression: '1+2',
    error: {
      code: 'UNEXPECTED_EVALUATION_ERROR',
      message:
        'Something went wrong while evaluating the expression. Please edit it and try again.',
    },
  });
  expect(errorSpy).toHaveBeenCalledWith(
    'Unexpected expression evaluation failure',
    expect.any(Error),
  );
  expect(logger.logEvent).toHaveBeenCalledWith('UNEXPECTED_EVALUATION_ERROR', {
    expression: '1+2',
    angleMode: 'rad',
    errorName: 'Error',
    errorMessage: 'unexpected parser failure',
  });
});

test('allows editing after an unexpected evaluator failure', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  const erroredState = expressionReducer(
    { ...initialState, expression: '1+2' },
    { type: 'EQUALS' },
  );

  const recoveredState = expressionReducer(erroredState, { type: 'DELETE' });

  expect(recoveredState).toMatchObject({
    expression: '1+',
    error: null,
  });
  expect(errorSpy).toHaveBeenCalledTimes(1);
});
