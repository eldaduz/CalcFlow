import { useState } from 'react';

import ExportIcon from './icons/ExportIcon.jsx';
import { getLogs } from '../lib/logger.js';

export default function LogExport() {
  const [status, setStatus] = useState('');

  function handleExport() {
    try {
      const logs = getLogs();
      const json = JSON.stringify(logs, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'calcflow-logs.json';
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus(`Exported ${logs.length} log ${logs.length === 1 ? 'entry' : 'entries'}.`);
    } catch {
      setStatus('Export failed. Please try again.');
    }
  }

  return (
    <div className="calculator-icon-control">
      <button
        type="button"
        className="calculator-icon-button"
        aria-label="Export Logs"
        onClick={handleExport}
      >
        <ExportIcon />
      </button>
      <div className="calculator-icon-status" aria-live="polite">
        {status}
      </div>
    </div>
  );
}
