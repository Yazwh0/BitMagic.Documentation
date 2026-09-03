---
layout: home
title: Getting Started
permalink: /getting-started
description: Install BitMagic, scaffold a project, run it in the emulator and set your first breakpoint.
---
# Getting Started

This takes you from nothing to a running, debuggable X16 program.

## 1. Install the extension

In VSCode open the Extensions view, search for **BitMagic**, and install *BitMagic X16 Debugger* (`yazwh0.bitmagic`).

On first run the extension downloads its own copy of the .NET runtime and the official emulator. Both can be pointed elsewhere in the settings.

## 2. Get a ROM

The X16 needs its ROM, which isn't redistributable. If you leave the *download the official emulator* setting on (the default), the extension fetches a ROM for you and there is nothing to do here. Otherwise, see [ROM](/emulator/rom) for how to supply one.

## 3. Create a project

Open the command palette and run **Create BitMagic Project**. Pick an empty folder. BitMagic writes:

```text
.
├── .vscode/
│   └── launch.json     the "Debug Application" config, pointed at project.json
├── src/
│   └── main.bmasm      a stub program
├── project.json        source file, output folder and compile options
├── .gitignore          ignores bin/ and app/
├── bin/                build intermediates
└── app/                the built .prg
```

`src/main.bmasm` starts as:

```bmasm
import BM="bm.bmasm";

BM.X16Header();
	nop

; your code here

	stp
.loop:
	jmp -loop
```

`import BM` pulls in the [BM library](/templateengine/bm-library); `BM.X16Header()` emits the BASIC stub so the program runs when it loads. The CPU executes `nop`, then hits `stp`, which halts it and breaks into the debugger. The `jmp` loop after is just a safety net.

## 4. Run it

Press `F5`. The emulator window opens, VSCode switches to debug mode, and the run stops on the `stp` line. Have a look at the Variables view, then stop the session with the red square in the debug toolbar.

## 5. Make it do something

Replace `; your code here` with:

```bmasm
	lda #$41        ; 'A'
	jsr $ffd2       ; CHROUT prints a character
```

`F5` again. The emulator prints `A`.

## 6. Set a breakpoint

Click the gutter next to the `lda` line to set a breakpoint, and `F5`. Execution stops on that line *before* it runs. In the Watch pane add `CPU.A`; it reads `0`. Press `F10` to step over the `lda`, and `CPU.A` becomes `$41`.

See [Watches and Breakpoints](/debugger/watchesandbreakpoints) for what else the Watch pane takes. From here, reach for the [compiler directives](/compiler/directives) and the [template engine](/templateengine/) as the program grows.

## Where next

- [The Compiler](/compiler/): segments, scopes, labels, expressions.
- [The Template Engine](/templateengine/): generating code with C#.
- [The Debugger](/debugger/): the memory, layer, history and sprite views.
