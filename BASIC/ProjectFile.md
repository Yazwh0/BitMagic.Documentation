---
layout: page
title: BASIC Project Files
permalink: /basic/projectfile
description: Use a BitMagic project.json with BASIC, and debug BASIC outside the extension, eg from X16M.
---
# BASIC Project Files

You don't need a `project.json` to debug BASIC. This page is for when you want one: to use your own SD card or ROM, or to debug BASIC without the BASIC extension, eg from the [MCP agent](/mcpagent).

## Using a project.json from launch.json

Point `project` at a normal BitMagic [project file](/debugger/projectfile) and everything in it is used, the SD card, ROM, window and the rest:

```json
{
    "type": "x16basic",
    "request": "launch",
    "name": "Debug the game",
    "program": "${workspaceFolder}/game.bas",
    "project": "${workspaceFolder}/project.json"
}
```

The extension takes care of the BASIC side itself, so the project file doesn't need anything for BASIC in it.

## Debugging BASIC without the extension

The BASIC debugging is a *debug mode*: a plug-in that the BitMagic debugger loads to debug something other than 6502 code. The extension passes it to the debugger for you; anything else that runs the debugger, such as X16M or the plain BitMagic extension, can name it in `debugMode` in `project.json`:

```json
{
    "debugMode": {
        "package": "BitMagic.X16Basic.Debugger",
        "settings": {
            "source": "game.bas"
        }
    }
}
```

The debugger downloads the package from NuGet the first time, and keeps it in `%LOCALAPPDATA%\BitMagic\DebugModes` on Windows, or `~/.local/share/BitMagic/DebugModes` on Linux.

| Name | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| `package` | string | Yes | The NuGet package holding the debug mode: `BitMagic.X16Basic.Debugger`. |
| `version` | string | Yes | The package's version: exact (`0.2.0`), or a range such as `0.2.*`. The latest release if left out. |
| `source` | string | Yes | Where to get the package from: a NuGet feed, or a folder of packages. nuget.org if left out. |
| `assembly` | string | Yes | Without `package`, the debug mode's DLL itself, relative to the project. |
| `settings` | object | Yes | The BASIC settings, below. |

The settings are the same as the [launch.json settings](/basic/settings#launchjson), with `source` in place of `program`:

| Name | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| `source` | string | No | The BASIC file, relative to the project. |
| `charset` | string | Yes | `upper` (the default) or `mixed`. |
| `stopOnEntry` | bool | Yes | Stop on the first statement. |
| `onProgramEnd` | string | Yes | `ready` (the default) or `terminate`. |
| `run` | bool | Yes | `false` to leave the program at `READY`. |
| `renderOnStop` | bool | Yes | `false` to show the screen as the beam left it when stopping. |
| `symbols` | string | Yes | The ROM's `basic.sym`, if BASIC can't be found in the ROM. |

Set `startStepping` and `autobootRun` to `false` in the same file, as BASIC does its own loading and stepping.
