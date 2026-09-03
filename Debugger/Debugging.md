---
title: Debugging
layout: page
permalink: /debugger/debugging
description: "What a BitMagic debug session gives you: stepping, breakpoints, disassembly, memory and goto."
---
# Debugging

Once a session is running (`F5`), BitMagic behaves like any other VSCode debugger. This page covers what the debug adapter supports; the panels it adds are listed on [The Debugger](/debugger/).

## Launch configuration

A `type: bmasm` launch config takes:

| Property | Description |
| -------- | ----------- |
| `program` | Path to a `.bmasm` file or a `project.json`. `${workspaceFolder}/${command:AskForProgramName}` prompts for a file (default `main.bmasm`); the scaffolded config points straight at `project.json`. |
| `stopOnEntry` | Stop as soon as the machine starts. |
| `cwd` | Working directory. |
| `debugArgs` | Extra arguments passed through to the debugger's emulator, the same flags as the [standalone emulator](/emulator#command-line). For example `["--warp"]`. |

## Build errors

If a build fails, the compiler's errors appear as problems in the editor (a red marker on the offending line and an entry in the Problems panel), with the full log in the **BitMagic** output channel.

## Stepping

Continue, step over, step into and step out all work against your `.bmasm` source lines. Where a line generated multiple instructions, stepping walks the instructions.

## Breakpoints

- **Source breakpoints**: click the gutter next to a line.
- **Conditional**, **hit-count** and **logpoints**: see [Watches and Breakpoints](/debugger/watchesandbreakpoints).
- **Function breakpoints**: break when a named procedure or label is entered.
- **Instruction breakpoints**: set in the disassembly view.
- **Exception breakpoints**: break on an exception raised by the [`.exception`](/compiler/directives#debugging-directives) directive.
- **Startup breakpoints**: the `breakpoints` array in the [project file](/debugger/projectfile#properties) is a list of line numbers to break on as soon as the machine starts.

## Disassembly

Open the disassembly view to step through raw instructions, including ROM code. Symbols from the [`symbols`](/debugger/projectfile#symbols) files and jump tables are applied, so KERNAL calls show by name.

## Memory

The Variables pane exposes `CPU.Ram`, `VERA.VRam`, the RAM and ROM banks, and the SD card as memory blocks. VSCode's hex editor can open any of them, and memory is writable while paused.

## Jump to cursor

"Run to cursor" and setting the next statement are supported; the CPU's `PC` is moved to the chosen line.

## Not available

Data breakpoints (break on a memory write) and editing a value directly in the Variables pane are not currently supported.

## Running in the official emulator

The command **Run Project In The Official Emulator** builds the project and runs it in the official X16 emulator instead of BitMagic's. This is useful for checking behaviour against the reference implementation. It needs the official emulator, which the extension can download for you (see [Settings](/settings)).
