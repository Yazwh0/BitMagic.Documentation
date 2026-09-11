---
title: Labels
layout: page
permalink: /compiler/labels
description: Defining labels, using them in expressions, and resolving repeated (ambiguous) labels with + and -.
---
# Labels

A label is a name for a point in your code or data. Use it as the target of a branch or jump, or in an [expression](#labels-in-expressions) like any other constant.

A label goes on its own line: a single word starting with `.` and ending with `:`, with nothing but whitespace before the `.`. A comment may follow the `:`; anything else on the line, an instruction included, is dropped without warning.

{% include generated/labels-basic.html %}

A label belongs to the [scope](/compiler/scope) it is defined in, so a label inside a `.proc` is private to that procedure. Forward references are fine; the compiler resolves them in a later pass.

## Labels in expressions

As long as a label is defined only once, it can be used in an [expression](/compiler/expressions) like any other constant:

{% include generated/labels-in-expressions.html %}

`loop-1` is the address of the `.byte` just before the label. `inc loop-1` bumps that byte each pass, and `bne loop` keeps going until it wraps back to zero.

## Repeated labels

The same label name can be defined more than once. This is meant for flow control. A repeated label cannot be used in an expression, and using its bare name is an error because it is not unique.

To reference one, prefix it with `+` or `-` for the direction to search, relative to the current line:

- `-name` is the nearest `name` at or before this line.
- `+name` is the nearest `name` at or after this line.

Repeat the prefix to step further: `--name` is the second match backwards, `++name` the second forwards.

{% include generated/labels-repeated.html %}

## Anonymous labels

A label with no name, just `.:`, is an anonymous label. Reference the nearest one with a bare `-` or `+` (no name), following the same direction and repeat rules.

Unlike a named label, `.:` may share its line with an instruction:

{% include generated/labels-anonymous.html %}

