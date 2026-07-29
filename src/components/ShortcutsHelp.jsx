const SHORTCUTS = [
  { key: '0-9', label: 'Digits' },
  { key: '.', label: 'Decimal' },
  { key: '+ − × ÷', label: 'Operators' },
  { key: '( )', label: 'Parentheses' },
  { key: 'Enter / =', label: 'Equals' },
  { key: 'Backspace', label: 'Delete' },
  { key: 'Esc', label: 'Clear' },
  { key: 's', label: 'sin (Scientific)' },
  { key: 'c', label: 'cos (Scientific)' },
  { key: 't', label: 'tan (Scientific)' },
  { key: 'l', label: 'log (Scientific)' },
  { key: 'n', label: 'ln (Scientific)' },
  { key: 'r', label: '√ (Scientific)' },
  { key: 'u', label: 'ⁿ√ (Scientific)' },
  { key: '^', label: 'xʸ (Scientific)' },
  { key: '!', label: 'x! (Scientific)' },
  { key: '%', label: 'Percent (Scientific)' },
  { key: 'p', label: 'π (Scientific)' },
  { key: 'e', label: 'e (Scientific)' },
  { key: 'd', label: 'Toggle DEG/RAD (Scientific)' },
  { key: '?', label: 'Toggle this help' },
];

export default function ShortcutsHelp({ open }) {
  if (!open) {
    return null;
  }

  return (
    <div className="calculator-shortcuts-help" role="region" aria-label="Keyboard shortcuts">
      <p className="calculator-shortcuts-help-hint">Press ? or Esc to close</p>
      <div className="calculator-shortcuts-grid">
        {SHORTCUTS.map(({ key, label }) => (
          <div key={key} className="calculator-shortcuts-row">
            <kbd>{key}</kbd>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
