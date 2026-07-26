export default function Display({ currentValue, previousExpression, error }) {
  return (
    <div>
      <div className="calculator-display">
        <div className="previous-expression">{previousExpression}</div>
        <div className="current-value">{currentValue}</div>
      </div>
      <div className="calculator-error" role="alert" aria-live="assertive">
        {error ? error.message : ''}
      </div>
    </div>
  );
}
