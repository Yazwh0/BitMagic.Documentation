---
layout: home
title: Debugger
permalink: /debugger/
description: Debug the X16 inside VSCode. Launch a project, step, and inspect machine state.
---
# The Debugger

[![Build](https://github.com/Yazwh0/BitMagic/actions/workflows/build-test.yml/badge.svg)](https://github.com/Yazwh0/BitMagic/actions/workflows/build-test.yml)

You can debug your applications from within VSCode, like you would any modern language. Because we use VSCode to provide the IDE, it means we can leverage the interface to provide the best developer experience possible.

## Host System Compatibility

The machine must have a x64 CPU, as the underlying emulator is written in x64 assembler.

Windows is *beta*.

Linux is *beta*. Tested using Ubuntu.

Apple devices are not supported but if it's x64 based it *might* work. Try overriding the system check via VSCode's settings menu and let me know!

## Installation

Get the extension from the VSCode marketplace by searching for `BitMagic`.

By default it downloads its own copy of the .NET runtime and the official emulator. Both can be overridden in the settings.

## Getting started

Run **Create BitMagic Project** from the command palette to scaffold a project, then press `F5`. The full walkthrough is in [Getting Started](/getting-started).

A launch config is `type: bmasm`, with `program` pointing at your `project.json`:

```json
{
    "type": "bmasm",
    "request": "launch",
    "name": "Debug Application",
    "program": "${workspaceFolder}/project.json",
    "stopOnEntry": false,
    "cwd": "${workspaceRoot}"
}
```

An empty `project.json` (`{}`) is valid and boots to the BASIC prompt.

![Debugger Running](/Images/DebuggerRunning.png)

## What a session gives you

[Debugging](/debugger/debugging) covers the core: stepping, the breakpoint types, disassembly, the memory hex editor and jump-to-cursor. Set it up with a [project file](/debugger/projectfile).

## The debugger views

While a debug session is active BitMagic adds several views, each opened from the command palette:

- [Watches and Breakpoints](/debugger/watchesandbreakpoints): expressions, conditional and hit-count breakpoints, logpoints.
- [CPU History](/debugger/cpuhistory): recent CPU operations.
- [Memory Viewer](/debugger/memoryview): a visualisation of RAM reads, writes and execution, plus a value search.
- [Layer Viewer](/debugger/layerviewer): what each VERA layer is rendering.
- [Sprite Viewer](/debugger/spriteviewer): all 128 sprites and their attributes.
- [CPU Profiler](/debugger/cpuprofiler): where in the frame your code runs, coloured by rule.
- [Multiline Template Code](/debugger/multiline-template-code): debugging code generated from a macro string.

For a cc65 build instead of `.bmasm` source, see [cc65 Projects](/debugger/cc65).
