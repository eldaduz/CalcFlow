import { useState } from 'react';

import { formatExpressionForDisplay } from '../lib/expressionEngine.js';

export default function History({ entries, onReuse, onClear }) {
  const [open, setOpen] = useState(false);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="calculator-history">
      <div className="calculator-history-header">
        <button
          type="button"
          className="calculator-history-toggle"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          History ({entries.length})
        </button>
        {open && (
          <button type="button" className="calculator-history-clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      {open && (
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
      )}
    </div>
  );
}
