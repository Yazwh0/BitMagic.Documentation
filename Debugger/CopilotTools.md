---
layout: page
title: Copilot Tools
permalink: /debugger/copilottools
description: Let GitHub Copilot Chat read X16 state, sprites, layers, palette, memory, straight out of an active BitMagic debug session.
---
# Copilot Tools

BitMagic registers a set of tools with VSCode's own Language Model API, so GitHub Copilot Chat can read X16 state straight out of an active debug session. There's nothing to install or configure: they ship with the extension and show up in Copilot Chat's tool list as soon as a BitMagic session is running.

## How this differs from X16M

[X16M](/mcpagent) is a separate MCP server you install and register yourself. It can launch a session, drive breakpoints and stepping, and works with any MCP client (Claude Code, Claude Desktop, anything else that speaks MCP). Copilot Tools are built into the extension itself, work only with GitHub Copilot Chat inside VSCode, and only read state from a session VSCode already launched; they can't start one or control execution (no launch, no breakpoints, no continue/step).

Reach for X16M when you want an agent driving the session end to end. Reach for Copilot Tools when you're already debugging by hand in VSCode and just want Copilot Chat to see what you see, sprites, palette, a byte pattern in RAM, without switching windows.

## Requirements

A BitMagic debug session has to already be running (`F5` in VSCode). Without one, each tool replies "No active BitMagic debug session. Start one in VSCode first." rather than erroring outright.

## Available tools

| Tool | Description |
| ---- | ----------- |
| `#x16Sprites` | Every VERA sprite slot's attributes (position, size, VRAM address, palette offset, flip flags) plus a cropped image of its own pixels. |
| `#x16Layers` | The 6 VERA compositing layers as 640x480 images, background through to the frontmost sprite depth. |
| `#x16Palette` | The 256-colour VERA palette, as both raw R,G,B values and display-space RGBA. |
| `#x16CpuHistory` | The entire recorded 65c02 instruction history, most recent first, since the last reset. Can be a large response on a long-running session; say so if you only want the most recent few. |
| `#x16MemoryUse` | A heatmap image of which addresses were recently executed, read or changed. Calling it clears the tracked flags, so calling it straight again shows a different, mostly blank picture rather than the same one repeated. |
| `#x16ReadMemory` | Reads raw bytes from a memory space at an offset. |
| `#x16WriteMemory` | Writes raw bytes to a memory space at an offset, to amend live state (poke a value to test a theory). Only `main`, `vram`, `sdcard` and `nvram` are writable. |
| `#x16SearchMemory` | Searches a memory space for a byte pattern, returning the offsets it was found at. |

Memory space names match the rest of the debugger: `main` (currently-banked CPU-addressable RAM/ROM), `vram`, `sdcard`, `sdcardblock`, `nvram`, `rambank<N>`, `rombank<N>` (read and search only for the last two).

## Example

You don't have to reference a tool by name; Copilot Chat can pick the right one from plain English too.

> **You:** #x16Palette what colour is index 6?
>
> **Copilot:** Index 6 is R:0 G:0 B:10 in raw VERA values, `#0000AAFF` in display RGBA, a dark blue.
