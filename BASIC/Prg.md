---
layout: page
title: Saving and Opening PRGs
permalink: /basic/prg
description: Save X16 BASIC as a .PRG the X16 can LOAD, open a .PRG as BASIC, and take the program from the emulator.
---
# Saving and Opening PRGs

When the X16 saves a BASIC program it doesn't write text: `SAVE` writes a `.PRG` holding the program as it is in memory, with each keyword stored as a token. This page is about getting between that and the text you edit in VSCode.

## Saving as a PRG

Right click a `.bas` file, in the Explorer or in the editor, and choose *Save as PRG* (or run *X16 BASIC: Save as PRG*). It suggests a `.prg` next to your file.

The file is byte for byte what `SAVE` would write on the X16: the load address, `$0801`, then the tokenised program. Copy it to an SD card and `LOAD "GAME.PRG"` works as you'd expect.

If the program has errors, eg a line without a number or an unknown `{NAME}` in a string, nothing is written and the *X16 BASIC* output says which line. Warnings, such as a line too long to type in on the X16, are shown there too, but the file is still saved.

## Opening a PRG as BASIC

Right click a `.prg` in the Explorer and choose *Open PRG as BASIC* (or run *X16 BASIC: Open PRG as BASIC*). The program opens in a new editor, as `LIST` would show it, ready to save as a `.bas`.

Control codes in strings come out as `{CLR}`, `{RED}` and the rest, the same way you'd write them, so saving it as a `.prg` again gives the same bytes.

If the file isn't BASIC (most `.prg` files are machine code), it says so rather than showing nonsense. A machine code program that starts with a `SYS` line opens as just that line.

## Taking the program from the emulator

While a BASIC program is being debugged, two commands work on the program in the emulator's memory rather than your file:

| Command | Does |
| ------- | ---- |
| *X16 BASIC: Open the Program in Memory* | Opens it in a new editor as BASIC. |
| *X16 BASIC: Save the Program in Memory as PRG* | Saves it as a `.prg`, as `SAVE` would. |

This is the program as BASIC has it now, so it includes anything you've typed at `READY` or `LOAD`ed in the [X16 Screen](/basic/screen).

## Character set

Strings are read and written for the X16's upper case and graphics set, unless you set `bitMagicX16Basic.charset` to `mixed`, in which case letters in strings keep their case. See [Settings](/basic/settings).

## From the command line

The same conversions are available from a terminal as `x16basic`, a .NET tool:

```text
dotnet tool install -g BitMagic.X16Basic.Tool

x16basic tokenise game.bas -o GAME.PRG
x16basic detokenise GAME.PRG -o game.bas
```

`--charset mixed` picks the mixed case set, and `-o -` writes to the terminal. Problems with the program are reported with the file and line, the way compilers do, so it's easy to use from a build script.
