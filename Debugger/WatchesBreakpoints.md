---
layout: page
title: Watches and Breakpoints
permalink: /debugger/watchesandbreakpoints
description: C# expressions for watches, conditional and hit-count breakpoints, and logpoints.
---
# Watches and Breakpoints

Expressions are used while debugging to show the state of the machine in the Watch window, to set [conditional and hit-count breakpoints](https://code.visualstudio.com/docs/editor/debugging#_conditional-breakpoints), to set [logpoints](https://code.visualstudio.com/docs/editor/debugging#_logpoints), and to write [function breakpoints](/debugger/debugging#breakpoints) like `vram(...)` and `vsync(...)`.

The expressions are C#, and are based on the variables shown in the debugger. The roots match the sections in the Variables window with any spaces removed: `CPU`, `VERA`, `Kernal`, `Display`, `I2C`, `SMC`, `RTC`, `VIA`, `SDCard` and more.

Because expressions are C# code, they are case sensitive.

For example the CPU's registers and flags:

```text
CPU.A
CPU.X
CPU.Y
CPU.PC
CPU.SP
CPU.Flags.Zero
CPU.Flags.Carry
```

Which matches up to the Variables window:

![Variables-CPU](/Images/Variables-Cpu.png)

Memory can be queried as an array. For example to read a single byte:

```c#
CPU.Ram[0x0000]
VERA.VRam[0x00000]
```

Arrays have additional functionality to allow us to see a value at a position as if it were other data types.

```c#
CPU.Ram[0x0000].Byte                // 8 bit integer
CPU.Ram[0x0000].Sbyte               // Signed 8 bit integer
CPU.Ram[0x0000].Char                // Character
CPU.Ram[0x0000].Short               // 16 bit integer
CPU.Ram[0x0000].Ushort              // Unsigned 16 bit integer
CPU.Ram[0x0000].Int                 // 32 bit integer
CPU.Ram[0x0000].Uint                // Unsigned 32 bit integer
CPU.Ram[0x0000].Long                // 64 bit integer
CPU.Ram[0x0000].Ulong               // Unsigned 64 bit integer
CPU.Ram[0x0000].String              // Null terminated string
CPU.Ram[0x0000].FixedString(10)     // Fixed length string
```

For example the Watch window showing a 32 bit integer and a string:

![Variables-Array](/Images/Variables-Array.png)

As this is a C# expression, the offset doesn't need to be a constant, but can be an expression. These are all valid:

```c#
CPU.Ram[CPU.X]
CPU.Ram[CPU.Y * 2 + 100]
VERA.VRam[CPU.X * CPU.Y]
```

## Conditional breakpoints

Conditional breakpoints will evaluate the expression and check if the result is 'truthy'. The breakpoint is considered hit if the value is `true`, non-zero or a non-blank string.

![Conditional-Breakpoint](/Images/Conditional-Breakpoint.gif)

## Hit count breakpoints

Hit count breakpoints work like conditional breakpoints, but the number of times a breakpoint has been hit is added to the beginning of the expression.

For example a hit count breakpoint of `== 10` would become `x == 10`, where x is an integer. Again the truthy value rules are applied.

Hit count breakpoints can be combined with conditional breakpoints for extra flexibility, however both need to be true for the breakpoint to hit.

![HitCount-Breakpoint](/Images/HitCount-Breakpoint.gif)

## Logpoints

Logpoints will display a message in the Debug Console when they are hit, which is especially useful for a system where outputting text natively is difficult.

Logpoints can be combined with conditional and hit count breakpoints to determine if the output will be logged.

The string is a C# formatted string, and can bring in the system variables like any other expression.

![LogPoint](/Images/Logpoint.gif)

## Performance

Performance of breakpoints with an expression is poor: each hit stops the X16 and updates the debugger's view of machine state before the expression is even evaluated. Use them sparingly, and disable them when you're not using them.
