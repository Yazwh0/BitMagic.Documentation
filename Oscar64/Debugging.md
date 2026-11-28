---
layout: page
title: Debugging C
permalink: /oscar64/debugging
description: Breakpoints, stepping, the call stack, variables and watches for C compiled with Oscar64, and what the compiler does that you'll notice.
---
# Debugging C

This page covers what the debugger does with your C program once it's running, and the few things about Oscar64 that show up while you debug.

## Breakpoints

Click to the left of a line number to set a breakpoint. A line with no code (a blank line, a declaration without a value, a brace) moves the breakpoint to the next line that has some.

Right click a breakpoint to make it conditional:

| Kind | Example | Stops when |
| ---- | ------- | ---------- |
| Expression | `i == 5` | the C expression is true |
| Hit count | `3`, `>= 10`, `% 2` | it's been reached that many times |
| Log message | `i is {i}, p is {p->x}` | never; it writes the message to the *Debug Console* |

Breakpoints are set only where they're needed, so the program runs at full speed between them.

## Stepping

| Key | Step | Does |
| --- | ---- | ---- |
| `F10` | Over | Runs to the next line in this function. Calls run without stopping. |
| `F11` | Into | Stops at the next line anywhere, so in a function the line calls. |
| `Shift+F11` | Out | Runs until this function returns, and stops in the caller. |

Stepping into a call to your own assembler stops on its first instruction:

```c
__asm bump
{
    inc counter
    rts
}

void count(void)
{
    __asm { jsr bump }   // F11 here stops on the inc
}
```

From there you're in the debugger's normal assembly stepping. Calls into Oscar64's runtime (multiplication, division and so on) and into the kernal run through, as you rarely want to be in them.

## The call stack

Each C function on the stack shows the line it's on. Click a frame to see its locals; a recursive function has a frame for each call, each with its own values.

Frames that aren't C, such as the startup code, the runtime or the kernal, are shown greyed out, and clicking one opens the disassembly.

*Open Disassembly View* on a C frame shows the machine code for it, but the C lines aren't shown between the instructions yet, and globals appear as addresses (`lda $1de7` rather than `total`). Stepping there still goes a C line at a time; you can step single instructions once you're in your own assembler.

## Variables

The *Variables* pane has these scopes for the selected frame:

| Scope | Shows |
| ----- | ----- |
| Locals | The function's parameters, then the locals in scope at the line. |
| Statics | The function's `static` variables, if it has any. |
| Globals | Your program's globals (not the library's). |
| CPU | `A`, `X`, `Y`, `SP` and `PC`, Oscar64's stack and frame pointers (`$43` and `$45`), and the RAM bank. |

Structs and arrays expand, and a pointer expands to what it points at (a pointer to a struct straight to its members). Large arrays come in pages of 100. Right click a value and pick *Set Value* to change it, using any C expression.

*Add to Watch* works on anything in the pane, or type your own C expression in the *Watch* pane:

```c
points[i].y * 2        // arithmetic with Oscar64's 16 bit int
shape.next->x          // members through pointers
*(unsigned int *)&l    // casts
sizeof(struct Point)   // 4
total > 100 && !done   // logic, giving 1 or 0
```

Watches see globals in assembler frames too.

## Stopping on a BRK

A `BRK` in your program stops the debugger at the C line it was on, with the call stack and variables as they were. Continue, and it goes on to the X16's monitor as it would on the machine.

## What Oscar64 does that you'll notice

Oscar64 is built for speed, and some of what it does shows while you debug, even at `-O0`:

- **One parameter goes in registers.** A function with a single small parameter gets it in `A` and `X`, not in memory, so after the first line there's nowhere to read it from. The *Variables* pane says "not available: passed in registers".
- **A loop's increment can move.** In `for (char i = 0; i < n; i++)` the `i++` can run before the body, so on the body's first line `i` already reads one more.
- **A line can run in pieces.** Code for one line is sometimes split up and mixed with the next. The debugger treats the pieces as one visit to the line, but you may see a step go back to a line it was just on.
- **Unused globals are left out**, so they aren't in the *Globals* scope.
- **Unions are shown as bytes**, as Oscar64 doesn't describe their members.

With optimisation (`-O1` and up) it inlines functions and keeps locals in registers, so many won't show at all and stepping jumps about. Debug with `-O0`, which is what the extension compiles with unless you say otherwise.

Bytecode functions (from `-bc`) run, but the debugger can't follow them: breakpoints in them aren't hit, and stepping goes past them. When you start, the *Debug Console* lists which of your functions are bytecode. A function marked `__native` in a bytecode build can still be debugged.
