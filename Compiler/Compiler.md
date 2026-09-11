---
layout: home
title: Compiler
permalink: /compiler/
description: The BitMagic compiler assembles .bmasm source into .prg or .bin files for the Commander X16.
---
# The Compiler

The compiler assembles `.bmasm` source into `.prg` or `.bin` files that run on the Commander X16.

It takes standard 6502 / 65c02 syntax. On top of that you can embed C# that runs at build time and writes assembly for you; that stage is the [Template Engine](/templateengine/), and it runs before the compiler sees the file.

## The three kinds of line

The template engine expands any embedded C# first. What reaches the compiler is three kinds of line:

- **An opcode.** Starts with a valid 6502 / 65c02 mnemonic, for example `lda #$00`.
- **A directive.** Starts with a `.`, for example `.segment` or `.const`. Directives set up structure, scopes, data and constants. A line that is just a word starting with `.` and ending with `:` is a [label](/compiler/labels).
- **A comment.** Starts with `;`.

## Comments

`;` starts a comment, whether it follows code on a line or sits on a line of its own. The compiler also accepts `//` on a directive line. On a C# line, use C# comment syntax.

{% include generated/compiler-comments.html %}

## Directives

A directive line starts with `.`. Parameters are positional, or given as `name=value` pairs:

{% include generated/compiler-directive-forms.html %}

The [Directives](/compiler/directives) page is the full list. The parts with more to them have their own pages: [Segments](/compiler/segment), [Scopes](/compiler/scope), [Labels](/compiler/labels) and [Expressions](/compiler/expressions).
