---
title: CPU Profiler
layout: page
permalink: /debugger/cpuprofiler
description: A racing-the-beam view of where in the frame your code runs, coloured by rules you define.
---
# CPU Profiler

The profiler plots a whole frame of execution against the raster, reading back one full frame from the [CPU history](/debugger/cpuhistory) buffer. Each row is a scanline; the horizontal axis is time across that line. Every instruction from the history is drawn at the point in the frame it ran, so you can see which code runs on which raster line and how long it takes. It is the assembly equivalent of racing the beam.

Note: this can only be viewed while a debug session is active.

## How to open

Open the command palette and run `BitMagic: Open The CPU Profiler View`. See VSCode's [command documentation](https://code.visualstudio.com/api/extension-guides/command) to customise how you access it.

## Colouring rules

Pixels are coloured by a list of rules, each a **predicate** (a C# expression over the instruction) plus a colour. Rules are tried top to bottom; the first whose predicate matches wins. Until you add a rule, every pixel is coloured by address, the same as the `PC` built-in below.

Add a rule with `Add`, remove one with the bin icon next to it, and drag a rule by its handle to reorder the list. Click `Update` to apply your changes and redraw; `Fetch CPU Profile` just redraws with whatever rules are already applied.

Each rule has:

- a **predicate**: a C# expression using any of `PC`, `OpCode`, `RomBank`, `RamBank`, `A`, `X`, `Y`, `Params`, `Flags`, `SP`, `CpuY`, `Clock`;
- a **colour**, one of:
  - `Built In`: `PC` (colour by address) or `Op Code` (colour by opcode);
  - `Colour`: picked from a colour swatch, stored as hex, e.g. `#ff8800`;
  - `Custom RGB`: explicit R, G and B, each itself a C# expression over the same fields.

For example, a rule of `OpCode == 0xea` with a bright red `Colour` shows exactly where `nop`s are being executed across the frame.
