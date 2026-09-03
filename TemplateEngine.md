---
layout: home
title: Template Engine
permalink: /templateengine/
description: The template engine embeds C# in .bmasm source to generate assembly before it is compiled.
---
# The Template Engine

The template engine lets you embed C# in a `.bmasm` file. The C# runs at build time and its output is assembly, which is then handed to the [compiler](/compiler/). It replaces the macro language a traditional assembler gives you with the whole of C#, and it is where most of the power in BitMagic comes from.

Every BitMagic build runs this stage first. The debugger passes your source through `CsasmEngine` before anything is assembled, so templating is always available rather than an opt-in.

## How a line is read

Each line of a `.bmasm` file is emitted as **assembly** if it is:

- a 6502 or 65c02 opcode, optionally with operands, such as `lda #$00` or `bra loop`;
- a line starting with `.` or `;`, meaning a [directive](/compiler/directives), [label](/compiler/labels) or comment.

**Any other line is C#.** So `for (var i = 0; i < 8; i++)`, `{`, `}` and `var x = …` are just run.

## Splicing values in

- `@(expression)` anywhere on an assembly line inserts the value of a C# expression.
- A line that is `@expression` on its own emits whatever that expression returns.

```bmasm
for (var i = 0; i < 4; i++)
{
    lda #@(i)
    sta $0400 + @(i)
}
```

generates

```asm
lda #0
sta $0400 + 0
lda #1
sta $0400 + 1
lda #2
sta $0400 + 2
lda #3
sta $0400 + 3
```

## Seeing the output

Right-click a `.bmasm` file, in the explorer or the editor, and choose **Show BitMagic Generated Code**. This opens the assembly the template produced as a read-only `.generated.bmasm` document.

## More

- [C# blocks](/templateengine/csharp-blocks): loops, helpers, and the header directives (`import`, `include`, `using`, `nuget`, `library`).
- [The BM library](/templateengine/bm-library): the bundled helpers for data tables, strings and the BASIC header.

Debugging generated lines is covered under the debugger, in [Multiline Template Code](/debugger/multiline-template-code).
