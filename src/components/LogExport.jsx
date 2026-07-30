import { useState } from 'react';

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
    <div className="calculator-log-export">
      <button type="button" className="calculator-log-export-button" onClick={handleExport}>
        Export Logs
      </button>
      <div className="calculator-log-export-status" aria-live="polite">
        {status}
      </div>
    </div>
  );
}
