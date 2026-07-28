/**
 * Internal logger for recording calculation events, validation errors,
 * and unexpected failures (CFL-27).
 *
 * Logs are currently held in-memory and provide a failsafe mechanism
 * to ensure that logging errors do not crash the main application.
 */

let logs = [];

/**
 * Records a structured event in the log.
 *
 * @param {string} type - A categorization of the event (e.g. 'CALCULATION_SUCCESS').
 * @param {object} details - Additional structured data associated with the event.
 */
export function logEvent(type, details = {}) {
  try {
    const event = {
      timestamp: new Date().toISOString(),
      type,
      ...details,
    };
    logs.push(event);
  } catch (error) {
    // Logging failures must not break the calculator operation.
    console.warn('Logger failure:', error);
  }
}

/**
 * Retrieves a copy of the current logs.
 *
 * @returns {Array} An array of recorded log events.
 */
export function getLogs() {
  return [...logs];
}

/**
 * Clears the current logs. Useful for test resets.
 */
export function clearLogs() {
  logs = [];
}
