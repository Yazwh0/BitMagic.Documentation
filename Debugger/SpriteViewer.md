---
title: Sprite Viewer
layout: page
permalink: /debugger/spriteviewer
description: Inspect all 128 VERA sprites while debugging, and tint individual sprites in the emulator.
---
# Sprite Viewer

Shows every one of the 128 VERA sprites as it is currently configured.

Note: this can only be viewed while a debug session is active.

## How to open

Open the command palette and run `BitMagic: Open The Sprite Viewer`. See VSCode's [command documentation](https://code.visualstudio.com/api/extension-guides/command) to customise how you access it.

## What it shows

For each sprite the view renders its current graphics (4bpp or 8bpp, from VRAM and the active palette) alongside its attributes:

- VRAM address of the sprite data
- palette offset
- collision mask
- width and height
- X and Y position (sign-extended)
- Z-depth
- horizontal and vertical flip
- colour mode

## Highlighting sprites

Check `Highlight Sprites` and each active sprite is tinted in the emulator's display, one colour per sprite from a fixed 128-colour palette. You can't choose the colours yourself, but it makes a particular sprite easy to pick out on a busy screen. Unchecking the box clears the tint.
