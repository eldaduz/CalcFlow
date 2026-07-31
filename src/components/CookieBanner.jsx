import { useState } from 'react';

export default function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="calculator-cookie-banner" role="region" aria-label="Cookie notice">
      <p className="calculator-cookie-banner-text">
        CalcFlow logs every button you press, complete with fake trace IDs and timestamps, because
        someone decided a calculator needed observability. You don&apos;t have a choice in this —
        the button below doesn&apos;t opt you out of anything, it just makes this message go away.
        Relax, it&apos;s just numbers. What do you care?
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
