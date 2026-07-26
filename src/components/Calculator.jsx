import { useReducer } from 'react';

import { calculatorReducer, initialState } from '../lib/calculatorEngine.js';
import Display from './Display.jsx';
import Keypad from './Keypad.jsx';

export default function Calculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return (
    <div className="calculator">
      <div className="calculator-header">
        <h1>CalcFlow</h1>
        <span className="subtitle">Basic Calculator</span>
      </div>
      <Display
        currentInput={state.currentInput}
        previousOperand={state.previousOperand}
        operator={state.operator}
        error={state.error}
      />
      <Keypad
        activeOperator={state.operator}
        onDigit={(digit) => dispatch({ type: 'DIGIT', digit })}
        onDecimal={() => dispatch({ type: 'DECIMAL' })}
        onOperator={(operator) => dispatch({ type: 'OPERATOR', operator })}
        onEquals={() => dispatch({ type: 'EQUALS' })}
        onClear={() => dispatch({ type: 'CLEAR' })}
        onDelete={() => dispatch({ type: 'DELETE' })}
        onToggleSign={() => dispatch({ type: 'TOGGLE_SIGN' })}
      />
    </div>
  );
}
