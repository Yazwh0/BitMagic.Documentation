---
layout: page
title: ROM
permalink: /emulator/rom
description: How to obtain the Commander X16 ROM and point the emulator at it.
---
# ROM

The Commander X16 ROM contains licensed code, so you'll need to obtain your own copy before using the emulator. BitMagic needs ROM version `R46` or later.

There are three ways to get one:

- Run `x16e --fetch-rom` (or `X16E --fetch-rom` from a downloaded build). It downloads the latest ROM release from the [x16-rom repository](https://github.com/X16Community/x16-rom) and saves `rom.bin` to your BitMagic folder: `%LOCALAPPDATA%\BitMagic` on Windows, `~/.local/share/BitMagic` on Linux. That's all the emulator needs. The same scripts are in a downloaded build's folder as `fetch-rom.bat` and `fetch-rom.sh`; pass a folder as the first argument to save `rom.bin` somewhere else.
- Download and install the latest version of the [Official Emulator](https://github.com/X16Community/x16-emulator/actions), which comes bundled with a `rom.bin`.
- Clone the official [ROM repository](https://github.com/X16Community/x16-rom) and build it manually. This can be done on Windows using WSL; just remember to install a recent version of Python!

Only `--fetch-rom` puts `rom.bin` where BitMagic's emulator will find it automatically. With the other two, you have a `rom.bin` but need to tell BitMagic where it is: the easiest way is to copy it into your BitMagic folder above. Otherwise, point at it with [`--rom`](/emulator#command-line), set `romFile` in the [project file](/debugger/projectfile#properties), or set the environment variable `BITMAGIC_ROM` to its full path.

The emulator looks for a ROM in this order:

1. `--rom`
2. `rom.bin` in the current folder
3. `BITMAGIC_ROM`, either the file or the folder containing it
4. your BitMagic folder

Note: the BitMagic folder is only used by the standalone emulator. The [debugger](/debugger/) doesn't look there, so for debugging set `romFile` in the [project file](/debugger/projectfile#properties) or set `BITMAGIC_ROM`.
