---
title: BM Library
layout: page
permalink: /templateengine/bm-library
description: The bundled BM template library for data tables, string bytes and the BASIC header.
---
# The BM Library

`BM` is a small library that ships with the debugger, in the `Library` folder beside it. It is a handful of convenience wrappers, nothing you couldn't write yourself with a `.byte` loop, but they save the boilerplate for the common cases: turning a C# sequence into a data table, and emitting the BASIC stub.

Import it at the top of a template and call its methods where you want the bytes:

```bmasm
import BM = "BM.bmasm";

.sine:
    BM.Bytes(Enumerable.Range(0, 256).Select(i => (int)(128 + 127 * Math.Sin(i * Math.PI / 128))))
```

Every method emits its assembly at the call site, so a `.byte` table appears exactly where you wrote the call.

## Tables

### BM.Bytes

```text
BM.Bytes(values, width = 16)
BM.Bytes(text)
```

Emits `.byte` lines, `width` values to a line, formatted as `$XX`. `values` is an `IEnumerable` of `int`, `sbyte` or `byte`; `int` and `sbyte` are truncated to a byte. The `text` overload emits one byte per character, using the raw character code with no encoding change.

### BM.Words

```text
BM.Words(values, width = 16)
```

Emits `.word` lines, little-endian, `width` values to a line. `values` is an `IEnumerable` of `ushort` or `short`.

### BM.HighBytes / BM.LowBytes

```text
BM.HighBytes(values, width = 16)
BM.LowBytes(values, width = 16)
```

Emit the high or low byte of each value as `.byte` lines. `values` is an `IEnumerable` of `int`, `ushort` or `short`. Use the pair to build split lookup tables, a run of low bytes and a matching run of high bytes, so you can index them with `lda lo,x` / `lda hi,x`:

```bmasm
.const count 32

.jump_lo:
    BM.LowBytes(Enumerable.Range(0, count).Select(i => targets[i]))
.jump_hi:
    BM.HighBytes(Enumerable.Range(0, count).Select(i => targets[i]))
```

## Strings

The string helpers do **no character-set translation** despite the names; the bytes are the source string's character codes.

### BM.Petscii

```text
BM.Petscii(text, addNullTermination = true)
```

Emits one byte per character of `text`, followed by a `0` unless you pass `addNullTermination: false`.

```bmasm
.message:
    BM.Petscii("HELLO WORLD")
```

### BM.IsoPetscii

```text
BM.IsoPetscii(text, addNullTermination = true)
```

As `BM.Petscii`, but each character in the range `$40` to `$5f` (`@` to `_`) is shifted down by `$40` first.

### BM.StringToPetscii

```text
BM.StringToPetscii(text, addNullTermination = true)
```

Returns those bytes as an `IEnumerable<byte>` rather than emitting them. Transform or filter it, or hand it to `BM.Bytes`.

## BASIC header

### BM.X16Header

```text
BM.X16Header()
BM.X16Header(label, invalidHeader = false)
```

Emits the tokenised BASIC line that makes `RUN` enter your machine code.

With no argument it emits `10 SYS 2061` in twelve bytes, so your first instruction has to sit at `$080d`, straight after the header:

```bmasm
import BM = "BM.bmasm";

    BM.X16Header()
.proc main          ; $080d
    rts
.endproc
```

Given a `label` it emits `10 SYS <label>` instead, so the entry point can be anywhere. Pass the label as a name, which the compiler resolves, or as a literal address:

```bmasm
    BM.X16Header("start")
    ; tables or setup here
.start:
    ; ...
```

The helper writes the address as exactly four decimal digits, so `label` must be below `10000` (`$2710`); a higher address is silently truncated and the `SYS` comes out wrong. `invalidHeader: true` drops the trailing two-byte end-of-program marker, leaving a ten-byte header.
