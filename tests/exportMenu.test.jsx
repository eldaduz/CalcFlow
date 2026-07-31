import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ExportMenu from '../src/components/ExportMenu.jsx';
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
  vi.useRealTimers();
});

function render() {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root.render(<ExportMenu />);
  });
}

function openMenu() {
  const button = container.querySelector('.calculator-icon-button');
  act(() => {
    button.click();
  });
}

function clickMenuItem(text) {
  const item = [...container.querySelectorAll('.calculator-export-menu-item')].find(
    (el) => el.textContent === text,
  );
  act(() => {
    item.click();
  });
}

function statusText() {
  return container.querySelector('.calculator-icon-status').textContent;
}

describe('ExportMenu', () => {
  it('shows a single icon button with no menu open by default', () => {
    render();
    expect(container.querySelector('.calculator-icon-button')).not.toBeNull();
    expect(container.querySelector('.calculator-export-menu')).toBeNull();
  });

  it('opens the menu with both export options on click', () => {
    render();
    openMenu();
    const items = [...container.querySelectorAll('.calculator-export-menu-item')].map(
      (el) => el.textContent,
    );
    expect(items).toEqual(['Export Logs', 'Export Telemetry']);
  });

  it('toggles the menu closed on a second click', () => {
    render();
    openMenu();
    openMenu();
    expect(container.querySelector('.calculator-export-menu')).toBeNull();
  });

  it('exports the real logs, closes the menu, and reports the count', () => {
    logEvent('CALCULATION_SUCCESS', { expression: '2+2', result: '4' });
    render();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    openMenu();
    clickMenuItem('Export Logs');

    expect(container.querySelector('.calculator-export-menu')).toBeNull();
    expect(globalThis.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(globalThis.URL.createObjectURL.mock.calls[0][0].type).toBe('application/json');
    expect(statusText()).toBe('Exported 1 log entry.');
  });

  it('exports telemetry (button presses + metrics) separately from real logs', () => {
    logButtonPress('2');
    logButtonPress('=', { triggersCalculation: true });
    render();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    openMenu();
    clickMenuItem('Export Telemetry');

    expect(statusText()).toBe('Exported 2 telemetry entries.');
  });

  it('shows a failure status instead of throwing if the logs export fails', () => {
    render();
    globalThis.URL.createObjectURL = vi.fn(() => {
      throw new Error('simulated failure');
    });

    openMenu();
    expect(() => clickMenuItem('Export Logs')).not.toThrow();
    expect(statusText()).toBe('Export failed. Please try again.');
  });

  it('shows a failure status instead of throwing if the telemetry export fails', () => {
    render();
    globalThis.URL.createObjectURL = vi.fn(() => {
      throw new Error('simulated failure');
    });

    openMenu();
    expect(() => clickMenuItem('Export Telemetry')).not.toThrow();
    expect(statusText()).toBe('Telemetry export failed. Please try again.');
  });

  it('clears the status message automatically after a delay', () => {
    vi.useFakeTimers();
    logEvent('CALCULATION_SUCCESS', { expression: '2+2', result: '4' });
    render();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    openMenu();
    clickMenuItem('Export Logs');
    expect(statusText()).toBe('Exported 1 log entry.');

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(statusText()).toBe('');
  });
});
