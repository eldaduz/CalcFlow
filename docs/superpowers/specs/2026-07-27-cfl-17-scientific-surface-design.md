# CFL-17 Scientific Surface Design

**Approved:** Basic / Scientific toggle; one shared calculator surface.

Scientific controls appear above the existing expression controls and base
keypad. All controls use the existing editable expression, display, equals,
inline-error, and recovery path. CFL-17 owns only powers and roots; contracts
for logarithms, trigonometry, angle mode, additional operations, history,
memory, keyboard expansion, responsive behavior, accessibility, logging, and
export are documentation only.

CFL-17 expression contract: `^` is exponentiation, `x²` appends `^2`, prefix
`√` is square root, and infix `√` is nth root (`degree√radicand`). Domains stay
in real numbers and failures are controlled inline errors.
