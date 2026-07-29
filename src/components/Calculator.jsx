import { useEffect, useReducer, useState } from 'react';

import {
  expressionReducer,
  formatExpressionForDisplay,
  formatResultForExpression,
  initialState,
} from '../lib/expressionEngine.js';
import Display from './Display.jsx';
import History from './History.jsx';
import Keypad from './Keypad.jsx';
import ShortcutsHelp from './ShortcutsHelp.jsx';

const OPERATOR_KEYS = new Set(['+', '-', '*', '/']);

/**
 * Scientific-mode-only keyboard shortcuts (CFL-70). Gated to Scientific mode
 * because their corresponding controls are only visible there -- shortcuts
 * mirror what's on screen rather than acting as hidden bindings. `%` is
 * handled separately below (not mode-gated) since CFL-25 moved its button
 * onto the universal base keypad.
 */
const SCIENTIFIC_KEY_ACTIONS = {
  s: { type: 'FUNCTION', name: 'sin' },
  c: { type: 'FUNCTION', name: 'cos' },
  t: { type: 'FUNCTION', name: 'tan' },
  l: { type: 'FUNCTION', name: 'log' },
  n: { type: 'FUNCTION', name: 'ln' },
  r: { type: 'SQUARE_ROOT' },
  u: { type: 'NTH_ROOT' },
  '^': { type: 'POWER', square: false },
  '!': { type: 'FACTORIAL' },
  p: { type: 'CONSTANT', symbol: 'π' },
  e: { type: 'CONSTANT', symbol: 'e' },
  d: { type: 'TOGGLE_ANGLE_MODE' },
};

function readStoredMemory() {
  if (typeof sessionStorage === 'undefined') {
    return 0;
  }
  const stored = Number(sessionStorage.getItem('calcflow_memory'));
  return Number.isFinite(stored) ? stored : 0;
}

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
  memory: readStoredMemory(),
  history: readStoredHistory(),
});

export default function Calculator() {
  const [state, dispatch] = useReducer(expressionReducer, initialState, init);
  const [mode, setMode] = useState('basic');
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('calcflow_angle_mode', state.angleMode);
    }
  }, [state.angleMode]);

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('calcflow_memory', String(state.memory));
    }
  }, [state.memory]);

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('calcflow_history', JSON.stringify(state.history));
    }
  }, [state.history]);

  useEffect(() => {
    function handleKeyDown(event) {
      const { key } = event;

      // Never intercept a modifier combo (Cmd/Ctrl/Alt) -- those are the
      // browser's or OS's shortcuts (zoom, refresh, etc.), not ours.
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (key === '?') {
        event.preventDefault();
        setShowShortcuts((current) => !current);
        return;
      }

      if (key === 'Escape' && showShortcuts) {
        event.preventDefault();
        setShowShortcuts(false);
        return;
      }

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
      } else if (key === '%') {
        // Not mode-gated: the % button lives on the universal base keypad
        // (CFL-25), unlike the other Scientific-only shortcuts below.
        event.preventDefault();
        dispatch({ type: 'PERCENT' });
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        dispatch({ type: 'EQUALS' });
      } else if (key === 'Escape') {
        event.preventDefault();
        dispatch({ type: 'CLEAR' });
      } else if (key === 'Backspace') {
        event.preventDefault();
        dispatch({ type: 'DELETE' });
      } else if (mode === 'scientific' && SCIENTIFIC_KEY_ACTIONS[key]) {
        event.preventDefault();
        dispatch(SCIENTIFIC_KEY_ACTIONS[key]);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, showShortcuts]);

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
      <ShortcutsHelp open={showShortcuts} />
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
        memory={formatResultForExpression(state.memory)}
        onMemoryAdd={() => dispatch({ type: 'MEMORY_ADD' })}
        onMemorySubtract={() => dispatch({ type: 'MEMORY_SUBTRACT' })}
        onMemoryRecall={() => dispatch({ type: 'MEMORY_RECALL' })}
        onMemoryClear={() => dispatch({ type: 'MEMORY_CLEAR' })}
      />
      <History
        entries={state.history}
        onReuse={(entry) => dispatch({ type: 'REUSE_HISTORY', expression: entry.expression })}
        onClear={() => dispatch({ type: 'CLEAR_HISTORY' })}
      />
    </div>
  );
}
