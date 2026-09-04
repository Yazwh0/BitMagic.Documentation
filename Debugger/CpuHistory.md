---
title: CPU History
layout: page
permalink: /debugger/cpuhistory
description: View recent CPU operations while debugging, and jump back to the source.
---

# CPU History

While debugging the X16 you can look back over the CPU operations that have run.

Every instruction is logged to a ring buffer. It holds `historySize` entries (a power of two, `0x800000` by default), which you set in the [project file](/debugger/projectfile#properties). The view pages through the buffer 1024 entries at a time, or you can pull the lot.

Note: this can only be viewed while a debug session is active.

## How to open

Open the command palette and run `BitMagic: Open The History View`. See VSCode's [command documentation](https://code.visualstudio.com/api/extension-guides/command) to customise how you access it.

Click Update to display the history. Hover over an opcode BitMagic can trace back to source and it becomes a link; click it to jump there.

## How to interpret the data

![History Example](/Images/HistoryExample.png)

The history runs the opposite way to a normal log file: the most recent operation is at the top, and the oldest is at the bottom.

The registers, flags and the RAM/ROM bank are as they were *before* the instruction ran. To see the outcome, check the entry above it; for the most recent entry, check the machine's current state instead.

The opcode column shows both the decompiled instruction and its raw bytes, including any symbols. Grey names mark where the PC lands on a known label; in the example above you can see execution jump to `kbdbuf_get`, confirming the jump landed.

Each entry holds the PC, opcode and its operand bytes, the ROM and RAM bank, `A`/`X`/`Y`, the flags, `SP`, and the master clock at that point.

![History View](/Images/historyclick.gif)
