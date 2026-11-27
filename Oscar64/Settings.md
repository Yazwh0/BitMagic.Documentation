---
layout: page
title: Oscar64 Settings
permalink: /oscar64/settings
description: The launch.json settings for debugging C compiled with Oscar64, the extension's settings, and debugging a .prg you've built yourself.
---
# Oscar64 Settings

Pressing `F5` on a C file needs no setup. This page is for when you want more control: a `launch.json` entry, the extension's settings, or a `.prg` from your own build.

## launch.json

To keep a configuration, add one to `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "oscar64",
            "request": "launch",
            "name": "Debug the game",
            "program": "${workspaceFolder}/src/game.c",
            "compilerArgs": ["-i=include", "-dDEBUG"],
            "stopOnEntry": true
        }
    ]
}
```

`${file}` as the `program` debugs whichever C file is open.

| Name | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| `program` | string | No | The C file to compile and debug, or a `.prg` Oscar64 built with `-g`, with its `.dbj` next to it. |
| `compile` | bool | Yes | Compile a C `program` first. `true` by default; `false` uses the `.prg` already in `outputFolder`. |
| `compilerArgs` | string[] | Yes | More Oscar64 arguments, after those in the `bitMagicX16Oscar64.compilerArgs` setting. |
| `outputFolder` | string | Yes | Where the `.prg`, `.dbj` and the rest go. A `build` folder next to the program by default. |
| `project` | string | Yes | A BitMagic `project.json` to take everything else from: the ROM, SD card, window and so on. Its `debugMode` is set from this configuration. |
| `stopOnEntry` | bool | Yes | Stop on `main`'s first line. `false` by default. |
| `run` | bool | Yes | `true` (the default) loads the program at `READY` and runs it. `false` leaves it for something else to load and run, eg your own `AUTOBOOT.X16`. |
| `onProgramEnd` | string | Yes | `ready` (the default) carries on at `READY` when `main` returns. `terminate` ends the debug session. |
| `renderOnStop` | bool | Yes | `true` (the default) draws the whole screen when stopping, so output shows straight away. |
| `romFile` | string | Yes | The ROM to use, if not BitMagic's. |
| `sourceFolder` | string | Yes | Where to find sources whose paths in the `.dbj` don't exist here (a `.prg` built on another machine), by file name. |

The extension always passes `-tm=x16 -g -n` to Oscar64, and `-O0` unless your arguments have an `-O` option of their own.

## Extension settings

| Name | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| `bitMagicX16Oscar64.compilerPath` | string | Yes | `oscar64.exe`, or the folder it's in. If empty, `oscar64` on the `PATH`, or else the extension offers to download it. |
| `bitMagicX16Oscar64.compilerArgs` | string[] | Yes | Oscar64 arguments for every build, eg `["-i=include"]`. |
| `bitMagicX16Oscar64.showRunButtons` | bool | Yes | Show *Debug* and *Run on the X16* in the editor title for C files. `true` by default. |
| `bitMagicX16Oscar64.openScreen` | bool | Yes | Open the X16 Screen tab when a program starts debugging. `true` by default. |
| `bitMagicX16Oscar64.debugModePath` | string | Yes | A debugger build to use instead of the extension's, for working on the debugger itself. |

## Debugging a .prg from your own build

If you build with a makefile or a script, point `program` at the `.prg`:

```json
{
    "type": "oscar64",
    "request": "launch",
    "name": "Debug my build",
    "program": "${workspaceFolder}/bin/game.prg"
}
```

Build with Oscar64's `-g` so it writes `game.dbj` next to `game.prg`, and with `-O0` (and native code, the default) so there's something to follow. The source paths in the `.dbj` are where it was compiled; if that was somewhere else, set `sourceFolder`.

## Using it without the extension

The debugger itself is a debug mode for X16D, so a BitMagic `project.json` can use it directly. The extension writes one like this:

```json
{
    "autobootRun": false,
    "debugMode": {
        "package": "BitMagic.X16Oscar64.Debugger",
        "settings": {
            "program": "build/game.prg",
            "stopOnEntry": false
        }
    }
}
```

The `settings` are the ones in the table above, apart from those about compiling.
