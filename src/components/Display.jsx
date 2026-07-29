export default function Display({
  currentValue,
  previousExpression,
  error,
  angleMode,
  resultAnnouncement,
}) {
  return (
    <div>
      <div className="calculator-display">
        <div className="previous-expression">{previousExpression}</div>
        <div className="calculator-display-row">
          <span className="calculator-angle-mode-indicator">
            {angleMode ? angleMode.toUpperCase() : 'RAD'}
          </span>
          <div className="current-value">{currentValue}</div>
        </div>
      </div>
      <div className="calculator-error" role="alert" aria-live="assertive">
        {error ? error.message : ''}
      </div>
      <div className="sr-only" aria-live="polite">
        {resultAnnouncement}
      </div>
    </div>
  );
}
