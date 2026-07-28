const OPERATOR_LABELS = {
  '/': { symbol: '÷', ariaLabel: 'Divide' },
  '*': { symbol: '×', ariaLabel: 'Multiply' },
  '-': { symbol: '−', ariaLabel: 'Subtract' },
  '+': { symbol: '+', ariaLabel: 'Add' },
};

function OperatorButton({ operator, onOperator }) {
  const { symbol, ariaLabel } = OPERATOR_LABELS[operator];
  return (
    <button
      type="button"
      className="calculator-button calculator-button--operator"
      aria-label={ariaLabel}
      onClick={() => onOperator(operator)}
    >
      {symbol}
    </button>
  );
}

export default function Keypad({
  onDigit,
  onDecimal,
  onOperator,
  onOpenParen,
  onCloseParen,
  onEquals,
  onClear,
  onDelete,
  onToggleSign,
  scientific,
  angleMode,
  onToggleAngleMode,
  onPower,
  onSquareRoot,
  onNthRoot,
  onFunction,
  onFactorial,
  onPercent,
  onAbs,
  onConstant,
}) {
  return (
    <div className="calculator-keypad-section">
      {scientific && (
        <div className="calculator-scientific-row">
          <button
            type="button"
            className="calculator-button"
            aria-label={`Angle mode: current is ${angleMode ? angleMode.toUpperCase() : 'RAD'}. Click to switch.`}
            onClick={onToggleAngleMode}
          >
            {angleMode ? angleMode.toUpperCase() : 'RAD'}
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Sine"
            onClick={() => onFunction('sin')}
          >
            sin
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Cosine"
            onClick={() => onFunction('cos')}
          >
            cos
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Tangent"
            onClick={() => onFunction('tan')}
          >
            tan
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Base-10 logarithm"
            onClick={() => onFunction('log')}
          >
            log
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Natural logarithm"
            onClick={() => onFunction('ln')}
          >
            ln
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Square"
            onClick={() => onPower(true)}
          >
            x²
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Power"
            onClick={() => onPower(false)}
          >
            xʸ
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Square root"
            onClick={onSquareRoot}
          >
            √
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Nth root"
            onClick={onNthRoot}
          >
            ⁿ√
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Percent"
            onClick={onPercent}
          >
            %
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Absolute value"
            onClick={onAbs}
          >
            |x|
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Factorial"
            onClick={onFactorial}
          >
            x!
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Pi"
            onClick={() => onConstant('π')}
          >
            π
          </button>
          <button
            type="button"
            className="calculator-button"
            aria-label="Euler's number"
            onClick={() => onConstant('e')}
          >
            e
          </button>
        </div>
      )}
      <div className="calculator-expression-row">
        <button
          type="button"
          className="calculator-button"
          aria-label="Open parenthesis"
          onClick={onOpenParen}
        >
          (
        </button>
        <button
          type="button"
          className="calculator-button"
          aria-label="Close parenthesis"
          onClick={onCloseParen}
        >
          )
        </button>
      </div>
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
        <OperatorButton operator="/" onOperator={onOperator} />

        <button type="button" className="calculator-button" onClick={() => onDigit('7')}>
          7
        </button>
        <button type="button" className="calculator-button" onClick={() => onDigit('8')}>
          8
        </button>
        <button type="button" className="calculator-button" onClick={() => onDigit('9')}>
          9
        </button>
        <OperatorButton operator="*" onOperator={onOperator} />

        <button type="button" className="calculator-button" onClick={() => onDigit('4')}>
          4
        </button>
        <button type="button" className="calculator-button" onClick={() => onDigit('5')}>
          5
        </button>
        <button type="button" className="calculator-button" onClick={() => onDigit('6')}>
          6
        </button>
        <OperatorButton operator="-" onOperator={onOperator} />

        <button type="button" className="calculator-button" onClick={() => onDigit('1')}>
          1
        </button>
        <button type="button" className="calculator-button" onClick={() => onDigit('2')}>
          2
        </button>
        <button type="button" className="calculator-button" onClick={() => onDigit('3')}>
          3
        </button>
        <OperatorButton operator="+" onOperator={onOperator} />

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
    </div>
  );
}
