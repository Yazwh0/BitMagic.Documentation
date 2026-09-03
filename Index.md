---
layout: home
permalink: /
title: What is BitMagic?
description: "BitMagic is a Commander X16 development suite for VSCode: compiler, debugger and emulator."
---
# What is BitMagic?

BitMagic is a development suite for the Commander X16, delivered as a VSCode extension. It brings together three things:

- a **compiler** for 65c02 assembly, with a C# macro system for generating code;
- a source-level **debugger**, so you step, breakpoint and inspect the X16 like any modern language;
- an **emulator** for the X16, which the debugger runs and which also ships standalone.

Compatibility with real hardware is good but not 100%. You can follow the open issues on [GitHub](https://github.com/Yazwh0/BitMagic/issues).

BitMagic rounds off the sharp corners of 65c02 development, making retro dev fun!

## Start here

- [Getting Started](/getting-started): install, scaffold a project, run it, set a breakpoint.
- [The Compiler](/compiler/): assembling `.bmasm` source, segments and scopes.
- [The Template Engine](/templateengine/): generating code with C#.
- [The Debugger](/debugger/): debugging the X16 inside VSCode.
- [The Emulator](/emulator): running the X16 standalone.

## Support

This is a one-person project, so support is limited.

Bug reports and other BitMagic issues go on the [GitHub issue tracker](https://github.com/Yazwh0/BitMagic/issues), where they won't get lost.

For questions about the X16 itself, start with the [X16Community docs](https://github.com/X16Community/x16-docs/tree/master), then the [X16 forums](https://cx16forum.com/forum/) or the associated [Discord](https://discord.gg/nS2PqEC).

![Debugger Example](/Images/DebuggerExample.png)
