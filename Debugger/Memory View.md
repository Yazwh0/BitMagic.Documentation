---
title: Memory Viewer
layout: page
permalink: /debugger/memoryview
---

# Memory Viewer

The memory view is a visual representation of how the system is using its memory.

It also includes a search functionality to allow developers to find where values are stored.

## How to open

To open the view, open the command palette and select `BitMagic: Open The Memory View`. Consult the VSCode [documentation](https://code.visualstudio.com/api/extension-guides/command) on how to customise access to that and other commands.

## Memory View Visualisation

The Main Ram image is a 256x256 image, where each pixel is a memory location within the 64k that the CPU can see.

When you click update, the image will refresh to indicate all the reads, writes and execution locations since the last time the Update button was clicked.

Because the image is based on the changes since the last update it lets you visualise how functions work, so you could place a breakpoint before calling a kernel function. Update the memory view. Step over the kernel call, and clicking Update will display what that call effected.

There is also a 'Automatically Update' checkbox, which will request the changes as fast as possible. Please not there is no syncronisation when this is happening. However it will give you a real-time view of what is happening on the machine.

### Colours

Each pixel is made up of three conditions:

- Dark green, a location that has previously been written. Good for visualising unused RAM.
- Light green, a location that was written to in this update.
- Blue, a location that was read from in this update.
- Red, a location that was executed from in this update. Only the opcode location is coloured, not the parameters.

As a pixel will be made up of three colours, the result is the combination of what has happened. For example a yellow pixel is where a write and a execution has occurred. A cyan pixel is where both a read and a write has occurred.

![Memory Visualiser](/Images/MemoryViewExample.png)

## Memory Value Search

Under the visualiser are controls that allow the developer to search for values in RAM.

### Starting Value

First make sure the debugger is paused.

Initially we need to tell the debugger what data length value we're searching for, either a `byte` or a `word`.

You can also enter a value, or leave the box empty so the debugger can consider all memory locations.

Now let the debugger run again until the condition you want to search for has happened.

### Iterations

Pause the debugger.

From here you can reduce the search results. You can do this by looking for addresses in the current search results that are now:

- Equal to the value entered.
- Not Equal to the value entered.
- Less than the value entered.
- Greater than the value entered.
- Where the address has changed value.
- Where the address hasn't changed value.
- Where the value at the address as gone up.
- Where the value at the address has gone down.

Select from the dropdown the search type and set the optional value, then click search. This will reduce the result set and add a new column showing the new value.

From here it should be able to location the address you're looking for.

Clicking Reset starts the process again.

For example searching for the memory location for the row the cursor is on in BASIC.

![Cursor Row Search](/Images/memorysearch.gif)
