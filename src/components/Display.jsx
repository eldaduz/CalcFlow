export default function Display({
  currentValue,
  previousExpression,
  error,
  angleMode,
  memory,
  mode,
  resultAnnouncement,
}) {
  const topRightText = error ? error.message : previousExpression;

  return (
    <div>
      <div className="calculator-display">
        <div className="calculator-display-row calculator-display-row--top">
          {mode === 'scientific' && (
            <span className="calculator-memory-indicator">M: {memory}</span>
          )}
          <span
            className={
              error ? 'calculator-top-right calculator-top-right--error' : 'calculator-top-right'
            }
            role={error ? 'alert' : undefined}
            aria-live={error ? 'assertive' : undefined}
          >
            {topRightText}
          </span>
        </div>
        <div className="calculator-display-row">
          <span className="calculator-angle-mode-indicator">
            {angleMode ? angleMode.toUpperCase() : 'RAD'}
          </span>
          <div className="current-value">{currentValue}</div>
        </div>
      </div>
      <div className="sr-only" aria-live="polite">
        {resultAnnouncement}
      </div>
    </div>
  );
}
