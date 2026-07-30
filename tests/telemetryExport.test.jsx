import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import TelemetryExport from '../src/components/TelemetryExport.jsx';
import { clearLogs, logButtonPress, logEvent } from '../src/lib/logger.js';

let container;
let root;

beforeEach(() => {
  clearLogs();
  globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  globalThis.URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  container?.remove();
  root = undefined;
  container = undefined;
  vi.restoreAllMocks();
});

function render() {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root.render(<TelemetryExport />);
  });
}

function clickExport() {
  const button = container.querySelector('.calculator-telemetry-export-button');
  act(() => {
    button.click();
  });
}

function statusText() {
  return container.querySelector('.calculator-telemetry-export-status').textContent;
}

describe('TelemetryExport', () => {
  it('reports zero entries when there is nothing to export', () => {
    render();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    clickExport();
    expect(statusText()).toBe('Exported 0 telemetry entries.');
  });

  it('exports button-press entries plus a computed metrics summary, singular wording for one entry', () => {
    logButtonPress('7');
    render();

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    clickExport();

    expect(globalThis.URL.createObjectURL).toHaveBeenCalledTimes(1);
    const blobArg = globalThis.URL.createObjectURL.mock.calls[0][0];
    expect(blobArg.type).toBe('application/json');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    expect(statusText()).toBe('Exported 1 telemetry entry.');
  });

  it('uses plural wording for multiple entries and never includes calculation events', () => {
    logEvent('CALCULATION_SUCCESS', { expression: '2+2', result: '4' });
    logButtonPress('2');
    logButtonPress('+');
    render();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    clickExport();

    expect(statusText()).toBe('Exported 2 telemetry entries.');
  });

  it('shows a failure status instead of throwing if export fails', () => {
    logButtonPress('7');
    render();
    globalThis.URL.createObjectURL = vi.fn(() => {
      throw new Error('simulated failure');
    });

    expect(() => clickExport()).not.toThrow();
    expect(statusText()).toBe('Telemetry export failed. Please try again.');
  });
});
