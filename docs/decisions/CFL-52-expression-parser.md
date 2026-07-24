# CFL-52: Expression Parser Decision

## Decision

CalcFlow will use a native tokenizer and recursive-descent evaluator for the
initial expression grammar. No parser package will be added.

The evaluator will accept only calculator expressions, never JavaScript. It
must not use `eval`, `Function`, dynamic imports, identifiers, member access,
assignments, function calls, or implicit multiplication.

## Scope

The first grammar supports decimal numbers, unary `+` and `-`, binary `+`,
`-`, `*`, and `/`, and parentheses. The evaluator consumes canonical ASCII
operator tokens. CFL-14 may translate display glyphs such as `×`, `÷`, and
`−` into those tokens at its UI boundary.

```text
expression  := term (("+" | "-") term)*
term        := unary (("*" | "/") unary)*
unary       := ("+" | "-") unary | primary
primary     := number | "(" expression ")"
number      := DIGITS ("." DIGITS?)? | "." DIGITS
```

Binary operators are left-associative. Unary signs are accepted before a
number or parenthesized expression. Implicit multiplication (`2(3)`),
scientific notation, powers, functions, variables, and assignments are not
part of CFL-16.

To keep browser evaluation bounded, the evaluator will reject source longer
than 512 characters or parenthesis nesting deeper than 32 levels. It will use
JavaScript `Number` semantics and return a controlled error for division by
zero or a non-finite result.

## Public Contract

`evaluateExpression(source)` will return one of:

```js
{ ok: true, value: number }
{ ok: false, error: { code: string, message: string } }
```

Expected validation failures are values, not uncaught exceptions. Codes cover
empty input, invalid characters or numbers, incomplete expressions, unmatched
parentheses, division by zero, excessive length, excessive nesting, and
non-finite results. CFL-14 will display the supplied concise message in the
approved inline error region and clear it after valid input or reset.

## Alternatives Considered

| Option                               | Correctness and security                                                                                 | Maintenance and team understanding                          | License and bundle impact             | Decision |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------- | -------- |
| Native tokenizer + recursive descent | Allows exactly the supported grammar and no executable JavaScript surface                                | Small, readable code owned by the team                      | No dependency or bundle cost          | Selected |
| `jsep` + CalcFlow evaluator          | Parses an AST but also accepts broader JavaScript-like syntax that must still be rejected                | Adds a dependency while CalcFlow still writes the evaluator | MIT; small package                    | Rejected |
| `mathjs` expression evaluator        | Mature but intentionally supports functions, variables, units, matrices, and a wider expression language | More capability and configuration than CFL-16 needs         | Apache-2.0; significant bundle impact | Rejected |
| `expr-eval`                          | Does not meet CalcFlow's safety bar for untrusted expression input                                       | Stale release line and security risk                        | MIT; no dependency will be added      | Rejected |

`jsep` documents a tiny AST parser under MIT. `mathjs` documents both a broad
expression language and its security/stability considerations. `expr-eval`
version 2.0.2 is affected by CVE-2025-12735. Sources reviewed on 2026-07-24:

- https://ericsmekens.github.io/jsep/
- https://mathjs.org/docs/expressions/security.html
- https://mathjs.org/download.html
- https://nvd.nist.gov/vuln/detail/CVE-2025-12735

## Consequences

The initial implementation is small, dependency-free, and directly testable.
Later scientific Features can extend the tokenizer and grammar only through a
new approved parser decision and tests; they must not widen the accepted input
silently.
