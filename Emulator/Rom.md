---
layout: page
title: ROM
permalink: /emulator/rom
description: How to obtain the Commander X16 ROM and point the emulator at it.
---
# ROM

The Commander X16 ROM contains licensed code, so you'll need to obtain your own copy before using the emulator. BitMagic needs ROM version `R46` or later.

There are three ways to get one:

- Run `fetch-rom.bat` (Windows) or `fetch-rom.sh` (Linux) from the emulator's folder. It downloads the latest ROM release from the [x16-rom repository](https://github.com/X16Community/x16-rom) and installs `rom.bin` right there, which is all the emulator needs.
- Download and install the latest version of the [Official Emulator](https://github.com/X16Community/x16-emulator/actions), which comes bundled with a `rom.bin`.
- Clone the official [ROM repository](https://github.com/X16Community/x16-rom) and build it manually. This can be done on Windows using WSL; just remember to install a recent version of Python!

Only the script puts `rom.bin` where BitMagic's emulator will find it automatically. With the other two, you have a `rom.bin` but need to tell BitMagic where it is: the easiest way is to copy it into the same folder as the emulator. Otherwise, point at it with [`--rom`](/emulator#command-line), set `romFile` in the [project file](/debugger/projectfile#properties), or set the environment variable `BITMAGIC_ROM` to its full path.
