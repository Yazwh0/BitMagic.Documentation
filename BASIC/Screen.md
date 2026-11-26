---
layout: page
title: Screen and Live View
permalink: /basic/screen
description: See the X16's screen in a VSCode tab, type into it, and watch a BASIC program's line and variables while it runs.
---
# Screen and Live View

You can keep everything in VSCode while debugging BASIC: the X16's screen is in a tab beside your code, and the *X16 BASIC Live* view shows the program's line and variables while it runs.

## The X16 Screen

The *X16 Screen* tab opens beside your code when debugging starts. It shows the X16's display, updated while the program runs.

If you close it, *X16 BASIC: Show the X16 Screen* from the command palette opens it again. To stop it opening by itself, turn off `bitMagicX16Basic.openScreen` (see [Settings](/basic/settings)).

The emulator's own window still opens as well, as it does for any BitMagic session.

### Typing

Click the screen and type: the keys go to the X16, as they would from its keyboard. That's how you answer an `INPUT` or `GET`, or type at `READY` once the program has finished.

The status line under the screen says whether your typing is going to the X16. Shift, Control, the cursor keys, the function keys and the keypad all work. Keys that VSCode itself uses, such as `F5`, may still go to VSCode.

## Seeing output when you stop

Normally the X16's screen is drawn line by line as the beam moves down it, so when the debugger stops part way through a frame, the bottom of the screen can still show the last frame. For assembly that's useful, as you can see where the beam is.

BASIC doesn't race the beam, so when it stops the debugger draws the whole screen from VERA as it is. Step over a `PRINT` and you see what it printed straight away. The emulation itself isn't affected: when you carry on, the beam picks up where it was.

If you'd rather see the screen as the beam left it, set `renderOnStop` to `false` in `launch.json`.

## X16 BASIC Live

The *X16 BASIC Live* view is in the *Run and Debug* sidebar. While the program runs it shows:

- the line it's on, also highlighted in the editor;
- the variables and arrays, with values that have just changed highlighted;
- the free memory.

It updates a few times a second, so you can watch a loop count up or a score change without stopping the program.
