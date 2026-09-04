---
title: Layer Viewer
layout: page
permalink: /debugger/layerviewer
description: See what each VERA layer, sprite layer and the background are rendering while debugging.
---

# Layer Viewer

The layer viewer lets you see what each VERA layer looks like from within VSCode.

Note: this can only be viewed while a debug session is active.

## How to open

Open the command palette and run `BitMagic: Open The Layer View`. See VSCode's [command documentation](https://code.visualstudio.com/api/extension-guides/command) to customise how you access it.

Update refreshes all six windows once; with `Automatically Update` checked, they refresh continuously in real time. There's no frame sync on this view, so you may see tearing or similar artifacts that wouldn't happen on real hardware. For an exact view, pause the emulator and click Update.

## What it shows

Six windows, one per compositing layer, front to back: `Sprite 3`, `Layer 1`, `Sprite 2`, `Layer 0`, `Sprite 1`, and `Background`. `Layer 0` and `Layer 1` are VERA's two tile/bitmap layers; the three sprite windows each show the sprites set to one Z-depth; `Background` is VERA's flat background colour.

Combine all six from front to back, letting each transparent pixel show through to the next, and you get what's shown on the actual screen.

![Layer View](/Images/LayerViewExample.png)
