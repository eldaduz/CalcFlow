import { useEffect, useReducer } from 'react';

import {
  expressionReducer,
  formatExpressionForDisplay,
  initialState,
} from '../lib/expressionEngine.js';
import Display from './Display.jsx';
import Keypad from './Keypad.jsx';

const OPERATOR_KEYS = new Set(['+', '-', '*', '/']);

export default function Calculator() {
  const [state, dispatch] = useReducer(expressionReducer, initialState);

  useEffect(() => {
    function handleKeyDown(event) {
      const { key } = event;

      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        dispatch({ type: 'DIGIT', digit: key });
      } else if (key === '.') {
        event.preventDefault();
        dispatch({ type: 'DECIMAL' });
      } else if (OPERATOR_KEYS.has(key)) {
        event.preventDefault();
        dispatch({ type: 'OPERATOR', operator: key });
      } else if (key === '(') {
        event.preventDefault();
        dispatch({ type: 'OPEN_PAREN' });
      } else if (key === ')') {
        event.preventDefault();
        dispatch({ type: 'CLOSE_PAREN' });
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        dispatch({ type: 'EQUALS' });
      } else if (key === 'Escape') {
        event.preventDefault();
        dispatch({ type: 'CLEAR' });
      } else if (key === 'Backspace') {
        event.preventDefault();
        dispatch({ type: 'DELETE' });
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="calculator">
      <div className="calculator-header">
        <h1>CalcFlow</h1>
        <span className="subtitle">Basic Calculator</span>
      </div>
      <Display
        currentValue={formatExpressionForDisplay(state.expression) || '0'}
        previousExpression={formatExpressionForDisplay(state.previousExpression)}
        error={state.error}
      />
      <Keypad
        onDigit={(digit) => dispatch({ type: 'DIGIT', digit })}
        onDecimal={() => dispatch({ type: 'DECIMAL' })}
        onOperator={(operator) => dispatch({ type: 'OPERATOR', operator })}
        onOpenParen={() => dispatch({ type: 'OPEN_PAREN' })}
        onCloseParen={() => dispatch({ type: 'CLOSE_PAREN' })}
        onEquals={() => dispatch({ type: 'EQUALS' })}
        onClear={() => dispatch({ type: 'CLEAR' })}
        onDelete={() => dispatch({ type: 'DELETE' })}
        onToggleSign={() => dispatch({ type: 'TOGGLE_SIGN' })}
      />
    </div>
  );
}
