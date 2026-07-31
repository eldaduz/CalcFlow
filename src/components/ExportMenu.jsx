import { useState } from 'react';

import { getButtonPressLogs, getLogs, getTelemetryMetrics } from '../lib/logger.js';
import ExportIcon from './icons/ExportIcon.jsx';

const STATUS_CLEAR_DELAY_MS = 4000;

function downloadJson(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ExportMenu() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');

  function showStatus(message) {
    setStatus(message);
    setTimeout(() => setStatus(''), STATUS_CLEAR_DELAY_MS);
  }

  function handleExportLogs() {
    setOpen(false);
    try {
      const logs = getLogs();
      downloadJson(logs, 'calcflow-logs.json');
      showStatus(`Exported ${logs.length} log ${logs.length === 1 ? 'entry' : 'entries'}.`);
    } catch {
      showStatus('Export failed. Please try again.');
    }
  }

  function handleExportTelemetry() {
    setOpen(false);
    try {
      const buttonPresses = getButtonPressLogs();
      const metrics = getTelemetryMetrics();
      downloadJson(
        { generatedAt: new Date().toISOString(), buttonPresses, metrics },
        'calcflow-telemetry.json',
      );
      showStatus(
        `Exported ${buttonPresses.length} telemetry ${buttonPresses.length === 1 ? 'entry' : 'entries'}.`,
      );
    } catch {
      showStatus('Telemetry export failed. Please try again.');
    }
  }

  return (
    <div className="calculator-icon-control">
      <button
        type="button"
        className="calculator-icon-button"
        aria-label="Export"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <ExportIcon />
      </button>
      {open && (
        <div className="calculator-export-menu" role="menu">
          <button
            type="button"
            role="menuitem"
            className="calculator-export-menu-item"
            onClick={handleExportLogs}
          >
            Export Logs
          </button>
          <button
            type="button"
            role="menuitem"
            className="calculator-export-menu-item"
            onClick={handleExportTelemetry}
          >
            Export Telemetry
          </button>
        </div>
      )}
      <div className="calculator-icon-status" aria-live="polite">
        {status}
      </div>
    </div>
  );
}
