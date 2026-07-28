import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, test, vi } from 'vitest';

import History from '../src/components/History.jsx';

let container;
let root;

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  container?.remove();
  root = undefined;
  container = undefined;
});

function render(props) {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root.render(<History {...props} />);
  });
}

test('renders nothing when there are no entries', () => {
  render({ entries: [], onReuse: vi.fn(), onClear: vi.fn() });
  expect(container.querySelector('.calculator-history')).toBeNull();
});

test('shows a toggle with the entry count but keeps the list collapsed by default', () => {
  render({
    entries: [{ expression: '1+1', result: '2' }],
    onReuse: vi.fn(),
    onClear: vi.fn(),
  });
  const toggle = container.querySelector('.calculator-history-toggle');
  expect(toggle.textContent).toBe('History (1)');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(container.querySelector('.calculator-history-list')).toBeNull();
});

test('expanding the toggle shows each entry with its expression and result', () => {
  render({
    entries: [
      { expression: '2+2', result: '4' },
      { expression: '1+1', result: '2' },
    ],
    onReuse: vi.fn(),
    onClear: vi.fn(),
  });

  act(() => {
    container.querySelector('.calculator-history-toggle').click();
  });

  const entries = container.querySelectorAll('.calculator-history-entry');
  expect(entries).toHaveLength(2);
  expect(entries[0].textContent).toBe('2 + 2= 4');
  expect(entries[1].textContent).toBe('1 + 1= 2');
});

test('clicking an entry calls onReuse with that entry', () => {
  const onReuse = vi.fn();
  render({
    entries: [{ expression: '3+3', result: '6' }],
    onReuse,
    onClear: vi.fn(),
  });

  act(() => {
    container.querySelector('.calculator-history-toggle').click();
  });
  act(() => {
    container.querySelector('.calculator-history-entry').click();
  });

  expect(onReuse).toHaveBeenCalledWith({ expression: '3+3', result: '6' });
});

test('clicking Clear calls onClear', () => {
  const onClear = vi.fn();
  render({
    entries: [{ expression: '3+3', result: '6' }],
    onReuse: vi.fn(),
    onClear,
  });

  act(() => {
    container.querySelector('.calculator-history-toggle').click();
  });
  act(() => {
    container.querySelector('.calculator-history-clear').click();
  });

  expect(onClear).toHaveBeenCalled();
});
