---
title: Segment
layout: page
permalink: /compiler/segment
description: Segments are areas of memory that hold code or data and are optionally written to a file.
---

# Segment

A segment is a named region of memory that holds code or data, and can optionally be written to a file.

Every program has a `Main` segment. You can add more, anywhere in memory: a BSS-style block of uninitialised RAM, a zero-page area for hot variables, or several segments that share a RAM bank address.

A segment with no `filename` is fine as long as it holds nothing but reserved space. Give it code or initialised data with no filename and the build fails. Without a `maxsize` a segment grows freely; with one, overflowing it is an error.

## Main

`Main` is the segment every program starts in. It begins at `$0801`, where the X16 loads a BASIC program, and a program run from BASIC has to fit between there and the I/O area at `$9f00`.

Its output file is the source file's name with the extension changed to `.prg`, written with a two-byte load address at the front. `.endsegment` returns to `Main` from any other segment.

## Defining a segment

`.segment` opens a segment; naming one that already exists switches back to it.

| Name | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| `name` | string | no | The segment's name. Naming an existing segment switches to it, and any other parameters given are applied. |
| `address` | number | yes | Where it sits in memory. Settable only before the segment has any code or data. If omitted, it follows on from the current segment. |
| `maxsize` | number | yes | Maximum size. Overflowing it is an error. |
| `filename` | string | yes | File to write for this segment. |
| `scope` | string | yes | Default [scope](/compiler/scope) for the segment. A new one is created if not given. |

## Viewing segments

Set the `displaySegments` compile option to list every segment and its extent in the build output:

```text
Segment                   Start Size  End
Main                      $0801 $0145 $0946
```

## Examples

### A BSS area

Reserved RAM from `$400`, `$400` bytes long, with no file. On the X16 the `$400` to `$800` region is free for this, as is `$200` to `$3ff` if you are not using the KERNAL.

```bmasm
.segment BSS $400 $400
```

### Zero page

The zero page is where you keep your most-used variables. Here the segment runs from `$22` for up to `$5d` bytes, takes the scope `app_general`, and `_` skips the filename:

```bmasm
.segment ZP $22, $5d, _, app_general
```

### Several segments, one RAM bank

Addresses are always from the CPU's point of view, so segments destined for different RAM banks all start at `$a000`. It is up to you to page the right bank in before touching each one.

Define them together so the layout lives in one place:

```bmasm
.segment MUSIC $a000 $2000 MUSIC.BIN
.segment SNDFX $a000 $2000 SNDFX.BIN
```

The [template engine](/templateengine/csharp-blocks#header-directives) `!` prefix does the same from the top of the file. A `!` line runs in the template's setup phase, before the body, so every segment exists before any code that uses one:

```bmasm
!segment MUSIC $a000 $2000 MUSIC.BIN
!segment SNDFX $a000 $2000 SNDFX.BIN
```
