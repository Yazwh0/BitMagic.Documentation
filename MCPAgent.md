---
layout: page
title: MCP Agent
permalink: /mcpagent
description: Let an AI coding agent drive a BitMagic debug session directly, via an MCP server.
---
# MCP Agent

X16M is an MCP server that lets an AI agent, Claude Code or any other MCP client, drive a BitMagic debug session itself: launching a project, setting breakpoints, stepping, and inspecting memory, the same way VSCode does via `BitMagic.X16Debugger`.

## What it's for

Normally you run the debugger and describe what you see to an agent. X16M lets the agent drive the session directly instead. Ask it in plain English to launch a project, set a breakpoint on a line, and report back what a variable holds once it's hit; it picks the right calls itself.

X16M doesn't modify or depend on the debugger's internals. It speaks the Debug Adapter Protocol (DAP) to `X16D`, either spawning it as a child process (stdin/stdout, exactly as VSCode does) or connecting over TCP to one already running with `--dapport`, and re-exposes a subset of DAP as MCP tools.

## Download

Get the latest build: [Windows](https://github.com/Yazwh0/BitMagic/releases/download/latest/BitMagic-TheMCP.Windows.zip) or [Linux](https://github.com/Yazwh0/BitMagic/releases/download/latest/BitMagic-TheMCP.Linux.tar.gz). It bundles a copy of `X16D` alongside it, so there's nothing else to configure beyond a [ROM](/emulator/rom).

Alternatively, clone the repository and build `BitMagic.X16MCP/X16M`.

## Registering it with an MCP client

For Claude Code, register X16M with the CLI rather than a project `.mcp.json`, since the path to its executable is machine-specific. `--scope local` registers it for the current project only:

```bash
claude mcp add x16m --scope local -- <path-to-X16M.exe>
```

Use `--scope user` instead to make it available in every project on this machine, rather than registering it project by project:

```bash
claude mcp add x16m --scope user -- <path-to-X16M.exe>
```

Other MCP clients typically want the equivalent of a `.mcp.json` entry:

```json
{
  "mcpServers": {
    "x16m": {
      "command": "<path-to-X16M.exe>"
    }
  }
}
```

By default X16M runs the bundled copy of `X16D` next to its own executable. Point it at a different debugger build with `--x16d <path-to-X16D.exe>`, or connect to one already running with `--dapport` via `--x16d-host`/`--x16d-port`.

If you already have the VSCode extension installed, you don't need a separate copy of `X16D` at all: point `--x16d` at the same one it uses. Its location is the [`bitMagic.debugger.path`](/settings#debugger) setting (or `bitMagic.debugger.alternativePath`, if you've set one), so X16M drives the exact debugger build VSCode does.

## Available tools

This first slice covers standard DAP only. X16-specific requests, sprites, palette, layers, CPU history and the CPU profiler, aren't wired up yet.

| Tool | Description |
| ---- | ----------- |
| `launch_project(projectPath)` | Launches a project's `.json` file, or a `.bmasm` file directly. |
| `set_breakpoints(file, lines[])` | Sets breakpoints on the given lines of a file. |
| `continue_execution()` | Resumes a paused session. |
| `step_over()` | Steps over the current line. |
| `step_into()` | Steps into a call on the current line. |
| `step_out()` | Steps out of the current function. |
| `get_stack_trace()` | Returns the current call stack. |
| `evaluate(expression)` | Evaluates an expression in the current scope. |
| `disassemble(memoryReference, instructionCount)` | Disassembles instructions from a memory location. |
| `read_memory(memoryReference, count)` | Reads a block of memory. |
| `disconnect()` | Ends the debug session. |

## Example

Once X16M is registered, you don't call its tools directly. You ask your agent in plain English, and it picks the right tools for you.

> **You:** Launch the project at `project.json` and put a breakpoint on the line that increments `counter`.
>
> **Agent:** Launched it; the target's paused at the start. `inc counter` is on line 11 of `main.bmasm`, and I've set a breakpoint there.

> **You:** Continue, and tell me what `counter` is.
>
> **Agent:** Hit the breakpoint. `counter` is `0x01`.

> **You:** Keep continuing until the program finishes, telling me the counter each time.
>
> **Agent:** `0x02`... `0x03`... ... `0x0a`; then one more continue ran past the loop into `stp` and the target terminated. Final value was 10.

Under the hood that's `launch_project`, then `set_breakpoints`, then `continue_execution` and `evaluate("counter")` repeated until the target reports terminated.

The `BitMagic.X16MCP` repository has a [worked example](https://github.com/Yazwh0/BitMagic/tree/main/BitMagic.X16MCP/example) with a minimal project and a full walkthrough, a good first thing to try after registering X16M.
