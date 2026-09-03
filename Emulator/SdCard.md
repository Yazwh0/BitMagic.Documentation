---
title: SD Card
layout: page
permalink: /emulator/sdcard
description: Attaching, building, syncing and writing back the emulator's SD card image.
---
# SD Card

The emulator always has an SD card. You can attach an existing image, have one created for you, mirror a host folder onto it, and write it back out when emulation ends.

## Image format

An image is a raw FAT filesystem. Two layouts are supported:

- **BIN** is a plain disk image.
- **VHD** is a Virtual Hard Disk image.

Images can be compressed. A compressed image is named `name.xxx.zip` or `name.xxx.gz`, where `xxx` is `BIN` or `VHD`, for example `mygame.BIN.zip`. The emulator decompresses on load and compresses on save based on that name.

## Attaching or creating

| Option | Effect |
| ------ | ------ |
| `--sdcard <file>` | Attach this image. |
| `--sdcard-size <mb>` | Size of the card to create when `--sdcard` is not given. Default 16. |

With no `--sdcard`, a fresh card of `--sdcard-size` MB is created in memory for the session.

## Populating it

| Option | Effect |
| ------ | ------ |
| `--sdcard-folder <dir>` | Mount a host folder as the card's contents. |
| `--sdcard-file <path>` | Copy a file (or wildcard match) into the card root. Repeatable. |

## Syncing with a host folder

Used with `--sdcard-folder`:

| Option | Effect |
| ------ | ------ |
| `--sdcard-synctox16` | Copy the host folder onto the card at startup. |
| `--sdcard-syncfromx16` | Watch the card while running and write changes back to the host folder. |
| `-y`, `--sdcard-sync` | Both. |

Syncing covers the **root directory only**.

## Writing it back

| Option | Effect |
| ------ | ------ |
| `--sdcard-write <file>` | Write the card image when emulation ends. `.zip` / `.gz` to compress. |
| `--sdcard-overwrite` | Allow `--sdcard-write` to replace an existing file. |
| `-u`, `--sdcard-update` | Shorthand: write back to the `--sdcard` file, overwriting. Requires `--sdcard`. |

## In a project file

The [debugger](/debugger/projectfile) has the equivalent settings: `sdCard`, `sdCardFiles`, `sdCardOutput` and `sdCardFinalOutput`.

## Note

Files copied in from the host may be renamed to 8.3 form by the FAT layer.
