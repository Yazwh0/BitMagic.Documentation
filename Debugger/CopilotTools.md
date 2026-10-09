---
layout: page
title: Copilot Tools
permalink: /debugger/copilottools
description: Let GitHub Copilot Chat read and amend X16 state, send input and record audio in an active BitMagic debug session.
---
# Copilot Tools

BitMagic registers a set of tools with VSCode's own Language Model API, so GitHub Copilot Chat can work with an active debug session: read X16 state, amend memory, send keyboard and mouse input, and record the audio. There's nothing to install or configure: they ship with the extension and show up in Copilot Chat's tool list as soon as a BitMagic session is running.

## How this differs from X16M

[X16M](/mcpagent) is a separate MCP server you install and register yourself. It can launch a session, drive breakpoints and stepping, and works with any MCP client (Claude Code, Claude Desktop, anything else that speaks MCP).

Copilot Tools are built into the extension itself and work only with GitHub Copilot Chat inside VSCode, on a session VSCode already launched. They can read and change the X16's state, but they can't start a session or control execution: no launch, no breakpoints, no continue or step. You keep doing those yourself.

Reach for X16M when you want an agent driving the session end to end. Reach for Copilot Tools when you're already debugging by hand in VSCode and want Copilot Chat to see what you see (sprites, palette, a byte pattern in RAM) or lend a hand, without switching windows.

## Requirements

A BitMagic debug session has to already be running (`F5` in VSCode). Without one, each tool replies "No active BitMagic debug session. Start one in VSCode first." rather than erroring outright. The one exception is `#x16OtherCompilers`, which is a reference document and works without a session.

## Available tools

### Display and machine state

| Tool | Description |
| ---- | ----------- |
| `#x16Sprites` | Every VERA sprite slot's attributes (position, size, VRAM address, palette offset, flip flags) plus a cropped image of its own pixels. |
| `#x16Layers` | The 6 VERA compositing layers as 640x480 images, background through to the frontmost sprite depth. |
| `#x16Palette` | The 256-colour VERA palette, as both raw R,G,B values and display-space RGBA. |
| `#x16CpuHistory` | The entire recorded 65c02 instruction history, most recent first, since the last reset. Can be a large response on a long-running session; say so if you only want the most recent few. |
| `#x16MemoryUse` | A heatmap image of which addresses were recently executed, read or changed. Calling it clears the tracked flags, so calling it straight again shows a different, mostly blank picture rather than the same one repeated. |
| `#x16Variables` | Lists a debug scope's variables as `name: type = value` lines, the same as the Variables pane. For program symbols the type includes the memory location, e.g. `counter: byte ($0810) = 5`, so Copilot can go straight on to read or write that address. Scopes are `Globals`, `Locals` and the hardware scopes (CPU, VERA, etc.). |
| `#x16ExceptionInfo` | Why the session is stopped, when an exception breakpoint stopped it (`BRK`, `EXP` or `FIO`) rather than a line breakpoint or a step. |

### Memory

| Tool | Description |
| ---- | ----------- |
| `#x16ReadMemory` | Reads raw bytes from a memory space at an offset. |
| `#x16WriteMemory` | Writes raw bytes to a memory space at an offset, to amend live state (poke a value to test a theory). The bytes are a plain array of numbers (each 0 to 255, e.g. `[169, 1, 141]`), not base64. Only `main`, `vram`, `sdcard` and `nvram` are writable. |
| `#x16SearchMemory` | Searches a memory space for a byte pattern, returning the offsets it was found at. |
| `#x16FindMemoryValue` | A "Cheat Engine" style value scanner across every RAM bank, to find where an unknown variable (health, score, a counter) lives without knowing its address. The first call scans everything and takes 30 to 60 seconds; after that, pass back the locations it found with a comparison such as "Changed" or "Gone Up" to narrow them down until only the one you want is left. |

Memory space names match the rest of the debugger: `main` (currently-banked CPU-addressable RAM/ROM), `vram`, `sdcard`, `sdcardblock`, `nvram`, `rambank<N>`, `rombank<N>` (read and search only for the last two).

### Input

| Tool | Description |
| ---- | ----------- |
| `#x16SendKey` | Sends one keyboard event, a key press or a release, exactly as a real key would arrive. To type a character, send it down then up. Key names match Silk.NET's, e.g. `A`, `Enter`, `ShiftLeft`. |
| `#x16SendMouse` | Sends one mouse sample: a movement since the last sample plus the current button state. The X16's mouse is relative, so there's no "move to X,Y", only "move by this much". To click, send the button held then released. |

### Audio

| Tool | Description |
| ---- | ----------- |
| `#x16StartAudioRecording` | Records the audio output (the VERA PSG and PCM, and the YM2151, mixed) to a 16-bit stereo WAV file at 48828Hz, overwriting any existing file. It's taken straight from the emulator's output, so it captures the real audio even when the window is muted, and nothing is written while the session is stopped or paused, so the file plays back without gaps. The path can be absolute or relative to the project's folder. One recording at a time. |
| `#x16StopAudioRecording` | Stops the recording and finalises the WAV file, reporting its path and the length recorded. A recording is also stopped when the session ends. |

### Reference

| Tool | Description |
| ---- | ----------- |
| `#x16OtherCompilers` | How programs built by other compilers, such as ca65, appear in the debugger: how their symbols are named (BitMagic's naming, not the other compiler's), how variables are typed, and what shows in Locals and Globals. Copilot reads it before working with symbols in a project that isn't BitMagic. |

## Example

You don't have to reference a tool by name; Copilot Chat can pick the right one from plain English too.

> **You:** #x16Palette what colour is index 6?
>
> **Copilot:** Index 6 is R:0 G:0 B:10 in raw VERA values, `#0000AAFF` in display RGBA, a dark blue.

> **You:** Start recording the audio to `music.wav`.
>
> **Copilot:** Recording to `music.wav` in the project folder. Ask me to stop when you've heard enough.
>
> **You:** Stop it.
>
> **Copilot:** Stopped. `music.wav` has 12.4 seconds of audio.
