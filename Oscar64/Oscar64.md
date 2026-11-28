---
layout: home
title: C with Oscar64
permalink: /oscar64/
description: Debug C for the Commander X16 in VSCode, compiled with Oscar64, with breakpoints, stepping, the call stack and typed variables.
image: /Images/Oscar64Icon.png
---
# C with Oscar64

You can debug C for the X16 in VSCode at the level of the C source: breakpoints on C lines, stepping a line at a time, the call stack of C functions, and your locals, parameters and globals shown with their real types. The programs are compiled with [Oscar64](https://github.com/drmortalwombat/oscar64) and run on the BitMagic emulator.

It's a separate extension, *BitMagic X16 Oscar64*, built on the [debugger](/debugger/). The debugger reads the debug information Oscar64 writes (its `.dbj` file) and checks it against the compiled code, as there are a few places it gets wrong.

## What you can do

- **Breakpoints** on C lines, with conditions (`i == 5`), hit counts and log points (`i is {i}`).
- **Step** a line at a time: into, over (a call runs without stopping) and out, through recursion too.
- **Step into your own assembler**: stepping into a call to an `__asm` function stops on its first instruction, and you carry on in the debugger's normal assembly view.
- **The call stack** shows each C function and the line it's on. Recursive calls each get their own frame, with their own locals.
- **Variables with their real types**: signed and unsigned integers, floats, bools, enums by name, pointers (which expand to what they point at), arrays (in pages) and structs.
- **Watches and hovers** take C expressions: `p->next->x`, `a[i] * 2`, `*(unsigned int *)&l`, `sizeof(struct Point)`.
- **Change a variable** while stopped.
- **Stop on a `BRK`** at the C line it was on.
- **See the X16's screen** in a VSCode tab, and type into it.

Compiler errors and warnings show in the *Problems* view.

## Getting started

1. Install *BitMagic X16 Oscar64* from the VSCode Marketplace, or from Open VSX for VSCodium. It installs the [BitMagic extension](/getting-started) too, if you don't have it already.
2. Open a folder with a C file.
3. Press `F5`.

The file is compiled with Oscar64 into a `build` folder next to it, loaded into the emulator and run. If Oscar64 isn't on your `PATH`, the extension offers to download it (on Windows; elsewhere, build it and tell the extension where it is in [Settings](/oscar64/settings)).

Here's something to try it on:

```c
#include <stdio.h>

int square(int n)
{
    return n * n;
}

int main(void)
{
    int total = 0;
    for (char i = 0; i < 4; i++)
        total += square(i);   // put a breakpoint here

    printf("TOTAL %d\n", total);
    return 0;
}
```

Put a breakpoint on the `total += square(i);` line, press `F5`, and you'll stop with `total` and `i` in the *Variables* pane. Press `F11` to step into `square`, and the call stack shows it called from `main`.

*X16 Oscar64: Create X16 Oscar64 Project* in the command palette (or the button in the Explorer when no folder is open) writes a slightly bigger example, with a `launch.json`.

## Find out more

- [Debugging](/oscar64/debugging): breakpoints, stepping, the call stack, variables and watches, and what Oscar64 does that you'll notice.
- [Settings](/oscar64/settings): the `launch.json` settings, the extension's own, and debugging a `.prg` you've built yourself.

Only native code can be debugged. Bytecode (`-bc`) runs, but the debugger can't follow it; it tells you which functions are bytecode when you start.
