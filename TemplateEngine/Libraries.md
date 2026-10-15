---
title: Libraries
layout: page
permalink: /templateengine/libraries
description: "Write libraries in plain bmasm with 'file library', split them into sections, and choose where each library's code goes with 'place'."
---
# Libraries

A library is a file other files `import`. This page covers writing one in plain bmasm, with no C#, and choosing where its code ends up in your program.

A library splits its code into named **sections**, such as `setup` for declarations and `code` for procedures. Each section is written wherever the program **places** it. If you don't place it, it goes in a sensible default spot. You can make your own sections, decide how they're written, and even define new kinds of file.

## Write a library in plain bmasm

Start the file with `file library`, then put each part of the library under a `section` line:

{% include generated/libraries-file-library.html %}

- `file library` must be the first line that isn't blank or a comment.
- `section` has no `.`. Like `import`, it's read by the template engine, a level above the [compiler](/compiler/).
- Every line of asm must be in a section. Asm before the first `section` is an error, reported at that line.
- A section can appear more than once in a file. Each `section` line just switches which section the following lines go into.
- Template code, `@(...)` and C# loops, still works anywhere in the file.

A library with only one section can name it on the `file` line instead:

{% include generated/libraries-starting-section.html %}

## Use a library

Import it as usual:

{% include generated/libraries-main-default.html %}

With nothing else in `main`, the program comes out in this order:

```text
every library's setup
main
every library's code
```

`setup` is written before `BM.X16Header()`, so keep it to declarations: segments, variables and constants. Code there would land ahead of the BASIC stub.

A library imported by several files is only written once. A library that only another library imports is still written: every library's `Initialise()` runs once, after the libraries it imports.

## Choose where sections go

`place <section>` writes a section at that point. It works in any file, not only `main`:

{% include generated/libraries-place.html %}

A section you place isn't placed again by the default. Writing `place code` twice is an error.

## Place one library's code

Different libraries often belong in different places, say DOS code in a RAM bank and decompression code in the main program. `place <alias>.<section>` places one library's part of a section, where the alias is the name it was imported as:

{% include generated/libraries-place-one.html %}

- `place code` takes every part of `code` that isn't placed anywhere else. The order of the `place` lines doesn't matter.
- If nothing writes `place code`, whatever is left still goes in the default spot.
- To place a library you don't use directly, such as one another library imports, import it as well to give it an alias. Imports are only built once, so this costs nothing.

## Make your own section

Any name works. Only `setup` and `code` have a default spot, so any other section must be placed:

{% include generated/libraries-own-section.html %}

{% include generated/libraries-own-section-use.html %}

If nothing places it, the build fails and names the libraries whose code would be lost:

```text
Section 'irq' has code from 'music.bmasm' that is never placed. Add 'place irq', or 'place <alias>.irq' for one library.
```

## Change how a section is written

By default, placing a section writes each library's part in turn. A library can replace that by setting the section's `Writer`, which is called once for each place the section is written, with the parts placed there:

{% include generated/libraries-writer.html %}

Now any file that imports `irqchain.bmasm` gets the whole handler from a single `place irq`.

## Give a library settings and C# of its own

A `members` line starts C# for the library itself: fields, methods and classes, such as a builder the app uses to choose what the library includes. Everything after it, up to the next `section` line or the end of the file, is part of the library's class rather than its code:

{% include generated/libraries-members.html %}

{% include generated/libraries-members-use.html %}

- A library's file runs once the app has run, so its sections see whatever the app set, wherever in the app it set it.
- Methods in `members` that write assembly, such as a macro the app calls, write it into the app, where the app calls them.
- `library Namespace.Class;`, after the `file library` line, names the library's class, so other C# can refer to its types by name. Without it, the name comes from the file's name.

## Add sections from a C# library

A library with C# helpers keeps the `library Namespace.Class;` form, and adds its sections from `Initialise()`. `Owner` is the library's source file:

{% include generated/libraries-csharp.html %}

`Initialise()` only registers sections, so keep it free of output: calling `Setup()` directly would write the code straight away, where `place` can't move it. Do any C# set up that `main` relies on there too, such as registering a callback that `main` reads while it runs, since section code is only written after `main` has run.

A library only registers its own code. Every library it imports is initialised as well, so registering an imported library's code yourself would write it twice.

## Write your own kind of file

`file <kind>` hands the file to a **view**, an ordinary library called `<kind>.bmasm`. It's found like an import: next to the file, then in BitMagic's own library folder. `file library` is just the view `library.bmasm` that ships with BitMagic, written with the same API as any other view.

A view needs a `Process(ViewFile file)` method. It can also claim keywords of its own, which then work like `section` does in a library:

{% include generated/libraries-view.html %}

{% include generated/libraries-view-use.html %}

Anything after `file <kind>` is passed to the view untouched, as `file.Arguments`.

## What the build checks

Every part of every section is tracked, so code is never written twice and never silently dropped:

| Mistake | Error |
| --- | --- |
| Asm before the first `section` | `'lda #1' is before the first 'section'. Every line in a 'file library' file must be in a section, or name a starting section: 'file library code'.` |
| `place code` twice | `'place code' is already used at main.bmasm(31).` |
| `place Dos.code` twice | `'dos.bmasm' code is already placed at main.bmasm(12).` |
| An alias that isn't imported | `'Dso' isn't an import in this file.` |
| A section the library doesn't have | `'dos.bmasm' has no 'cod' section.` |
| A section nothing places | `Section 'irq' has code from 'music.bmasm' that is never placed. ...` |
| A `file` file listed as the program | `A 'file library' file can't be built on its own. Import it from the main file.` |

## The section API

These live in `BitMagic.TemplateEngine.Objects`, which every template can already use.

| Name | Type | Optional | Description |
| --- | --- | --- | --- |
| `Section.Get(name)` | `Section` | No | The section with that name, created on first use. |
| `section.Add(owner, write)` | method | No | Adds a library's code. A second call for the same owner is ignored. |
| `section.Place()` | method | No | Places every part not placed by library, here. |
| `section.Place(file, line, owner)` | method | No | Places one library's part, here. |
| `section.PlaceAt(anchor, ...)` | method | No | As `Place`, at an anchor rather than here. |
| `section.Writer` | `Action<IReadOnlyList<SectionPart>>` | Yes | How a placement is written. Defaults to writing each part in turn. |
| `section.RestPlaced` | `bool` | No | Whether `place <section>` has been used. |
| `Build.OnStart(action)` | method | No | Runs after every library's `Initialise()`, before `main`. |
| `Build.OnEnd(action)` | method | No | Runs after `main`, before the sections are written. |
| `Template.Anchor()` | `Anchor` | No | Marks the current spot in the output, to be written to later. |
| `Template.WriteTo(anchor)` | `IDisposable` | No | Sends the output to the anchor until disposed. |
| `Template.Capture(body)` | `IReadOnlyList<CapturedItem>` | No | Runs `body` and returns what it wrote. |
| `Template.Write(items)` | method | No | Writes captured items, keeping their source lines for errors and the debugger. |
| `ViewException(item, message)` | exception | No | An error reported at a line of the viewed file. |
