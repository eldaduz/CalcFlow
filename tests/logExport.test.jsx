import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import LogExport from '../src/components/LogExport.jsx';
import { clearLogs, logEvent } from '../src/lib/logger.js';

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
    root.render(<LogExport />);
  });
}

function clickExport() {
  const button = container.querySelector('.calculator-icon-button');
  act(() => {
    button.click();
  });
}

function statusText() {
  return container.querySelector('.calculator-icon-status').textContent;
}

describe('LogExport', () => {
  it('reports zero entries when there is nothing to export', () => {
    render();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    clickExport();
    expect(statusText()).toBe('Exported 0 log entries.');
  });

  it('exports the current logs as a downloaded JSON file, singular wording for one entry', () => {
    logEvent('CALCULATION_SUCCESS', { expression: '2+2', result: '4' });
    render();

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    clickExport();

    expect(globalThis.URL.createObjectURL).toHaveBeenCalledTimes(1);
    const blobArg = globalThis.URL.createObjectURL.mock.calls[0][0];
    expect(blobArg.type).toBe('application/json');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    expect(statusText()).toBe('Exported 1 log entry.');
  });

  it('uses plural wording for multiple entries', () => {
    logEvent('CALCULATION_SUCCESS', { expression: '2+2', result: '4' });
    logEvent('CALCULATION_ERROR', { expression: '5/0', errorCode: 'DIVIDE_BY_ZERO' });
    render();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    clickExport();

    expect(statusText()).toBe('Exported 2 log entries.');
  });

  it('shows a failure status instead of throwing if export fails', () => {
    logEvent('CALCULATION_SUCCESS', { expression: '2+2', result: '4' });
    render();
    globalThis.URL.createObjectURL = vi.fn(() => {
      throw new Error('simulated failure');
    });

    expect(() => clickExport()).not.toThrow();
    expect(statusText()).toBe('Export failed. Please try again.');
  });
});
