---
layout: page
title: ROM
permalink: /emulator/rom
description: How to obtain the Commander X16 ROM and point the emulator at it.
---
# ROM File

When using the emulator you will need to obtain a copy of the ROM. This is because the Commander X16 ROM contains licensed code.

It needs a ROM version of 'R46' or later.

There are two ways to obtain a copy of the ROM:

- Download and install the latest version of the [Official Emulator](https://github.com/X16Community/x16-emulator/actions)
- Clone the official [ROM repository](https://github.com/X16Community/x16-rom) and build it manually. This can be done on Windows using WSL, just remember to install a recent version of Python!

Once you have the `rom.bin` the easiest way to use it is to copy it to the same folder as the emulator. Otherwise you can reference it with command line parameters, set `RomFile` in the `project.json`, or create an environment variable `BITMAGIC_ROM` holding the full path and filename of the rom file.
