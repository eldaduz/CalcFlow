# CalcFlow UI Design Specification

## Purpose

This document is the shared UI and UX contract for CalcFlow. It preserves one
calculator workflow as features are added; it does not authorize future
implementation before its Jira Feature begins.

## Product Surface

CalcFlow has one calculator surface with a `Basic` / `Scientific` mode toggle
in the header.

- Basic mode shows the approved expression-controls row and unchanged
  four-column base keypad.
- Scientific mode reveals a scientific-controls section above those controls.
- Scientific mode never replaces, shrinks, or reorders the base keypad.
- Mode is presentation state only: both modes use the same editable expression,
  display, equals action, inline errors, and recovery behavior.
- The toggle uses semantic buttons, exposes its selected state, and does not
  reset a calculation.

No separate scientific calculator layout is approved.

## Shared Screen Structure

```text
Calculator Container
├── Header: CalcFlow and Basic / Scientific toggle
├── Display: previous expression and current input/result
├── Inline error / status area
├── Scientific controls (Scientific mode only)
├── Expression controls row
└── Base keypad
```

The display remains the primary visual element. Numeric content is right
aligned and handles long values through controlled sizing or horizontal
scrolling. Errors stay near the display, use `aria-live`, preserve the
editable expression, and clear after valid editing or reset.

## CFL-95 Calculator Design Tweaks (pending Eldad's joint sign-off)

