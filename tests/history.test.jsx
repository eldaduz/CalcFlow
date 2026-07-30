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

// CFL-95: open/closed state and the toggle control itself now live in
// Calculator.jsx's header (the History icon), not in this component -- it
// just renders the panel body when told to.

test('renders nothing when closed, regardless of entry count', () => {
  render({
    entries: [{ expression: '1+1', result: '2' }],
    open: false,
    onReuse: vi.fn(),
    onClear: vi.fn(),
  });
  expect(container.querySelector('.calculator-history')).toBeNull();
});

test('renders an empty panel when open with no entries', () => {
  render({ entries: [], open: true, onReuse: vi.fn(), onClear: vi.fn() });
  expect(container.querySelector('.calculator-history')).not.toBeNull();
  expect(container.querySelector('.calculator-history-list').children).toHaveLength(0);
});

test('shows each entry with its expression and result when open', () => {
  render({
    entries: [
      { expression: '2+2', result: '4' },
      { expression: '1+1', result: '2' },
    ],
    open: true,
    onReuse: vi.fn(),
    onClear: vi.fn(),
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
    open: true,
    onReuse,
    onClear: vi.fn(),
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
    open: true,
    onReuse: vi.fn(),
    onClear,
  });

  act(() => {
    container.querySelector('.calculator-history-clear').click();
  });

  expect(onClear).toHaveBeenCalled();
});
