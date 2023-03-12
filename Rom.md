# Obtaining a Rom

As the Commander X16 Rom containers licensed code, it cannot be distributed with the BitMagic binaries.

There are two ways to obtain a copy of the Rom:

- Download the latest version of the [Official Emulator](https://github.com/X16Community/x16-emulator/actions), and copy the `rom.bin` out of the archive to somewhere suitable.
- Clone the official [Rom repository](https://github.com/X16Community/x16-rom) and build it manually. This can be done on Windows using WSL, just remember to install a recent version of python!

Once you have the `rom.bin` you can either use command line parameters, or config files to reference it. Or for simplicity create a environment variable `BITMAGIC_ROM` that has the full path and filename of the rom file.
