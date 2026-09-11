---
title: Directives
layout: page
permalink: /compiler/directives
description: "Reference for every .bmasm compiler directive: machine, segments, scopes, constants, data and debugging."
---
# Directives

Every directive starts with a `.`. Parameters are positional in the order shown, or given as `name=value` pairs. A lone `_` skips a positional parameter.

{% include generated/directives-segment-forms.html %}

## Types

The type is not a type in any real sense. The compiler never checks it, and it plays no part in expressions, where a name always resolves to a plain address or value. It is used for two things only: reserving the right number of bytes, and telling the debugger how to show the variable (its size, whether it is an array, whether it is a pointer).

`.var`, `.constvar` and `.padvar` take a type. The base types are:

| Type | Size | Meaning |
| ---- | ---- | ------- |
| `byte` / `sbyte` | 1 | Unsigned / signed 8-bit value. |
| `short` / `ushort` | 2 | Signed / unsigned 16-bit value. |
| `int` / `uint` | 4 | Signed / unsigned 32-bit value. |
| `long` / `ulong` | 8 | Signed / unsigned 64-bit value. |
| `string` | *n* | A run of bytes, one per character. |
| `proc` | 2 | The address of a procedure. |
| `ptr` | 2 | A bare 2-byte address, with no target type. |

**Arrays** put the count in square brackets. `byte[16]` is sixteen bytes; `int[4]` is four 32-bit values; `string[10]` is a fixed ten-byte string.

**Pointers** are the word `ptr` after a type: `byte ptr`, `ushort ptr`, `string ptr`. A pointer is always a 2-byte word holding the address of a value of that type.

{% include generated/directives-typed-pointers.html %}

Array and pointer combine, with the bracket first: `byte[16] ptr` is an array of sixteen `byte` pointers (32 bytes), not one pointer to a sixteen-byte block. Put `ptr` before the bracket and the bracket is ignored.

## Segments

See [Segment](/compiler/segment) for the full picture.

### .segment

| Parameter | Type | Optional | Description |
| --------- | ---- | -------- | ----------- |
| `name` | string | false | Segment name. If it already exists, switches to it and applies any other parameters given. |
| `address` | number | true | Start address. Only settable before the segment has data; can't be changed once set explicitly. If omitted, follows on from the current segment. |
| `maxsize` | number | true | Maximum size. The compiler errors if the segment grows past this. No limit if omitted. |
| `filename` | string | true | File to write for this segment. |
| `scope` | string | true | Default scope for the segment. A new scope is created if not given. |

{% include generated/directives-segment.html %}

### .endsegment

No parameters. Switches back to the `Main` segment and the `Main` scope.

## Scopes and procedures

See [Scope](/compiler/scope) for how names are resolved.

### .scope

| Parameter | Type | Optional | Description |
| --------- | ---- | -------- | ----------- |
| `name` | string | true | Scope name. If omitted, an anonymous name is generated. |

Opens a named constant scope. Scopes are a flat namespace under `App`; they do not nest.

### .endscope

No parameters. Returns to the enclosing procedure's scope.

### .proc

| Parameter | Type | Optional | Description |
| --------- | ---- | -------- | ----------- |
| `name` | string | true | Procedure name. If omitted, an anonymous name is generated. |

A named block with its own scope and an entry-point constant of the same name, so `jmp myproc` works. Procedures **can** be nested: a `.proc` inside a `.proc` becomes a child of it.

{% include generated/directives-proc.html %}

### .endproc

No parameters. Closes the current procedure and adds an `endproc` constant pointing just past its code, useful for placing data after it.

## Constants and variables

### .const

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `name` | string | Constant name. |
| `value` | expression | Value. See [Expressions](/compiler/expressions). |

Defines a named constant. A single line can define several:

{% include generated/directives-const.html %}

### .var

