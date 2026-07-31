import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';

import CookieBanner from '../src/components/CookieBanner.jsx';

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

function render() {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => {
    root.render(<CookieBanner />);
  });
}

describe('CookieBanner', () => {
  it('renders once with exactly one Accept button and no other option', () => {
    render();
    const region = container.querySelector('.calculator-cookie-banner');
    expect(region).not.toBeNull();

    const buttons = container.querySelectorAll('.calculator-cookie-banner button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].textContent).toBe('Accept');
  });

  it('is exposed as a labeled region for assistive technology', () => {
    render();
    const region = container.querySelector('.calculator-cookie-banner');
    expect(region.getAttribute('role')).toBe('region');
    expect(region.getAttribute('aria-label')).toBe('Cookie notice');
  });

  it('dismisses on Accept and sets no other state', () => {
    render();
    const button = container.querySelector('.calculator-cookie-banner-button');

    act(() => {
      button.click();
    });

    expect(container.querySelector('.calculator-cookie-banner')).toBeNull();
    expect(sessionStorage.getItem('calcflow_cookie_banner_dismissed')).toBeNull();
    expect(localStorage.getItem('calcflow_cookie_banner_dismissed')).toBeNull();
  });

  it('reappears on a fresh mount -- dismissal is not persisted (part of the joke)', () => {
    render();
    act(() => {
      container.querySelector('.calculator-cookie-banner-button').click();
    });
    expect(container.querySelector('.calculator-cookie-banner')).toBeNull();

    act(() => {
      root.unmount();
    });
    container.remove();

    render();
    expect(container.querySelector('.calculator-cookie-banner')).not.toBeNull();
  });
});
