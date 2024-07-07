---
title: Segment
layout: page
permalink: /compiler/segment
---

# Segment

A segment is an area that is targeted to a location in memory and that optionally could be written as a file.

Every application must have at least one segment, typically this would start at `0x801` with a maximum length of `0x96fe` or 38,654 bytes.

An application can have segments anywhere else in memory, for example you can declare a segment that would traditionally be called the `BSS` area. On the X16 this would be from `0x400` to `0x800`. You can also use `0x200` to `0x3ff` if you do not want to use any kernel functionality.

If the segment only holds *uninitialised* memory then you can omit the filename. If a segment doesn't have a filename, but contains data be that code or initialised memory an error will be thrown at compile time.

## Main Segment

The Default segment defined for every application is called 'Main' and starts at `0x801`. The filename is set to the the name of the initial source file with a `.PRG` file extension.

## Definition

A segment can be defined in code using the `.segment` verb. Using a `.endsegment` will revert to the default 'Main' segment.

The following parameters are also available:

| Name | Optional | Type | Description |
| ---- | -------- | ---- | ----------- |
| `name` | false | string | The name of the segment. If the segment has already been declared, that current segment will switch to that one and any parameters will be used. |
| `address` | true | number | Location where the segment will be in memory. Can only be set before code or data has been added. If not set it will follow on from the previously defined segment. |
| `maxsize` | true | number | Maximum size for the segment. Will error if it overflows. |
| `filename` | true | string | Name of the file to write for this segment. |
| `scope` | true | string | Default scope for the segment. If not set a new scope will be created. |

## Examples

Here are a handful of examples to demonstrate how to define a segment.

### BSS Segment

To define a BSS segment which starts at `0x400` and is `0x400` bytes in length.

```asm
.segment BSS 0x400 0x400
```

### Ram Bank

You can define many segments that would be in a RAM Bank. As the address is always from the CPU point of view, they would all start at `0xa000`. Its up to the developer to ensure they are loaded and referenced correctly!

Because the current segment can be changed at anytime, its a good idea to define all the segments in one place like this:

```asm
.segment MUSIC $a000 $2000 MUSIC.BIN
.segment SNDFX $a000 $2000 SNDFX.BIN
```

### Zero Page

Use of the ZeroPage (or DataPage) is essential for any application. This can be declared as below, where the segment has the scope of 'app_general' and there is no file as `_` skips the parameter.

```asm
.segment ZP $22, $5d, _, app_general
```
