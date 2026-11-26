---
layout: page
title: Debugging BASIC
permalink: /basic/debugging
description: Breakpoints, stepping, the GOSUB call stack, variables, watches and errors when debugging X16 BASIC.
---
# Debugging BASIC

This page covers what you can do once a BASIC program is running under the debugger. If you haven't got that far, start with [BASIC](/basic/).

## Breakpoints

Click in the gutter beside a line to set a breakpoint. The program stops before the first statement on that line runs, every time it gets there.

Right click the breakpoint and choose *Edit Breakpoint* for the other kinds.

| Kind | Example | Stops when |
| ---- | ------- | ---------- |
| Condition | `I=3 AND A$="Y"` | The BASIC expression is true, in the same way `IF` would treat it. |
| Hit count | `5`, `>=5`, `>5`, `%5` | It's the fifth time here, the fifth onwards, after the fifth, or every fifth time. |
| Log point | `I is {I}, total {T}` | Never. It writes the message to the *Debug Console* instead, with each `{expression}` replaced by its value. |

A condition can use variables the program hasn't set yet, as BASIC would: an unset number is `0` and an unset string is empty. If a condition can't be worked out (a syntax error, say), the program stops and tells you why.

## Stepping

Stepping goes a statement at a time, so `A=1:B=2` takes two steps.

| Command | Does |
| ------- | ---- |
| *Step Into* (`F11`) | Runs one statement. On a `GOSUB` it stops on the first statement of the subroutine; on a `SYS` it stops on the first instruction of the machine code. |
| *Step Over* (`F10`) | Runs one statement. A `GOSUB` runs all the way to its `RETURN` without stopping, unless there's a breakpoint in it. |
| *Step Out* (`Shift+F11`) | Runs until the current subroutine has returned, and stops on the statement after the `GOSUB`. |
| *Pause* (`F6`) | Stops at the next statement. |

Stepping into a `SYS` hands over to the normal [debugger](/debugger/debugging): you step the machine code as you would any other, with the disassembly, registers and memory views. When the code returns to BASIC, *Continue* carries on with the program.

## The call stack

The *Call Stack* shows where you are, then each GOSUB you're inside, newest first. Each entry shows the statement, eg `100: T=T+I`; click one to see the line that called it.

## Variables

The *Variables* pane has four groups.

| Group | Shows |
| ----- | ----- |
| Variables | Every simple variable, with its type: `A` (number), `A%` (integer), `A$` (string) and `FN` definitions. |
| Arrays | Every array, with its size. Expand one to see its elements, in pages if it's large. |
| FOR loops | Each active `FOR`, with its variable, the limit and the step. |
| BASIC | BASIC's own pointers (where the program, variables, arrays and strings are) and the free memory. |

Variables appear as the program creates them, as they do in BASIC.

To change a value, double click it and type a new one. Numbers, integers and strings can all be changed; a new string goes into BASIC's string space, as it would if the program had set it.

## Watches and hovers

Watches, hovers and the *Debug Console* all take BASIC expressions:

| Expression | Gives |
| ---------- | ----- |
| `A+B%*2` | Arithmetic, with BASIC's precedence. |
| `D(2,I)` | An array element. |
| `LEFT$(N$,3)` | String functions. |
| `PEEK($9F20)` | Memory, with `$` for hex. |
| `A>5 AND B<>0` | Comparisons are `-1` or `0`, as in BASIC. |

The functions are `ABS`, `INT`, `SGN`, `SQR`, `SIN`, `COS`, `TAN`, `ATN`, `EXP`, `LOG`, `PEEK`, `LEN`, `ASC`, `VAL`, `CHR$`, `STR$`, `HEX$`, `LEFT$`, `RIGHT$` and `MID$`.

Hover over a variable in the editor to see its value.

## Errors

When the program hits an error, the debugger stops on the statement that caused it and shows BASIC's message, eg `?DIVISION BY ZERO ERROR IN 20`. The variables are as they were at that moment, so you can see why.

`STOP` and `END` behave as they do on the X16. When the program ends it's left at `READY`, so you can type at it in the [screen](/basic/screen) or `RUN` it again; set `onProgramEnd` to `terminate` to end the session instead (see [Settings](/basic/settings)).

## When the program changes

The debugger shows your source file while that's what's in memory. If the program in memory changes (you edit it at `READY`, `LOAD` another, or a `POKE` alters it), it shows a listing of what's actually there instead, so the lines you step through are always the real ones.
