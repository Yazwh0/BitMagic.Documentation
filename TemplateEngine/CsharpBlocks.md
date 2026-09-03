---
title: C# Blocks
layout: page
permalink: /templateengine/csharp-blocks
description: "Writing the C# side of a template: control flow, splicing values into assembly, methods, and the header directives."
---
# C# Blocks

Where a traditional assembler gives you a macro language, BitMagic gives you C#. Any line in a template that isn't an [assembly line](/templateengine/#how-a-line-is-read) is C# that runs while the file is turned into assembly: loops that unroll code, tables worked out at build time, whole routines generated from their arguments. This is where most of BitMagic's power is.

This page covers writing that C#: control flow over your code, splicing values into assembly lines, methods, and the header directives that pull in code.

## Control flow

C# statements run as the file is walked. An assembly line inside a loop or an `if` is emitted once for each pass:

```bmasm
.proc clear
    ldx #0
.loop:
    for (var page = 0; page < 4; page++)
    {
        sta $0400 + @(page * 256), x
    }
    inx
    bne loop
    rts
.endproc
```

The `for` header and the braces are C#. The `sta` line is assembly, so it is emitted four times, with `@(page * 256)` replaced by `0`, `256`, `512` and `768`.

`var`, `if`, method calls and LINQ all work. `System`, `System.Linq`, `System.Collections`, `System.Collections.Generic` and `System.Threading.Tasks` are already imported.

## Values

`@(expr)` inside an assembly line splices in the value of a C# expression:

```bmasm
.const sprites 8
ldx #@(sprites - 1)
```

A line that is just `@expr` emits the string that `expr` evaluates to.

To emit assembly *from* C#, call a method that writes it, such as one from the [BM library](/templateengine/bm-library), as a plain statement with no `@`:

```bmasm
    BM.Petscii("READY.")
```

## Methods

Define methods in the file and call them. Assembly written inside a method lands wherever the method is called, so a call is a parameterised block of code:

```bmasm
void delay(int loops)
{
    ldx #@(loops)
.:
    dex
    bne -
}

    delay(200)
    delay(50)
```

## Header directives

These sit at the top of the file, before the first opcode, `.` line or C#.

A template runs in two phases: a **setup phase** that handles these lines, then the **body**, which walks the rest of the file and produces the assembly.

### library

```text
library Namespace.Class;
```

Marks the file as a library: a bundle of methods for other files to `import`, with no body of its own. Importers name it by `Class`; `Namespace` keeps it distinct. Leave out the `.` and the whole name is the class, with the namespace taken from the filename. A file with no `library` line is a program, and its body runs.

### import

```text
import Name = "file";
```

Builds `file` as a template of its own and brings it in as `Name`; you then call `Name.Method(...)`. The quotes and semicolon are required. `file` is found as an absolute path, then relative to the file doing the import, then by bare name in the `Library` folder next to the debugger. `file` is normally a library.

```bmasm
import BM = "BM.bmasm";

    BM.X16Header()
```

### include

```text
include "file.cs";
```

Adds a C# source file to the build, compiled together with the template so its types are in scope. The path is relative to the `.bmasm` file. It is ordinary C#, not a template: no `Name.` prefix and no `@`.

### using

```text
using Some.Namespace;
```

A C# `using`, added to the generated code. Recognised only in the header, so put it before any body line.

### reference

```text
reference Some.Assembly;
```

Adds a .NET assembly to the build, loaded by name from what the runtime can already resolve. Follow it with a `using` for the namespaces you need. The name is not quoted.

### assembly

```text
assembly "path/to/lib.dll";
```

Like `reference`, but loads the assembly from a file. The path is tried against the project base path, then next to the debugger, then as written.

### nuget

```text
nuget "Package.Id", "1.2.3";
```

Downloads a NuGet package and adds its assemblies to the build, as `assembly` does for each `.dll`. The version is optional.

### The ! prefix

```text
!directive
```

Runs `.directive` in the setup phase, before anything the body emits. It prepends `.` to whatever follows, so any compiler directive works, from anywhere in the file. It does nothing in a `library`. Its main use is setting up [segment](/compiler/segment) layout ahead of the body.

## Writing a library

A library file is a `library` line and a set of methods, with no body:

```bmasm
library MyProject.Screen;

public static void Fill(byte value)
{
    lda #@(value)
    ldx #0
.:
    sta $0400, x
    sta $0500, x
    sta $0600, x
    sta $0700, x
    inx
    bne -
}
```

```bmasm
import Screen = "screen.bmasm";

    Screen.Fill(0x20)
```

Libraries can `import` other libraries.
