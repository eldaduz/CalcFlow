import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, expect, test } from 'vitest';

import App from '../src/App.jsx';

let container;
let root;

afterEach(() => {
  root?.unmount();
  container?.remove();
  root = undefined;
  container = undefined;
});

test('renders the CalcFlow application shell', () => {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);

  act(() => {
    root.render(<App />);
  });

  expect(container.querySelector('h1')?.textContent).toBe('CalcFlow');
});
