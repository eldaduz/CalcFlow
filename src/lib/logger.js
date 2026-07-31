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

const BUTTON_PRESS_WINDOW_MS = 6 * 60 * 60 * 1000;
const CALCULATION_SPAN_NAMES = ['parse-expression', 'evaluate', 'format-result', 'render'];

function randomId(bytes) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto
      .randomUUID()
      .replace(/-/g, '')
      .slice(0, bytes * 2);
  }
  let id = '';
  for (let i = 0; i < bytes * 2; i += 1) {
    id += Math.floor(Math.random() * 16).toString(16);
  }
  return id;
}

// Fabricated, deadpan-APM-styled duration for a calculator button press --
// the joke is the format (nanoseconds, trace/span IDs), not the number.
function fabricatedDurationNs() {
  return Math.floor(Math.random() * 480000) + 20000;
}

function pruneButtonPresses() {
  const cutoff = Date.now() - BUTTON_PRESS_WINDOW_MS;
  logs = logs.filter(
    (event) => event.type !== 'BUTTON_PRESS' || new Date(event.timestamp).getTime() >= cutoff,
  );
}

/**
 * Records a button press with a fabricated trace span, folded into the same
 * log store as real calculation events. Presses that trigger a calculation
 * additionally get a nested waterfall of child spans. Entries of this type
 * are kept to a rolling 6-hour window rather than growing unbounded.
 *
 * @param {string} button - A human-readable identifier for the button pressed.
 * @param {object} [options]
 * @param {boolean} [options.triggersCalculation] - Whether this press evaluates the expression.
 */
export function logButtonPress(button, { triggersCalculation = false } = {}) {
  try {
    const event = {
      timestamp: new Date().toISOString(),
      type: 'BUTTON_PRESS',
      button,
      traceId: randomId(8),
      spanId: randomId(4),
      durationNs: fabricatedDurationNs(),
    };
    if (triggersCalculation) {
      event.spans = CALCULATION_SPAN_NAMES.map((name) => ({
        name,
        spanId: randomId(4),
        durationNs: fabricatedDurationNs(),
      }));
    }
    logs.push(event);
    pruneButtonPresses();
  } catch (error) {
    console.warn('Logger failure:', error);
  }
}

// Every real button the calculator can render, used to compute the
// "neglected button" metric below. Kept close to logButtonPress since it's
// the identifier scheme those log entries actually use.
export const KNOWN_BUTTONS = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '.',
  '+',
  '-',
  '*',
  '/',
  '(',
  ')',
  '=',
  'AC',
  '⌫',
  '±',
  'DEG/RAD',
  '√',
  'ⁿ√',
  'x!',
  '%',
  '|x|',
  'x²',
  'xʸ',
  'sin',
  'cos',
  'tan',
  'log',
  'ln',
  'π',
  'e',
  'M+',
  'M−',
  'MR',
  'MC',
  'history-reuse',
  'history-clear',
  'Mode: Basic',
  'Mode: Scientific',
  'Shortcuts: Toggle',
  'Shortcuts: Close',
];

/**
 * Retrieves only the button-press/trace entries currently in the rolling
 * 6-hour window -- the raw data included in a Telemetry export.
 */
export function getButtonPressLogs() {
  return logs.filter((event) => event.type === 'BUTTON_PRESS');
}

function topEntry(counts) {
  const entries = Object.entries(counts);
  if (entries.length === 0) {
    return null;
  }
  return entries.sort((a, b) => b[1] - a[1])[0];
}

/**
 * Computes deliberately over-engineered "observability" metrics from the
 * current logs: most-pressed button, most common calculation error, a
 * neglected button, and two vanity stats. Never touches or depends on
 * logs/calcflow-submission-log.json -- purely derived from the in-memory
 * store at call time.
 */
export function getTelemetryMetrics() {
  const buttonPresses = getButtonPressLogs();
  const errorEvents = logs.filter((event) => event.type === 'CALCULATION_ERROR');

  const pressCounts = {};
  buttonPresses.forEach((event) => {
    pressCounts[event.button] = (pressCounts[event.button] || 0) + 1;
  });
  const topButton = topEntry(pressCounts);

  const errorCounts = {};
  errorEvents.forEach((event) => {
    errorCounts[event.errorCode] = (errorCounts[event.errorCode] || 0) + 1;
  });
  const topError = topEntry(errorCounts);

  const pressedButtons = new Set(buttonPresses.map((event) => event.button));
  const neglectedButtons = KNOWN_BUTTONS.filter((button) => !pressedButtons.has(button));

  let longestStreakWithoutClear = 0;
  let currentStreak = 0;
  buttonPresses.forEach((event) => {
    if (event.button === 'AC') {
      currentStreak = 0;
    } else {
      currentStreak += 1;
      longestStreakWithoutClear = Math.max(longestStreakWithoutClear, currentStreak);
    }
  });

  return {
    totalButtonPresses: buttonPresses.length,
    mostPressedButton: topButton ? { button: topButton[0], count: topButton[1] } : null,
    mostCommonError: topError ? { errorCode: topError[0], count: topError[1] } : null,
    neglectedButtons,
    longestStreakWithoutClear,
  };
}
