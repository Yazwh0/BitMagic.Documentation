---
layout: page
title: BASIC Settings
permalink: /basic/settings
description: The launch.json settings for debugging X16 BASIC, the extension's settings, and how to write control codes in strings.
---
# BASIC Settings

Pressing `F5` on a `.bas` file needs no setup at all. This page is for when you want more control: a `launch.json` entry, the extension's settings, and how strings are written.

## launch.json

To keep a configuration, add one to `.vscode/launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "x16basic",
            "request": "launch",
            "name": "Debug the game",
            "program": "${workspaceFolder}/game.bas",
            "stopOnEntry": true
        }
    ]
}
```

`${file}` as the `program` debugs whichever BASIC file is open.

| Name | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| `program` | string | No | The BASIC file to debug, written with line numbers. |
| `project` | string | Yes | A BitMagic `project.json` to take everything else from: the ROM, SD card, window and so on. See [Project Files](/basic/projectfile). |
| `charset` | string | Yes | `upper` (the default) for the X16's upper case and graphics set, or `mixed` for lower and upper case. In `mixed`, letters in strings keep their case. |
| `stopOnEntry` | bool | Yes | Stop on the first statement. `false` by default. |
| `onProgramEnd` | string | Yes | `ready` (the default) leaves the X16 at `READY` when the program ends, so you can `RUN` it again. `terminate` ends the debug session. |
| `run` | bool | Yes | `true` (the default) runs the program once it's loaded. `false` leaves it at `READY` for you to `RUN`. |
| `renderOnStop` | bool | Yes | `true` (the default) draws the whole screen when stopping, so output shows straight away. See [Screen and Live View](/basic/screen#seeing-output-when-you-stop). |
| `romFile` | string | Yes | A different ROM. BitMagic's is used if this isn't set. |
| `symbols` | string | Yes | The ROM's `basic.sym`. You shouldn't need it: the debugger finds BASIC's routines in the ROM. |

## Extension settings

| Name | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| `bitMagicX16Basic.openScreen` | bool | Yes | Open the [X16 Screen](/basic/screen) tab when debugging starts. `true` by default. |
| `bitMagicX16Basic.debugModePath` | string | Yes | Use this `BitMagic.X16Basic.Debugger.dll` instead of the one that comes with the extension. Only for working on the debugger itself. |

The emulator and debugger are the BitMagic extension's, so its [settings](/settings) apply too.

## Writing strings

Write the program as you'd type it at the X16, with upper case keywords. Control codes go in strings the petcat way, in braces:

```basic
10 PRINT "{CLR}{WHT}HELLO {RED}WORLD"
20 PRINT "{$93}"
30 PRINT "{RVS ON}TITLE{RVS OFF}"
```

Line `10` clears the screen and prints in white then red, line `20` is `{CLR}` again by its number, and line `30` prints in reverse.

| Codes | |
| ----- | - |
| Screen | `{CLR}`, `{HOME}`, `{DEL}`, `{INST}`, `{RVS ON}`, `{RVS OFF}`, `{SWLC}`, `{SWUC}` |
| Cursor | `{UP}`, `{DOWN}`, `{LEFT}`, `{RIGHT}` |
| Colours | `{BLK}`, `{WHT}`, `{RED}`, `{CYN}`, `{PUR}`, `{GRN}`, `{BLU}`, `{YEL}`, `{ORNG}`, `{BRN}`, `{LRED}`, `{GRY1}`, `{GRY2}`, `{LGRN}`, `{LBLU}`, `{GRY3}` |
| Keys | `{F1}` to `{F8}` |
| Symbols | `{PI}`, `{POUND}`, `{UP ARROW}`, `{LEFT ARROW}` |
| Any byte | `{$xx}`, eg `{$93}` |

The colours also have their full names, eg `{WHITE}` and `{ORANGE}`.

Keywords are found anywhere outside strings, exactly as the X16 does it, so `IFX=1THENPRINT"Y"` works, and the program is tokenised byte for byte as the X16 would.