Reviewed as an interactive Artifact mockup with Gavi across many rounds (11+ iterations covering desktop and mobile, https://claude.ai/code/artifact/9c378fcb-4cbe-47e6-a59c-1bf49081210d) before any code changed, matching this project's established practice for layout changes (see the CFL-25 mockup precedent below). Gavi approved the mockup; **written here as the proposed/agreed direction on Gavi's side, not yet a completed two-person approval** -- same status as CFL-25's still-pending base-keypad decision, and for the same reason: this revises the Scientific-controls grid position and introduces new interaction patterns (a slider toggle, icon-only History/Export controls, a non-reflowing side panel) that design.md's AI Rules require joint sign-off for before permanent/final status, even though the code has been implemented and is going through the normal review cycle. Flagging explicitly in the implementing PR for Eldad's review.

- **Memory indicator** moves from its own row inside the Scientific-controls grid to the display's top-left, mirroring the angle-mode indicator (which stays bottom-left, alongside the current value). Top row: memory indicator (left, Scientific mode only), previous expression / error message (right). Bottom row: angle-mode indicator (left), current value (right). **Basic mode never shows the memory indicator** -- memory is exclusively controlled by `MC`/`MR`/`M+`/`M-`, which only exist in the Scientific-controls grid, so a visible `M: 0` in Basic mode has nothing behind it to explain.
- **Error message** moves into the display's top-right slot (previously dead space when there was no previous expression to show) instead of a separate row below the display box. Same `role="alert"`/`aria-live="assertive"` semantics, just relocated. Mutually exclusive with showing the previous expression in that slot -- an error means evaluation didn't produce a new previous-expression state anyway.
- **Scientific-controls grid** sits to the right of the base keypad (not stacked above it), and the calculator itself genuinely widens (400px -> 616px) to hold it, with a 16px gap between the two columns. The base keypad's own position and the header (title, icons, mode toggle) never move on screen when this happens -- the calculator is anchored so only its right edge grows. This supersedes the CFL-25 stacked-above arrangement.
- **Digit cap**: the displayed expression stops accepting new characters at 14 (Basic) / 26 (Scientific) rather than scrolling horizontally -- the wider Scientific display genuinely has room for more. (Raised from an initially-reviewed 22 during implementation: a pre-existing test needs `tan(1.5707963267948966)`, 23 characters at full float precision, to actually trip the tangent domain-error threshold -- a shorter/rounded value wouldn't reliably trigger the same error, so the cap needed headroom past that rather than the test being rewritten around an arbitrary limit.)
- **Mode toggle** becomes a single slider control with both "Basic" and "Scientific" labels visible on it, replacing the two separate buttons.
- **History** becomes an icon control (bare icon, no button box, matching Export Logs below) instead of a text "History (n)" button. Opens a panel to the left of the calculator as a true overlay -- it does not resize or reflow the calculator or its header, on desktop/wide viewports, and spans the calculator's full height (top edge to bottom edge) rather than only as tall as its own content, with its entry list scrolling internally once it overflows. Below a new responsive breakpoint (900px), it instead renders inline, directly below the display, pushing the keypad down -- there isn't room to open sideways on a narrow screen. Same breakpoint governs the Scientific-grid fallback below.
- **Scientific below 900px**: reverts to a stacked-above-the-keypad arrangement (same 4-column, 5-row grid, unchanged control order) rather than the side-by-side layout, at roughly half the usual button height, since there isn't room for the calculator to widen to 616px on a narrow screen either.
- **Export Logs** becomes an icon control (bare icon, no button box), moved into the header, immediately to the left of the mode slider.
- Icons for History and Export Logs: real Noun Project artwork ("History" and "Export", both by Alzam, CC BY 3.0), rendered inline as `<svg fill="currentColor">` so they inherit the button's color/hover state rather than a static raster image -- same licensing pattern as the existing favicon, credited in `ALL_LICENSES` and as a code comment.

## Base Keypad and Expression Workflow

The base keypad is permanent and identical in Basic and Scientific mode:

```text
AC  %  ⌫  ÷
7   8  9  ×
4   5  6  −
1   2  3  +
0   ±  .  =
```

- Revised by CFL-25 (Gavi's proposed direction, pending Eldad's joint
  sign-off per Design Control — see Decisions below): `0` is
  single width, `±` moved next to it in the bottom row, and `%` moved into
  the base keypad's top row (out of the Scientific-controls section). This
  supersedes the earlier "`0` is double width" decision. Every base-keypad
  button is now the same size, and the keypad no longer differs between
  Basic and Scientific mode in any respect — the prior approach of a
  Scientific-only reordering was considered and rejected specifically
  because it would have made the base keypad mode-dependent.
- `(` and `)` remain in a dedicated expression-controls row directly above
  the base keypad in Basic mode, unchanged. In Scientific mode, the same two
  controls move into the Scientific-controls grid instead (see Scientific
  Control Contracts) so the row is not duplicated; this does not remove or
  alter Basic mode's row.
- `AC`, delete, sign toggle, keyboard entry, and equals retain their existing
  expression behavior.
- The expression may be incomplete while being edited; calculation reports the
  existing inline controlled error rather than blocking entry.
- Do not restore active-operator highlighting: multi-operator expressions make
  it misleading.

## Scientific Control Contracts

Controls append to or edit the same expression. They never calculate by
themselves unless their Feature explicitly approves an immediate operation.

| Feature                                     | Controls and behavior contract                                                                                                                                                                                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CFL-17 Powers and Roots                     | `x²`, `xʸ`, `√`, and `ⁿ√` support expression entry. `x²` appends `^2`; `xʸ` appends `^`; prefix `√` starts a square-root operand; infix `√` follows a degree and starts an nth-root radicand. Power and root domains report controlled real-number errors inline.                |
| CFL-18 Logarithms                           | `log` and `ln` are Scientific expression functions: each control inserts `log(` or `ln(` at the cursor for continued editable entry (for example, `log(100)`). They never replace the expression with its current evaluated value. Evaluator serialization remains CFL-18 scope. |
| CFL-19 / CFL-20 Trigonometry and angle mode | `sin`, `cos`, `tan` use the shared expression. A visible `DEG` / `RAD` mode control makes the active mode unambiguous and keeps it for the current session.                                                                                                                      |
| CFL-21 Additional operations                | `&#124;x&#124;`, `x!`, `π`, and `e` use the same scientific-controls section and expression flow. `%` moved to the base keypad under CFL-25 (see Decisions) and is no longer part of this section.                                                                               |

Keyboard support invokes the same actions as controls. Existing basic keys stay
supported. Scientific shortcuts must not be added until their owning Feature
documents them; controls remain discoverable without hidden shortcuts.

### Scientific-Controls Grid Order (CFL-25)

The Scientific-controls section is a single 4-column grid, shown only in
Scientific mode, in this fixed row order (20 controls, 5 full rows, no
partial row):

```text
RAD sin cos tan
x!  |x| log ln
x²  xʸ  √   ⁿ√
(   )   π   e
MC  MR  M+  M−
```

`(` and `)` here are the same controls as Basic mode's expression-controls
row (see Base Keypad and Expression Workflow) — Scientific mode does not
show both. **Revised by CFL-95** (pending Eldad's joint sign-off): this grid
now sits to the right of the base keypad rather than stacked above it, and
the memory-value readout (`M: <value>`) moved into the display itself
(top-left, mirroring the angle-mode indicator) rather than being a status
line below this grid. Row order and control set are unchanged.

## Future Information Controls

History and memory add no permanently reserved blank space.

- CFL-22 history: each entry displays an expression and result, can be
  reused, and clears independently. **Revised by CFL-95** (see that section):
  the toggle is now an icon opening a side panel (desktop) or an inline
  pushed-down region (narrow viewports), not a collapsible text button below
  the keypad.
- CFL-23 memory controls (`MC`, `MR`, `M+`, `M−`) live in Scientific mode. Any
  visible memory state is accessible; errors and `AC` do not silently erase it.
- CFL-27 logging adds no click-by-click UI.
- CFL-28 adds an `Export Logs` control that downloads JSON. Export success or
  failure uses inline status feedback and never exposes sensitive data.
  **Revised by CFL-95**: the control is now an icon in the header, not a text
  button below History.

## Accessibility and Responsive Rules

- Use semantic `button` elements, logical focus order, visible focus, and
  descriptive labels for symbols.
- Keep the display, error, status, toggle, angle mode, history, and memory
  state programmatically available to assistive technology.
- Communicate state with text or semantics, not color alone.
- Desktop keeps one constrained calculator surface. Mobile stacks or wraps
  scientific controls without horizontal page scrolling, clipping, or
  undersized targets.
- Keep touch targets approximately 48px high and preserve reduced-motion
  support if motion is introduced.

## Visual System

Use centralized tokens only:

```css
--color-background;
--color-surface;
--color-display;
--color-text-primary;
--color-text-secondary;
--color-number-button;
--color-operator-button;
--color-action-button;
--color-equals-button;
--color-error;
--color-focus;
```

Use the existing spacing scale: 4px, 8px, 12px, 16px, 24px, and 32px. Keep
equals visually prominent. No UI library, animation system, component-specific
palette, or fixed-position layout is authorized.

## Decisions

Resolved:

- **`0` is single width (supersedes the prior "`0` is double width" decision).**
  Decided by Gavi (2026-07-29) while working CFL-25: the double-width `0` was
  originally a visual preference, not a functional requirement; keeping every
  base-keypad button a uniform size was judged more important than that
  preference once the keypad needed to make room for `±` moving next to `0`.
  **Pending Eldad's joint sign-off per Design Control before permanent
  implementation** — recorded here as the proposed/agreed direction on
  Gavi's side, not yet a completed two-person approval.
- **Base keypad revision (CFL-25):** `±` moves from the top row (next to
  `AC`) to the bottom row (next to `0`); `%` moves from the
  Scientific-controls section into the vacated top-row slot. The base
  keypad is now identical in Basic and Scientific mode — the alternative of
  a Scientific-only reordering was considered and rejected because it would
  have made the "permanent" base keypad mode-dependent, a bigger rule
  conflict than a single universal revision. **Pending Eldad's joint
  sign-off**, same as above.
- **Scientific-controls grid is one 4-column, 5-row grid, `(`/`)` included
  (CFL-25):** replaces the previous separate 2-column expression-controls
  row _within Scientific mode only_ — see Scientific-Controls Grid Order.
  20 controls divide evenly at 4 columns with no partial row; 5 and 6
  columns were also compared (see CFL-25 QA/PR evidence) and rejected: 5
  columns is also numerically even but splits the 4-item thematic groupings
  awkwardly, and 6 columns does not divide 20 evenly at all. Basic mode's
  own expression-controls row (`(`/`)` only) is unchanged by this. **Pending
  Eldad's joint sign-off**, same as above.
- The calculator has a visible header.
- Scientific mode is the approved Basic / Scientific toggle on one shared
  calculator surface.
- Active-operator highlighting is obsolete.
- CFL-24/CFL-70 scientific keyboard shortcuts (approved by both Gavi and
  Eldad): bare letter/symbol keys, active only in Scientific mode since
  their controls are only visible there — `s`/`c`/`t` sin/cos/tan, `l`/`n`
  log/ln, `r` square root, `u` nth root, `^` power, `!` factorial, `%`
  percent, `p`/`e` constants, `d` toggles DEG/RAD. No shortcut for `x²`
  since `^` then `2` already produces the same token. Memory shortcuts
  (MC/MR/M+/M−) are intentionally excluded from this pass — not part of
  this control set. A `?` key (any mode) toggles a shortcuts-help panel
  listing all shortcuts. `Esc` while the panel is open closes the panel
  **only** — it does not also clear the expression in that same keypress.
  A second, separate `Esc` press (with the panel already closed) then
  clears, same as always. This is deliberate, not an oversight: the panel
  exists so a user can look something up mid-calculation (e.g. "what's the
  shortcut for π?") without losing their in-progress expression as a side
  effect of dismissing it. Collapsing "close panel" and "clear" into one
  keypress would make checking the help panel destructive for the exact
  case it's meant to serve. The panel is non-modal and never blocks
  interaction while open (per CFL-70's "focus is not trapped" AC), so nothing is lost by requiring the second press.
  **Updated by CFL-25:** `%` moved from the Scientific-controls section to
  the universal base keypad (see Base Keypad and Expression Workflow), so
  its keyboard shortcut is no longer Scientific-mode-gated either — it now
  works in both modes, consistent with the "shortcuts mirror what's on
  screen" principle this scheme was built on. All other scientific
  shortcuts in this list remain Scientific-mode-only, since their controls
  are still Scientific-only.
- Scoped exception to the "no fixed-position layout" rule below (approved
  by both Gavi and Eldad, CFL-24/CFL-70 only): the `?` shortcuts-help panel
  is a floating window (`position: fixed`), not in-flow. It does not
  capture focus, does not block interaction with the rest of the
  calculator while open, and uses only existing color/spacing tokens — no
  new UI library or backdrop/dimming layer. This exception does not extend
  to any other future panel; a new floating element still needs its own
  explicit joint approval.
- Second scoped exception to the "no fixed-position layout" rule (approved
  by both Gavi and Eldad, CFL-93/CFL-94 only): the parody cookie-consent
  banner is a floating, fixed-position element, shown once per session.
  It has a single "Accept" control and no other option — since there is
  nothing to actually consent to, accepting gates nothing and sets no
  state elsewhere in the app. Uses only existing color/spacing tokens, no
  new UI library or backdrop/dimming layer. This exception is scoped to
  this one banner, same as the CFL-24/CFL-70 shortcuts panel above; it
  does not extend to any other future panel.

Still open and not to be guessed:

- primary theme, final palette, and font family;
- final header/subtitle presentation;
- whether the previous-expression line is always displayed when empty.

## AI Rules

Before a UI change, read this document. Preserve the base keypad and
expression-controls row. Do not add a new layout, design system, library,
palette, typography choice, or future Feature behavior without the required
approval and owning Jira scope.
