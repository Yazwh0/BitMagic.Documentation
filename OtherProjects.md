---
layout: home
title: Other Projects
permalink: /otherprojects/
description: Another tool I've built alongside BitMagic.
---

# Other Projects

Something else I've built that isn't part of BitMagic itself, but came out of building it.

## BitMagic MASM (ml64) Syntax Highlighting

The emulator core is hand-written x64 MASM assembly, and Visual Studio's own tooling for `.asm` files is thin. I built this extension for Visual Studio 2022 and 2026, with the following features:

- syntax colouring
- Go To Definition, QuickInfo tooltips, reference highlighting and Peek Definition
- Go To All symbol search
- statement completion, including struct members after a `.`
- structural diagnostics
- comment/uncomment, outlining and brace matching

There's no build integration and no parameter IntelliSense; it's an editor extension, not a language toolchain.

Install it from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=Yazwh0.Masm64SyntaxHighlighting), or find the source on [GitHub](https://github.com/Yazwh0/BitMagic.MasmSyntaxHighlighting).
