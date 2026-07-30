import { useState } from 'react';

export default function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="calculator-cookie-banner" role="region" aria-label="Cookie notice">
      <p className="calculator-cookie-banner-text">
        CalcFlow uses zero cookies and stores nothing outside this browser tab, but we&apos;re
        contractually obligated to interrupt your arithmetic to tell you that anyway.
      </p>
      <button
        type="button"
        className="calculator-cookie-banner-button"
        onClick={() => setDismissed(true)}
      >
        Accept
      </button>
    </div>
  );
}
