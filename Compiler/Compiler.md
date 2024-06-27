---
layout: home
title: Compiler
permalink: /compiler/
---
# BitMagic - The Compiler

**Please note the documentation is a currently a work in progress while the old docs are brought up to date.**

The Compiler can compile assembly code `.bmasm` text files into `.prg` or `.bin` files which can be used by the Commander X16.

## 65c02 Syntax

The compiler accepts standard 6502\65c02 syntax.

It is enhanced by macros written in c#. These can be used like macros in those in other assemblers to generate code before it is compiled. Please see the [Template Engine](TemplateEngine.md) section for more details.

For 65c02 code, each line can either start with a valid opcode or start with a period to denote a compiler instruction. Otherwise it is assumed to be part of a C# macro.

Compiler instructions are how we define the structures, scopes or set other functionality for the compiler.

## Comments

BitMagic uses `;` to define the start of a comment if the line starts with a `.` or a 65c02 opcode. Otherwise as the line is C#, it will define the end of a command as is normal for that syntax.

## Compiler Instructions

Labels are single words which start with `.` and end with a `:`. There can't be anything before the first period, but commends are allowed after the colon. Opcodes are not allowed after the label definition. See [label](#labels) for more information.

The instructions supported are below with their parameters defined in the table below.

The parameters can either be name value pairs, or entered in order that they are in the table. For example:

```bmasm
.const name=example, value=$1234
.const example $1234
```

| Verb | Description | Parameters |
| ---- | ----------- | ---------- |
| machine | Set the machine the code is for. This will typically set global variables such as the VERA register names. | _name_ |
| segment | Area of memory which will be used, or written to a specific file. | _name_, _address_, _maxsize_, _filename_ |
| endsegment | End of the current segment, sets the segment back to _default_. | |
| scope | Scope block for defining variables or constants. | _name_ |
| endscope | End of the scope, sets the scope back to _default_. | |
| proc | A defined range with a defined entry point and which its own scope. | _name_ |
| endproc | End of the procedure, sets the procedure back to _default. | |
| const | Defines a constant named value. | _name_, _value_ |
| constvar | Defines a constant pointer to a defined variable. | _type_, _name_, _value_ |
| var | Allocates a area within the segment for a variable. | _type_, _name_, _value_ |
| org | Pad the segment to a given address. | _address_ |
| pad | Pad the segment with the specified number of bytes. | _size_ |
| padvar | Pad the segment with an variable of the specified type. | _type_, _name_ |
| align | Pad the segment to the given alignment. | _boundary_ |
| insertfile | Insert a file into the source file. Inserted post macro processing. | _filename_ |
| byte | Insert one or more bytes into the segment. | _...data..._ |
| word | Insert one of more words into the segment. | _...data..._ |

### Segments

In BitMagic a segment is an area of ram which can hold code or variable definitions and optionally be written to a file.

The default segment called `Main` starts at $801 and will be written to a `.prg` file with the same name as the source file.

If a segment has code defined, but no filename, you will receive a compiler error. You can however have a segment defined with only 'variables', for example useful for defining variable locations within the ZP.

A segment can be defined with a maximum size to ensure it is constrained within the correct bounds. For example:

```asm
.segment ZP $02 $fd
```

The segments in your application can be viewed in the compiler output by setting `DisplaySegments` compiler option. For example:

```text
Segment                   Start Size  End
Main                      $0801 $0145 $0946
```

### Scopes

Scopes are to provide constant separation to avoid collisions. As they don't define something that is output, the scopes are not defined at a segment or procedure level. You can switch scope as you want to access or separate different constants.

In normal operation there is a set scope hexarchy of `App:Main:Proc:Constant`, for example:

```bmasm
.proc test
.const something $1234
.endproc
```

In this case `something` can be thought of as `App:Main:test:something`. The `:` is a separator between the different levels of the hierarchy. As procedures can't be nested, this hierarchy will always hold true unless the `scope` keyword is used.

When a custom scope is defined it is considered to be global, so will sit under `App`. (App is the global scope, where machine constants can be placed.)

Note, the current scope is always closed with a `.endproc`.

This can better be explained with an example:

```bmasm
.proc test
    .const something $12
    lda #something              ; $12

    .scope newscope
        .const something $34
        lda #something          ; $34
    .endscope

    lda #something              ; $12
    lda #newscope:something     ; $34
    lda #App:newscope:something ; $34
.endproc
```

### Scope Lookup Precedence

To find a constant BitMagic uses the current scope as the highest level of precedence, this is either the scope itself or at a proc level.

If no match, it will move up to the parent and then check the child scopes for an exact match which includes the full scope string.

If no match, it will perform the same operation at the parent scope.

### Labels

Labels are defined points in memory, which help the programmer with process flow with branching or jump instructions. Although they can be used with any opcode as part of an [expression](#expressions).

When defined they are included within their current scope.

For example the following code is valid:

```bmasm
.byte $00
.loop:
    inc loop-1
    bne loop        ; will loop 256 times
```

#### Ambiguous Labels

Labels are special in that they can be defined multiple times to allow us to use them as ambiguous references. These are specifically intended for flow control.

If there are more than one label of the same name, when referencing them you will need to add a prefix of either `-` or `+` for the direction in which the compiler should look for the correct one. Multiple prefixes can be used.

Ambiguous labels cannot be used in expressions.

For example

```bmasm
.loop:          ; A
    ...
.loop:          ; B

    bne -loop   ; jumps to B
    bne --loop  ; jumps to A
    bne +loop   ; jumps to C
    bne ++loop  ; jumps to D
    bne loop    ; will error

.loop:          ; C
    ...
.loop:          ; D
``````

## Expressions

Both the compiler and the [Template Engine](TemplateEngine.md) support expressions. For the compiler, the expression syntax is based on the C# syntax with a few extensions. It is also more limited in what it supports, so its probably best to keep it to basic maths or similar.

As well as the standard functions the following have been added:

| Operator | Explanation | Example |
| -------- | ----------- | ------- |
| `<` | Return the low byte from the value | `<$123456` returns `$56` |
| `>` | Return the high byte from the value | `>$123456` returns `$34` |
| `^` | Return the top byte from the value | `^$123456` returns `$12` |

### Referencing Constants

Constants such as labels or defined constants can be used within expressions, for example

```bmasm
    lda data + 3 ; loads $13 into the accumulator
    stp

.data:
    .byte $00, $11, $12, $13, $14
```

Constants are of course bound by their [scope](#scopes).
