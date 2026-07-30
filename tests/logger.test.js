import { describe, it, expect, beforeEach, vi } from 'vitest';
import { logEvent, logButtonPress, getLogs, clearLogs } from '../src/lib/logger.js';

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

describe('Button press logging', () => {
  beforeEach(() => {
    clearLogs();
  });

  it('records a flat trace span for a plain button press', () => {
    logButtonPress('7');

    const logs = getLogs();
    expect(logs).toHaveLength(1);

    const log = logs[0];
    expect(log.type).toBe('BUTTON_PRESS');
    expect(log.button).toBe('7');
    expect(log.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(typeof log.traceId).toBe('string');
    expect(log.traceId.length).toBeGreaterThan(0);
    expect(typeof log.spanId).toBe('string');
    expect(Number.isInteger(log.durationNs)).toBe(true);
    expect(log.durationNs).toBeGreaterThan(0);
    expect(log.spans).toBeUndefined();
  });

  it('records a nested span waterfall for a calculation-triggering press', () => {
    logButtonPress('=', { triggersCalculation: true });

    const log = getLogs()[0];
    expect(log.spans).toHaveLength(4);
    expect(log.spans.map((span) => span.name)).toEqual([
      'parse-expression',
      'evaluate',
      'format-result',
      'render',
    ]);
    log.spans.forEach((span) => {
      expect(typeof span.spanId).toBe('string');
      expect(Number.isInteger(span.durationNs)).toBe(true);
    });
  });

  it('does not affect real calculation events sharing the same store', () => {
    logEvent('CALCULATION_SUCCESS', { expression: '2+2', result: '4' });
    logButtonPress('2');

    const logs = getLogs();
    expect(logs).toHaveLength(2);
    expect(logs.some((log) => log.type === 'CALCULATION_SUCCESS')).toBe(true);
    expect(logs.some((log) => log.type === 'BUTTON_PRESS')).toBe(true);
  });

  it('evicts button-press entries older than the 6-hour rolling window, but never calculation events', () => {
    const now = new Date('2026-01-01T12:00:00.000Z');
    vi.useFakeTimers();
    vi.setSystemTime(now);

    logEvent('CALCULATION_SUCCESS', { expression: '1+1', result: '2' });
    logButtonPress('1');

    vi.setSystemTime(new Date(now.getTime() + 7 * 60 * 60 * 1000));
    logButtonPress('2');

    const logs = getLogs();
    expect(logs).toHaveLength(2);
    expect(logs.find((log) => log.type === 'CALCULATION_SUCCESS')).toBeDefined();
    expect(logs.filter((log) => log.type === 'BUTTON_PRESS')).toHaveLength(1);
    expect(logs.find((log) => log.type === 'BUTTON_PRESS').button).toBe('2');

    vi.useRealTimers();
  });

  it('does not throw on internal failure', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const originalToISOString = Date.prototype.toISOString;
    Date.prototype.toISOString = () => {
      throw new Error('Simulated failure');
    };

    expect(() => {
      logButtonPress('=');
    }).not.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith('Logger failure:', expect.any(Error));

    Date.prototype.toISOString = originalToISOString;
    consoleSpy.mockRestore();
  });
});
