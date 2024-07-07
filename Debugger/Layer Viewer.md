---
title: Layer Viewer
layout: page
permalink: /debugger/layerviewer
---

# Layer Viewer

The layer viewer lets the developer see what each layer looks like from withing VSCode.

Note: This can only be viewed while there is an active debugging session.

## How To Open

To open the view, open the command palette and select `BitMagic: Open The Layer View`. Consult the VSCode [documentation](https://code.visualstudio.com/api/extension-guides/command) on how to customise access to that and other commands.

The Update button will refresh all the 6 windows, while doing so with the automatically update checked box set will update the displays in real time. Please note there is not frame control on this view, so there might be tearing or similar artifacts not present on the actual hardware. For a perfect view, pause the emulation and click Update.

## Explanation

Layer 0 and 1 are what is rendered to each of those layers. The sprite layers are based on the 'Z-depth' of the sprite. The background is the background colour as the layer is rendered. If all six are combined by passing through where the layer is transparent to the first coloured pixel you get to the actual screen on the machine.

![Layer View](/Images/LayerViewExample.png)
