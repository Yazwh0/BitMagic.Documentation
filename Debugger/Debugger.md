---
layout: home
title: Debugger
permalink: /debugger/
---
# The Debugger

[![Build](https://github.com/Yazwh0/BitMagic/actions/workflows/build-test.yml/badge.svg)](https://github.com/Yazwh0/BitMagic/actions/workflows/build-test.yml)

You can debug your applications from within VSCode, like you would any modern language. Because we use VSCode to provide the IDE, it means we can leverage the interface to provide the best developer experience possible.

## Host System Compatibility

The machine must have a x64 CPU, as the underlying emulator is written in x64 assembler.

Windows is *beta*.

Linux is *beta*. Tested using Ubuntu.

Apple devices are not supported but if its x64 based it *might* work. Try overriding the system check via VSCode's settings menu and let me know!

## Installation

You can obtain the VSCode extension from the extensions market place. Simply search for `BitMagic` and click install.

By default the extension will download its own copy of the DotNet runtime and a copy of the official Emulator. This can be overridden in the settings.

## Getting Started

The easiest way to get something working is to create a `project.json` file as follows.

```json
{
}
```

Yes, that is a empty json file! With no settings it will simply launch to the X16 BASIC prompt.

Go to the debug and run screen, click on `create a launch file`, and then on `BitMagic X16 ASM Debugger`.

![Debug and Run](/Images/DebugAndRun.png)

This will create a `launch.json`. Hit `F5` to run, and type `project.json`. A emulator window will then appear and VSCode will switch to its debugging mode. Click the pause button to see what the X16 is up to!

If you don't want to enter the filename of what to debug each time, change the `program` entry in `launch.json` by replacing `${command:AskForProgramName}` with `project.json`.

![Debugger Running](/Images/DebuggerRunning.png)
