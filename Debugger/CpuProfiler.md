---
title: CPU Profiler
layout: page
permalink: /debugger/cpuprofiler
description: A racing-the-beam view of where in the frame your code runs, coloured by rules you define.
---
# CPU Profiler

The profiler plots a whole frame of execution against the raster. Each row is a scanline; the horizontal axis is time across that line. Every instruction from the [CPU history](/debugger/cpuhistory) is drawn at the point in the frame it ran, so you can see which code runs on which raster line and how long it takes. It is the assembly equivalent of racing the beam.

Note: This can only be viewed while there is an active debugging session.

## How to open

Open the command palette and select **Open The CPU Profiler View**. It reads back one full frame from the history buffer.

## Colouring rules

Pixels are coloured by a list of rules you define. Each rule is a **predicate** (a C# expression over the instruction) plus a colour. Rules are tried in order.

The predicate can use these fields of the instruction: `PC`, `OpCode`, `RomBank`, `RamBank`, `A`, `X`, `Y`, `Params`, `Flags`, `SP`, `CpuY`, `Clock`.

The colour is one of:

- a built-in: `PC` (colour by address) or `Op Code` (colour by opcode);
- a CSS colour, e.g. `#ff8800` or `orange`;
- explicit R, G, B, each itself a C# expression over the same fields.

For example a rule of `OpCode == 0xea` coloured bright red shows exactly where `nop`s are being executed across the frame.

The default rule matches everything (`true`).
