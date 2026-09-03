---
title: Sprite Viewer
layout: page
permalink: /debugger/spriteviewer
description: Inspect all 128 VERA sprites while debugging, and tint individual sprites in the emulator.
---
# Sprite Viewer

Shows every one of the 128 VERA sprites as it is currently configured.

Note: This can only be viewed while there is an active debugging session.

## How to open

Open the command palette and select **Open The Sprite Viewer**.

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

## Debug colours

You can assign a debug colour to individual sprites. The emulator then tints those sprites in its display, which makes it easy to pick a particular sprite out of a busy screen.
