---
title: Labels
layout: page
permalink: /compiler/labels
description: Defining labels, using them in expressions, resolving repeated (ambiguous) labels with + and -, and naming an instruction's operand for self-modifying code.
---
# Labels

A label is a name for a point in your code or data. Use it as the target of a branch or jump, or in an [expression](#labels-in-expressions) like any other constant.

A label goes on its own line: a single word starting with `.` and ending with `:`, with nothing but whitespace before the `.`. A comment may follow the `:`; anything else on the line, an instruction included, is dropped without warning. To name the operand of an instruction instead, use an [operand label](#operand-labels).

{% include generated/labels-basic.html %}

A label belongs to the [scope](/compiler/scope) it is defined in, and forward references to it are resolved in a later pass. Labels are [private](/compiler/scope#public-and-private) to their scope: any code in the same scope can use a label, including one inside another procedure (`feed:loop`), but code in another scope can't. To use one from another scope, give it a public name with [`.export`](/compiler/scope#exporting-a-name). (For now, reaching in from another scope with `sound:feed:loop` still builds, with a warning.)

A forward reference resolves oddly if a global label already has the same name: it picks the global, not the local label defined later in the same scope (I've had one of these jump straight into BSS). Give a local label a unique prefix if the bare name might already exist elsewhere.

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

Unlike a named label, `.:` may share its line with an instruction. When it does, that label is never a match for its own line's `-` or `+`: `.: bne -` and `.: bne +` always search strictly before or after the current line, so they can't branch to themselves.

{% include generated/labels-anonymous.html %}

## Operand labels

An operand label names the operand bytes of an instruction rather than the instruction itself. It's the tidy way to write self-modifying code: the code keeps its value, or its address, inside the instruction, and you change it by writing to the label.

Write the name followed by `:` and a space, between the opcode and its operand. There's no leading `.`, and the space after the `:` is required; without it, `name:$1234` reads as a [qualified name](/compiler/scope) and the line fails to compile.

{% include generated/labels-operand.html %}

`source` is the address just past the `lda` opcode, where the operand's two bytes sit. The `sta`s before the loop point it at the message, and `inc source` steps it on a character at a time, so the `lda` itself does the reading without a zero page pointer.

An operand label belongs to the procedure it's in, like any other label, and can be used in an [expression](#labels-in-expressions): `source + 1` is the operand's high byte. It's private to its scope too, and takes no `public` or `private` keyword; [`.export`](/compiler/scope#exporting-a-name) gives it a public name, and the export keeps its `byte` or `ushort` type.

### How the type is chosen

An operand label is a variable as well as an address. Its type comes from the size of the operand, so the debugger shows its current value as a `byte` or a `ushort`, not just an address:

| Operand | Type | Addressing modes |
| --- | --- | --- |
| One byte | `byte` | Immediate, zero page, zero page indexed, the indirect zero page modes and branch offsets |
| Two bytes | `ushort` | Absolute, absolute indexed, `jmp` / `jsr` destinations and `jmp (abs)` |

{% include generated/labels-operand-types.html %}

### Naming a single byte with `<` and `>`

Put `<` or `>` in front of the name to label one byte of a two byte operand. Both are always a `byte`:

- `<name:` is the low byte, at the instruction plus 1.
- `>name:` is the high byte, at the instruction plus 2. On an instruction with a one byte operand it's a build error.

An instruction can carry several operand labels, so you can have the whole operand and each of its bytes at once:

{% include generated/labels-operand-bytes.html %}

An operand label on an instruction with no operand, such as `rts`, is a build error.
