---
title: Expressions
layout: page
permalink: /compiler/expressions
description: "What you can put in a compiler expression: integer maths, bit operations, number formats and the byte operators."
---
# Expressions

Anywhere a directive or an opcode takes a value, you can give it an expression instead of a literal.

Expressions are parsed by [CodingSeb.ExpressionEvaluator](https://github.com/codingseb/ExpressionEvaluator) with a 65c02 extension. **The result has to be a whole number**, because the compiler needs an integer. A `char` becomes its byte value and a `bool` becomes `1` or `0`. Anything that evaluates to a fraction, so most `Math.*` functions and `/` where it would not divide evenly, is an error. For real logic and floating-point work, use the [Template Engine](/templateengine/).

What works:

- integer arithmetic: `+` `-` `*` `/` `%` (integer division, so `7 / 2` is `3`)
- bitwise: `&` `|` `~` `<<` `>>`
- comparison and logic: `==` `!=` `<=` `>=` `&&` `||` `!` (each gives `1` or `0`)
- the ternary `?:`
- character literals, so `'A'` is `65`
- [labels and constants](#referencing-constants), anywhere a number can go

## Number formats

| Form | Base | Example |
| ---- | ---- | ------- |
| `$` prefix | hex | `$9f20` |
| `0x` prefix | hex | `0x9f20` |
| `%` prefix | binary | `%1010_0000` |
| `0b` prefix | binary | `0b10100000` |
| plain | decimal | `40736` |

`_` may be used between digits as a separator. `%` before binary digits is a literal; between two values it is modulo.

## Byte operators

`<`, `>` and `^` are **redefined**. As a prefix, with nothing to their left, they pull one byte out of a value:

| Prefix | Returns | Example |
| ------ | ------- | ------- |
| `<` | Low byte, `value & $ff` | `<$123456` is `$56` |
| `>` | High byte, `(value & $ff00) >> 8` | `>$123456` is `$34` |
| `^` | Top byte, `(value & $ff0000) >> 16` | `^$123456` is `$12` |

This is the usual way to split an address:

{% include generated/expressions-byte-operators.html %}

A byte operator binds tightly, so `<target + 1` is `(<target) + 1`. Parenthesise for the other grouping: `<(target + 1)`.

Because these three symbols are taken as prefixes, use `<=` `>=` `==` `!=` for comparisons.

## Referencing constants

Labels and constants can be used in an expression:

{% include generated/expressions-referencing-constants.html %}

Names are resolved through the current [scope](/compiler/scope). A label name that is defined more than once is ambiguous and cannot be used here. See [Labels](/compiler/labels).
