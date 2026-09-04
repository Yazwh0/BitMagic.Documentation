---
layout: page
title: ROM
permalink: /emulator/rom
description: How to obtain the Commander X16 ROM and point the emulator at it.
---
# ROM

The Commander X16 ROM contains licensed code, so you'll need to obtain your own copy before using the emulator. BitMagic needs ROM version `R46` or later.

There are two ways to get one:

- Download and install the latest version of the [Official Emulator](https://github.com/X16Community/x16-emulator/actions).
- Clone the official [ROM repository](https://github.com/X16Community/x16-rom) and build it manually. This can be done on Windows using WSL; just remember to install a recent version of Python!

Once you have `rom.bin`, the easiest way to use it is to copy it into the same folder as the emulator. Otherwise, point at it with [`--rom`](/emulator#command-line), set `romFile` in the [project file](/debugger/projectfile#properties), or set the environment variable `BITMAGIC_ROM` to its full path.