| Parameter | Type | Optional | Description |
| --------- | ---- | -------- | ----------- |
| `type` | type | false | See [Types](#types). |
| `name` | string | false | Variable name. |
| `value` | expression | true | Initial value. Defaults to `0`. |

A way to put typed data into the segment. It reserves space for the variable **and writes its initial value**, then advances the segment write position past it.

{% include generated/directives-var.html %}

### .constvar

| Parameter | Type | Optional | Description |
| --------- | ---- | -------- | ----------- |
| `type` | type | false | See [Types](#types). |
| `name` | string | false | Name. |
| `value` | expression | true | Address the pointer holds. Defaults to `0`. |

Defines a typed constant that points at an address: a typed alias for a fixed location, such as a hardware register or a zero-page slot. No data is written.

{% include generated/directives-constvar.html %}

### .padvar

| Parameter | Type | Optional | Description |
| --------- | ---- | -------- | ----------- |
| `type` | type | false | See [Types](#types). |
| `name` | string | false | Name. |

Reserves space for a typed variable and advances the segment write position by its size, but writes **no** data. It is for uninitialised storage, so it belongs in a segment with no filename (a BSS area), where you are only carving RAM into named slots rather than producing bytes for a file. Using it in a segment that is written to disk would pad the file with blank bytes.

{% include generated/directives-padvar.html %}

## Segment layout

### .org

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `address` | number | Address to advance the write position to. |

Moves the segment write position forward to `address`. Errors if the position is already past it.

{% include generated/directives-org.html %}

### .pad

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `size` | number | Number of bytes to skip. |

Advances the write position by `size` bytes.

{% include generated/directives-pad.html %}

### .align

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `boundary` | number | Alignment boundary. |

Advances the write position until it is a multiple of `boundary`.

{% include generated/directives-align.html %}

## Data

### .byte

Emits one or more bytes.

{% include generated/directives-byte.html %}

### .word

Emits one or more 16-bit words, little-endian.

{% include generated/directives-word.html %}

### .code

Emits raw bytes exactly like `.byte`. The output is identical; the difference is how the debugger treats them. `.code` bytes are disassembled as instructions, `.byte` bytes are shown as data.

Use it when you are producing instruction bytes directly rather than writing mnemonics: opcodes emitted by a [template](/templateengine/), a hand-encoded instruction, or a patch table the CPU will jump into. Anything that gets executed should be `.code` or a normal opcode line, so that stepping and the disassembly view line up.

{% include generated/directives-code.html %}

## Debugging directives

These affect a debug session, not the output binary.

### .breakpoint

No parameters. Sets a breakpoint on the next line, the same as clicking the gutter there.

### .stop

No parameters. Marks the next line as a place the debugger may stop while stepping. Use it inside a `.nostop` block to poke a hole where you do want to land.

### .nostop

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `enabled` | bool | `true` to start skipping, `false` to stop. |

Turns "don't stop here" on or off for the lines that follow. While it is on, stepping runs through those lines without landing on them, except where a `.stop` says otherwise. Useful for wrapping boilerplate or a macro's output.

### .exception

No parameters. Raises a debugger exception at this point, so an exception breakpoint can catch it. Use it to flag an error path.

### .debugload

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `filename` | string | The file whose debug info to apply. |
| `address` | number | Where that file now sits in memory. |

Tells the debugger that your program has loaded `filename` into memory at `address`, so it applies that file's symbols and source map there. It does not load the file.

The debugger picks up files loaded through the KERNAL on its own. `.debugload` is for the cases it can't see: a program that loads code with its own SD-card routine, a custom loader, or a copy from a cartridge. Put it on the line after the load has finished.

### .debugalias

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `type` | type | See [Types](#types). |
| `name` | string | The name to show in the debugger. |
| `value` | source | Where the value lives: a memory address or a CPU register. |

Adds a named variable to the debugger, of the given `type`, read from `value`. Nothing is emitted into the binary.

`value` is a source, not a number: it points at something the machine already holds and gives it a meaningful, typed name. The name follows the same [scope](/compiler/scope) rules as a label or constant, so a `.debugalias` inside a `.proc` belongs to that proc.

### .map

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `filename` | string | Source file to point at. |
| `line` | number | Line within that file. |

Redirects the source map for the following line to `filename` and `line`, so a stepped instruction jumps to the original source rather than the generated file. The [Template Engine](/templateengine/) emits this; it is not normally written by hand.
