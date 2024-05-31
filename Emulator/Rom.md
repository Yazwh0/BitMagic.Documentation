---
layout: page
title: Rom
permalink: /emulator/rom
---
## ROM File

When using the Emulator you will need to obtain a copy of of the ROM. This is because the Commander X16 Rom containers licensed code.

It needs a ROM version of 'R46' or later.

There are two ways to obtain a copy of the Rom:

- Download and install the latest version of the [Official Emulator](https://github.com/X16Community/x16-emulator/actions)
- Clone the official [Rom repository](https://github.com/X16Community/x16-rom) and build it manually. This can be done on Windows using WSL, just remember to install a recent version of python!

Once you have the `rom.bin` the easiest way to use it is to simply copy it to the same folder as the emulator. Otherwise you can either use command line parameters, config files to reference it by either setting it with `RomFile` in the `project.json`, or create a environment variable `BITMAGIC_ROM` that has the full path and filename of the rom file.
