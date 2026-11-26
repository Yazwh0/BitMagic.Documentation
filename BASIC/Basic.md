---
layout: home
title: BASIC
permalink: /basic/
description: Debug Commander X16 BASIC in VSCode, with breakpoints, stepping, GOSUBs, variables and the X16's screen.
---
# BASIC

You can debug X16 BASIC in VSCode, the same way you'd debug any modern language. Set a breakpoint on a line, step a statement at a time, watch the GOSUBs on the call stack and see your variables and arrays change as the program runs.

It's a separate extension, *BitMagic X16 BASIC*, built on the [debugger](/debugger/). The BASIC program runs on the BitMagic emulator in the real X16 ROM, so it behaves exactly as it would on the machine; the debugger follows the interpreter as it goes.

## What you can do

- **Breakpoints** on lines, with conditions (`I=3`), hit counts and log points (`I is {I}`).
- **Step** a statement at a time: into, over (a GOSUB runs without stopping) and out (back to after the GOSUB).
- **Step into a `SYS`** and carry on in the machine code, in the debugger's normal assembly view.
- **The call stack** shows each GOSUB, and the statement it came from.
- **Variables and arrays**, active FOR loops, and BASIC's own pointers and free memory.
- **Watches and hovers** take BASIC expressions: `A+B%`, `D(2)`, `LEFT$(N$,3)`, `PEEK($9F20)`.
- **Change a variable** while stopped, numbers and strings.
- **Stop on errors**, with BASIC's own message: `?DIVISION BY ZERO ERROR IN 20`.
- **See the X16's screen** in a VSCode tab, and type into it.

The editor gets syntax colouring for every X16 keyword, problems shown as you type (missing or duplicate line numbers, lines out of order, a `GOTO` to a line that doesn't exist), hovers, and *Go to Definition* on a line number.

## Getting started

1. Install *BitMagic X16 BASIC* from the VSCode Marketplace, or from Open VSX for VSCodium. It installs the [BitMagic extension](/getting-started) too, if you don't have it already.
2. Open a `.bas` file written with line numbers.
3. Press `F5`.

That's it, there's nothing to set up. The program is tokenised, loaded into the emulator and `RUN`. The ROM comes from the official emulator the BitMagic extension already downloads, and the debugger finds BASIC's routines in it by itself.

Here's something to try it on:

```basic
10 PRINT "{CLR}COUNTING"
20 FOR I=1 TO 10
30 GOSUB 100
40 NEXT I
50 END
100 T=T+I
110 PRINT I,T
120 RETURN
```

Put a breakpoint on line `110`, press `F5`, and you'll stop with `I` and `T` in the *Variables* pane and the GOSUB from line `30` on the call stack.

The program is written as you'd type it at the X16: upper case keywords, and control codes in strings the petcat way, as `{CLR}` or `{$93}`. See [Settings](/basic/settings) for the full list.

## Find out more

- [Debugging](/basic/debugging): breakpoints, stepping, variables, watches and errors.
- [Screen and Live View](/basic/screen): the X16's display in a tab, typing, and watching a program while it runs.
- [Settings](/basic/settings): the `launch.json` settings and the extension's own.
- [Project Files](/basic/projectfile): using a BitMagic `project.json` with BASIC, and debugging BASIC without the extension.

Only numbered lines are supported for now; BASLOAD style source isn't.
