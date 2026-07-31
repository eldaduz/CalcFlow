import { formatExpressionForDisplay } from '../lib/expressionEngine.js';

/**
 * CFL-95: the open/closed toggle is now the History icon button in
 * Calculator.jsx's header (matching Export Logs) rather than a text button
 * owned by this component, so open state is controlled by the parent.
 */
export default function History({ entries, open, onReuse, onClear }) {
  if (!open) {
    return null;
  }

  return (
    <div className="calculator-history">
      <div className="calculator-history-header">
        <h2 className="calculator-history-title">History</h2>
        {entries.length > 0 && (
          <button type="button" className="calculator-history-clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      <ul className="calculator-history-list">
        {entries.map((entry, index) => (
          <li key={index}>
            <button
              type="button"
              className="calculator-history-entry"
              onClick={() => onReuse(entry)}
            >
              <span className="calculator-history-expression">
                {formatExpressionForDisplay(entry.expression)}
              </span>
              <span className="calculator-history-result">
                = {formatExpressionForDisplay(entry.result)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
