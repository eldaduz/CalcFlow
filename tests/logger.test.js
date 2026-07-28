import { describe, it, expect, beforeEach, vi } from 'vitest';
import { logEvent, getLogs, clearLogs } from '../src/lib/logger.js';

describe('Logger', () => {
  beforeEach(() => {
    clearLogs();
  });

  it('records a structured log event with timestamp', () => {
    logEvent('CALCULATION_SUCCESS', { expression: '2+2', result: '4' });

    const logs = getLogs();
    expect(logs).toHaveLength(1);

    const log = logs[0];
    expect(log.type).toBe('CALCULATION_SUCCESS');
    expect(log.expression).toBe('2+2');
    expect(log.result).toBe('4');

    // Ensure timestamp is a valid ISO string
    expect(log.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('does not throw or crash the application on internal failure', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Induce a failure by passing an object that throws on property access,
    // or by mocking Date.prototype.toISOString to throw
    const originalToISOString = Date.prototype.toISOString;
    Date.prototype.toISOString = () => {
      throw new Error('Simulated failure');
    };

    expect(() => {
      logEvent('ANY_EVENT');
    }).not.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith('Logger failure:', expect.any(Error));
    expect(getLogs()).toHaveLength(0); // Nothing should be logged

    // Cleanup
    Date.prototype.toISOString = originalToISOString;
    consoleSpy.mockRestore();
  });
});
