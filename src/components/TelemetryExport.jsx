import { useState } from 'react';

import { getButtonPressLogs, getTelemetryMetrics } from '../lib/logger.js';

export default function TelemetryExport() {
  const [status, setStatus] = useState('');

  function handleExport() {
    try {
      const buttonPresses = getButtonPressLogs();
      const metrics = getTelemetryMetrics();
      const payload = {
        generatedAt: new Date().toISOString(),
        buttonPresses,
        metrics,
      };
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'calcflow-telemetry.json';
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus(
        `Exported ${buttonPresses.length} telemetry ${buttonPresses.length === 1 ? 'entry' : 'entries'}.`,
      );
    } catch {
      setStatus('Telemetry export failed. Please try again.');
    }
  }

  return (
    <div className="calculator-telemetry-export">
      <button type="button" className="calculator-telemetry-export-button" onClick={handleExport}>
        Export Telemetry
      </button>
      <div className="calculator-telemetry-export-status" aria-live="polite">
        {status}
      </div>
    </div>
  );
}
