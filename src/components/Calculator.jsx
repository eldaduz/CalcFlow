import { useEffect, useReducer, useState } from 'react';

import {
  expressionReducer,
  formatExpressionForDisplay,
  formatResultForExpression,
  initialState,
} from '../lib/expressionEngine.js';
import { logButtonPress } from '../lib/logger.js';
import Display from './Display.jsx';
import History from './History.jsx';
import Keypad from './Keypad.jsx';
import LogExport from './LogExport.jsx';
import ShortcutsHelp from './ShortcutsHelp.jsx';
import TelemetryExport from './TelemetryExport.jsx';

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

const ACTION_BUTTON_NAMES = {
  DECIMAL: '.',
  OPEN_PAREN: '(',
  CLOSE_PAREN: ')',
  EQUALS: '=',
  CLEAR: 'AC',
  DELETE: '⌫',
  TOGGLE_SIGN: '±',
  TOGGLE_ANGLE_MODE: 'DEG/RAD',
  SQUARE_ROOT: '√',
  NTH_ROOT: 'ⁿ√',
  FACTORIAL: 'x!',
  PERCENT: '%',
  ABS: '|x|',
  MEMORY_ADD: 'M+',
  MEMORY_SUBTRACT: 'M−',
  MEMORY_RECALL: 'MR',
  MEMORY_CLEAR: 'MC',
  REUSE_HISTORY: 'history-reuse',
  CLEAR_HISTORY: 'history-clear',
};

function describeAction(action) {
  switch (action.type) {
    case 'DIGIT':
      return action.digit;
    case 'OPERATOR':
      return action.operator;
    case 'POWER':
      return action.square ? 'x²' : 'xʸ';
    case 'FUNCTION':
      return action.name;
    case 'CONSTANT':
      return action.symbol;
    default:
      return ACTION_BUTTON_NAMES[action.type] || action.type;
  }
}

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

  function loggedDispatch(action) {
    logButtonPress(describeAction(action), { triggersCalculation: action.type === 'EQUALS' });
    dispatch(action);
  }

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
        logButtonPress('Shortcuts: Toggle');
        setShowShortcuts((current) => !current);
        return;
      }

      if (key === 'Escape' && showShortcuts) {
        event.preventDefault();
        logButtonPress('Shortcuts: Close');
        setShowShortcuts(false);
        return;
      }

      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        loggedDispatch({ type: 'DIGIT', digit: key });
      } else if (key === '.') {
        event.preventDefault();
        loggedDispatch({ type: 'DECIMAL' });
      } else if (OPERATOR_KEYS.has(key)) {
        event.preventDefault();
        loggedDispatch({ type: 'OPERATOR', operator: key });
      } else if (key === '(') {
        event.preventDefault();
        loggedDispatch({ type: 'OPEN_PAREN' });
      } else if (key === ')') {
        event.preventDefault();
        loggedDispatch({ type: 'CLOSE_PAREN' });
      } else if (key === '%') {
        // Not mode-gated: the % button lives on the universal base keypad
        // (CFL-25), unlike the other Scientific-only shortcuts below.
        event.preventDefault();
        loggedDispatch({ type: 'PERCENT' });
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        loggedDispatch({ type: 'EQUALS' });
      } else if (key === 'Escape') {
        event.preventDefault();
        loggedDispatch({ type: 'CLEAR' });
      } else if (key === 'Backspace') {
        event.preventDefault();
        loggedDispatch({ type: 'DELETE' });
      } else if (mode === 'scientific' && SCIENTIFIC_KEY_ACTIONS[key]) {
        event.preventDefault();
        loggedDispatch(SCIENTIFIC_KEY_ACTIONS[key]);
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
              onClick={() => {
                logButtonPress(`Mode: ${option === 'basic' ? 'Basic' : 'Scientific'}`);
                setMode(option);
              }}
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
        resultAnnouncement={
          state.justEvaluated && !state.error
            ? `Result: ${formatExpressionForDisplay(state.expression)}`
            : ''
        }
      />
      <Keypad
        onDigit={(digit) => loggedDispatch({ type: 'DIGIT', digit })}
        onDecimal={() => loggedDispatch({ type: 'DECIMAL' })}
        onOperator={(operator) => loggedDispatch({ type: 'OPERATOR', operator })}
        onOpenParen={() => loggedDispatch({ type: 'OPEN_PAREN' })}
        onCloseParen={() => loggedDispatch({ type: 'CLOSE_PAREN' })}
        onEquals={() => loggedDispatch({ type: 'EQUALS' })}
        onClear={() => loggedDispatch({ type: 'CLEAR' })}
        onDelete={() => loggedDispatch({ type: 'DELETE' })}
        onToggleSign={() => loggedDispatch({ type: 'TOGGLE_SIGN' })}
        scientific={mode === 'scientific'}
        angleMode={state.angleMode}
        onToggleAngleMode={() => loggedDispatch({ type: 'TOGGLE_ANGLE_MODE' })}
        onPower={(square) => loggedDispatch({ type: 'POWER', square })}
        onSquareRoot={() => loggedDispatch({ type: 'SQUARE_ROOT' })}
        onNthRoot={() => loggedDispatch({ type: 'NTH_ROOT' })}
        onFunction={(name) => loggedDispatch({ type: 'FUNCTION', name })}
        onFactorial={() => loggedDispatch({ type: 'FACTORIAL' })}
        onPercent={() => loggedDispatch({ type: 'PERCENT' })}
        onAbs={() => loggedDispatch({ type: 'ABS' })}
        onConstant={(symbol) => loggedDispatch({ type: 'CONSTANT', symbol })}
        memory={formatResultForExpression(state.memory)}
        onMemoryAdd={() => loggedDispatch({ type: 'MEMORY_ADD' })}
        onMemorySubtract={() => loggedDispatch({ type: 'MEMORY_SUBTRACT' })}
        onMemoryRecall={() => loggedDispatch({ type: 'MEMORY_RECALL' })}
        onMemoryClear={() => loggedDispatch({ type: 'MEMORY_CLEAR' })}
      />
      <History
        entries={state.history}
        onReuse={(entry) => loggedDispatch({ type: 'REUSE_HISTORY', expression: entry.expression })}
        onClear={() => loggedDispatch({ type: 'CLEAR_HISTORY' })}
      />
      <LogExport />
      <TelemetryExport />
    </div>
  );
}
