# BitMagic - The Emulator

The Emulator emulates the Commander X16 for general use.

Before you can run the emulator, you will need to obtain a copy of the [Rom](Rom.md).

## Command Line Arguments

| Argument               | Description|
| -----------------------|-|
| -p, --prg              | `.prg `file to load. |
| -r, --rom              | `rom.bin` file to load, will look for rom.bin using locally or falling back to the `BITMAGIC_ROM` environment variable. |
| -a, --address          | Start address. |
| -c, --code             | Code file to compile. Result will be loaded at 0x801.
| -w, --write            | Write the result of the compilation.
| --warp                 | Run as fast as possible.
| -s, --sdcard           | SD Card to attach. Can be a `.zip` or `.gz` file, in the form `name.xxx.zip`, where xxx is either BIN or VHD.
| --sdcard-size          | SD Card size in mb if the card is being created by the emulator.
| -d, --sdcard-folder    | Set the home folder for the SD Card.
| --sdcard-synctox16     | Sync any changes to the home directory to SD Card. Root directory only.
| --sdcard-syncfromx16   | Sync any changes to SD Card to the home directory. Root directory only.
| -y, --sdcard-sync      | Sync any changes to SD Card to the home directory, or vice versa. Root directory only. Same as setting --sdcard-synctox16 --sdcard-syncfromx16.
| -f, --sdcard-file      | File to add to the SD Card root directory. Can add multiple files and use wildcards.
| --sdcard-write         | SD Card file to write at the end of emulation. Can be a `.zip` or `.gz` file, in| the form `name.xxx.zip`, where xxx is either BIN or VHD.
| --sdcard-overwrite     | When writing the SD Card file, it can overwrite.
| -u, --sdcard-update    | Sets 'sdcard-write' to the 'sdcard' parameter and enables overwrite.
| --help                 | Display this help screen.
| --version              | Display version information.
