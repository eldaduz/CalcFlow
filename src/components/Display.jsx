const OPERATOR_SYMBOLS = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷',
};

function formatPreviousExpression(previousOperand, operator) {
  if (previousOperand === null || !operator) {
    return '';
  }
  return `${previousOperand} ${OPERATOR_SYMBOLS[operator] ?? operator}`;
}

export default function Display({ currentInput, previousOperand, operator, error }) {
  return (
    <div>
      <div className="calculator-display">
        <div className="previous-expression">
          {formatPreviousExpression(previousOperand, operator)}
        </div>
        <div className="current-value">{currentInput}</div>
      </div>
      <div className="calculator-error" role="alert" aria-live="assertive">
        {error ? error.message : ''}
      </div>
    </div>
  );
}
