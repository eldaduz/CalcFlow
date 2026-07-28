import { useEffect, useReducer, useState } from 'react';

import {
  expressionReducer,
  formatExpressionForDisplay,
  initialState,
} from '../lib/expressionEngine.js';
import Display from './Display.jsx';
import History from './History.jsx';
import Keypad from './Keypad.jsx';

const OPERATOR_KEYS = new Set(['+', '-', '*', '/']);

function readStoredHistory() {
  if (typeof sessionStorage === 'undefined') {
    return [];
  }
  try {
    const stored = sessionStorage.getItem('calcflow_history');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const init = (initial) => ({
  ...initial,
  angleMode:
    (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('calcflow_angle_mode')) ||
    'rad',
  history: readStoredHistory(),
});

export default function Calculator() {
  const [state, dispatch] = useReducer(expressionReducer, initialState, init);
  const [mode, setMode] = useState('basic');

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('calcflow_angle_mode', state.angleMode);
    }
  }, [state.angleMode]);

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('calcflow_history', JSON.stringify(state.history));
    }
  }, [state.history]);

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
        <div className="calculator-mode-toggle" aria-label="Calculator mode">
          {['basic', 'scientific'].map((option) => (
            <button
              key={option}
              type="button"
              className="calculator-mode-button"
              aria-pressed={mode === option}
              onClick={() => setMode(option)}
            >
              {option === 'basic' ? 'Basic' : 'Scientific'}
            </button>
          ))}
        </div>
      </div>
      <Display
        currentValue={formatExpressionForDisplay(state.expression) || '0'}
        previousExpression={formatExpressionForDisplay(state.previousExpression)}
        error={state.error}
        angleMode={state.angleMode}
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
        scientific={mode === 'scientific'}
        angleMode={state.angleMode}
        onToggleAngleMode={() => dispatch({ type: 'TOGGLE_ANGLE_MODE' })}
        onPower={(square) => dispatch({ type: 'POWER', square })}
        onSquareRoot={() => dispatch({ type: 'SQUARE_ROOT' })}
        onNthRoot={() => dispatch({ type: 'NTH_ROOT' })}
        onFunction={(name) => dispatch({ type: 'FUNCTION', name })}
        onFactorial={() => dispatch({ type: 'FACTORIAL' })}
        onPercent={() => dispatch({ type: 'PERCENT' })}
        onAbs={() => dispatch({ type: 'ABS' })}
        onConstant={(symbol) => dispatch({ type: 'CONSTANT', symbol })}
      />
      <History
        entries={state.history}
        onReuse={(entry) => dispatch({ type: 'REUSE_HISTORY', expression: entry.expression })}
        onClear={() => dispatch({ type: 'CLEAR_HISTORY' })}
      />
    </div>
  );
}
