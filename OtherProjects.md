---
layout: home
title: Other Projects
permalink: /otherprojects/
description: Other tools I've built alongside BitMagic.
---

# Other Projects

Other things I've built that aren't part of BitMagic itself.

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

## ClaudeBox

I run several Claude Code sessions at once, and after a restart it was hard to tell which was which, let alone get them all back. ClaudeBox (`cb`) is a small command-line tool that starts each session in its own named Windows Terminal tab and keeps track of it:

- tabs named and coloured by the type of work, e.g. red for a hotfix
- `cb restore` reopens the sessions that were running when Windows shut down, each in its own folder with its conversation
- `cb ls` shows every session and whether Claude is busy, waiting for you or needs your attention
- sessions are followed through `/clear` and `/resume`, so the right conversation comes back

It's Windows only, as it relies on Windows Terminal for the tabs, and needs Claude Code and .NET 10. Install it from [NuGet](https://www.nuget.org/packages/BitMagic.ClaudeBox.Cli):

```text
dotnet tool install -g BitMagic.ClaudeBox.Cli
```

Then just run `cb` in a folder to start a session there. The source and full command reference are on [GitHub](https://github.com/Yazwh0/ClaudeBox).
