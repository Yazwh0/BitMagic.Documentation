# Obtaining a Rom

As the Commander X16 Rom containers licensed code, it cannot be distributed with the BitMagic binaries.

It needs a ROM version of 'R46' or later.

There are two ways to obtain a copy of the Rom:

- Download and install the latest version of the [Official Emulator](https://github.com/X16Community/x16-emulator/actions)
- Clone the official [Rom repository](https://github.com/X16Community/x16-rom) and build it manually. This can be done on Windows using WSL, just remember to install a recent version of python!

The easiest way to reference the rom and the symbols is to set `EmulatorDirectory` in your `project.json` and the debugger will use the files required.

Alternatively once you have the `rom.bin` you can either use command line parameters, config files to reference it by either setting it with `RomFile` in the `project.json`, or for simplicity create a environment variable `BITMAGIC_ROM` that has the full path and filename of the rom file.
