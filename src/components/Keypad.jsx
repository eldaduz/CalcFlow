import PropTypes from 'prop-types';

const OPERATOR_LABELS = {
  '/': { symbol: '÷', ariaLabel: 'Divide' },
  '*': { symbol: '×', ariaLabel: 'Multiply' },
  '-': { symbol: '−', ariaLabel: 'Subtract' },
  '+': { symbol: '+', ariaLabel: 'Add' },
};

function OperatorButton({ operator, activeOperator, onOperator }) {
  const { symbol, ariaLabel } = OPERATOR_LABELS[operator];
  const isActive = activeOperator === operator;
  return (
    <button
      type="button"
      className={`calculator-button calculator-button--operator${isActive ? ' is-active' : ''}`}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      onClick={() => onOperator(operator)}
    >
      {symbol}
    </button>
  );
}

OperatorButton.propTypes = {
  operator: PropTypes.oneOf(['+', '-', '*', '/']).isRequired,
  activeOperator: PropTypes.string,
  onOperator: PropTypes.func.isRequired,
};

OperatorButton.defaultProps = {
  activeOperator: null,
};

export default function Keypad({
  activeOperator,
  onDigit,
  onDecimal,
  onOperator,
  onEquals,
  onClear,
  onDelete,
  onToggleSign,
}) {
  return (
    <div className="calculator-keypad">
      <button
        type="button"
        className="calculator-button calculator-button--action"
        onClick={onClear}
      >
        AC
      </button>
      <button
        type="button"
        className="calculator-button calculator-button--action"
        aria-label="Toggle positive or negative"
        onClick={onToggleSign}
      >
        ±
      </button>
      <button
        type="button"
        className="calculator-button calculator-button--action"
        aria-label="Delete last digit"
        onClick={onDelete}
      >
        ⌫
      </button>
      <OperatorButton operator="/" activeOperator={activeOperator} onOperator={onOperator} />

      <button type="button" className="calculator-button" onClick={() => onDigit('7')}>
        7
      </button>
      <button type="button" className="calculator-button" onClick={() => onDigit('8')}>
        8
      </button>
      <button type="button" className="calculator-button" onClick={() => onDigit('9')}>
        9
      </button>
      <OperatorButton operator="*" activeOperator={activeOperator} onOperator={onOperator} />

      <button type="button" className="calculator-button" onClick={() => onDigit('4')}>
        4
      </button>
      <button type="button" className="calculator-button" onClick={() => onDigit('5')}>
        5
      </button>
      <button type="button" className="calculator-button" onClick={() => onDigit('6')}>
        6
      </button>
      <OperatorButton operator="-" activeOperator={activeOperator} onOperator={onOperator} />

      <button type="button" className="calculator-button" onClick={() => onDigit('1')}>
        1
      </button>
      <button type="button" className="calculator-button" onClick={() => onDigit('2')}>
        2
      </button>
      <button type="button" className="calculator-button" onClick={() => onDigit('3')}>
        3
      </button>
      <OperatorButton operator="+" activeOperator={activeOperator} onOperator={onOperator} />

      <button
        type="button"
        className="calculator-button calculator-button--zero-wide"
        onClick={() => onDigit('0')}
      >
        0
      </button>
      <button type="button" className="calculator-button" onClick={onDecimal}>
        .
      </button>
      <button
        type="button"
        className="calculator-button calculator-button--equals"
        onClick={onEquals}
      >
        =
      </button>
    </div>
  );
}

Keypad.propTypes = {
  activeOperator: PropTypes.string,
  onDigit: PropTypes.func.isRequired,
  onDecimal: PropTypes.func.isRequired,
  onOperator: PropTypes.func.isRequired,
  onEquals: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleSign: PropTypes.func.isRequired,
};

Keypad.defaultProps = {
  activeOperator: null,
};
