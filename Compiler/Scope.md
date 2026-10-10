---
title: Scope
layout: page
permalink: /compiler/scope
description: How BitMagic scopes constants, labels and definitions, how names are resolved, and keeping names public or private.
---

# Scope

Scope is what keeps the `loop` label in one routine from clashing with the `loop` in the next, and lets a sound library have an `init` that isn't your `init`.

Every name you define (a label, a constant or a variable) belongs to where you wrote it:

- inside a `.proc`, it belongs to that procedure;
- inside a `.scope`, or in a library, it is reached through that scope's name, for example `sound:init`;
- at the top level, it goes into the current scope, which is `Main` unless you have changed it.

You mostly don't have to think about it. When you use a name, the compiler searches outward from where you are, so a procedure can use a constant from its own scope, or a machine constant from `App`, without writing the full path. Spell the path out only when a bare name would be ambiguous: `sound:init`, or `App:sound:init` from the root.

Throughout this page, "name" means any of the three: a label, a constant or a variable.

## The name tree

Names live in a tree. A fully qualified name is the path through it, joined with `:`, so a constant `something` in `.proc test` in the default scope is `App:Main:test:something`.

- **`App`** is the root. It can't be changed. It holds the target machine's constants, such as the VERA register names, which the [project file](/debugger/projectfile#properties) sets for you.
- **Scopes** sit directly under `App` and do not nest inside each other. The default is `Main`. Each one is a flat namespace, and it is the unit a library uses to keep its names to itself. A scope is opened by [`.scope`](/compiler/directives#scope) or attached to a [segment](/compiler/segment).
- **Procedures** form a tree inside the current scope. Each [`.proc`](/compiler/directives#proc) has its own names, and a `.proc` inside a `.proc` nests. Names defined outside any `.proc` go into an anonymous procedure that doesn't show up in qualified names.

{% include generated/scope-name-tree.html %}

## Resolving a name

To resolve a name the compiler:

1. Looks for an exact match at the current level, the procedure or the scope.
2. Looks in the child namespaces for the bare name. This is how a name can reach a sibling procedure.
3. Otherwise repeats one level up, ending at `App`.

The search is case sensitive; if nothing matches, the build fails.

A partially qualified name is resolved the same way, matching the end of the path. Leaving out a middle section makes it a wildcard: `App::counter` matches a `counter` in any one scope, and is an error if more than one matches.

## Switching scope

[`.scope`](/compiler/directives#scope) opens a scope; `.endscope` returns to the enclosing procedure's scope. A named scope is global, so opening the same name again later continues it.

{% include generated/scope-switching.html %}

## Procedure names

A `.proc` defines two names for you.

The **procedure's own name** resolves to its first instruction, so `jsr clear_screen` and `jmp clear_screen` work. It is defined in the enclosing scope, so from elsewhere you write `clear_screen`, or `App:Main:clear_screen` in full.

**`endproc`** is the address just past the procedure's last byte. It belongs to the procedure's own namespace: inside the procedure it is the bare name `endproc`; from outside it is `greeting:endproc`. Every `.proc` gets its own, so they never collide, and a nested `.proc` has an `endproc` separate from the one around it. Put data straight after `.endproc` and read it through `endproc`, and it stays correct if the code changes size.

{% include generated/scope-procedure-names.html %}

## Public and private

Visibility is for writing libraries: it decides what code in other scopes can use, so a library can show its callers the procedures and constants they need and keep everything else to itself. Inside a scope it changes nothing. All the code in a scope can use every name in it, whatever its visibility, so the procedures of a library can share helpers, constants and labels freely.

Procedures, constants and variables are public unless you say otherwise. Put `private` straight after the directive to keep one inside its scope:

| Name | Default | Can be made private | Opened up with |
| --- | --- | --- | --- |
| `.proc` | the scope's default, normally public | `.proc private name` | `.export` |
| `.const`, `.var`, `.padvar`, `.constvar` | the scope's default, normally public | `.const private name value`, `.padvar private byte name`, and so on | `.export` |
| Labels (`.name:` and `.:`) | private | always | `.export` |
| [Operand labels](/compiler/labels#operand-labels) | private | always | `.export` |
| `endproc` | as its procedure | follows it | `.export` |
| `.export` | public | `.export private name value` | |

A private name can be used anywhere in its scope, and nowhere outside it, by any path. Making a procedure private hides everything in it from other scopes too, even names that are public on their own.

{% include generated/scope-visibility.html %}

`public` is accepted as well, and changes nothing unless the scope is private (see below); otherwise it's there for when you want to say so. `public` and `private` are reserved, so neither can be used as a name.

Labels are always private outside their scope, because they're how routines find their way around inside a library, not part of what it offers. For now, using one from another scope (`sound:mix:loop`) still builds, with a warning that suggests `.export`. That will become an error in a later release.

For all of this in one place, the [Visibility example](/examples/visibility) is a small text library that keeps most of itself private: a private scope with one public procedure, and an `.export` that opens up a private variable. It also shows the errors you get when code outside reaches for a private name.

### Private scopes

A library usually wants most of its names private and a few public. Put `private` after `.scope` to make that the default: everything declared in the scope, including inside its procedures, is private unless it says `public`.

{% include generated/scope-private.html %}

`.export` is always public, whatever the scope's default, as it's how a library publishes a name.

The default belongs to the scope, not to one `.scope` line. The first `.scope` for a name sets it, and opening the scope again later with no keyword carries on with it. Opening it again with the other keyword is a build error, and so is a `private` scope with no name. `Main` is public, as it's open before your code starts. A [segment](/compiler/segment) attached to a scope uses that scope's default.

### Exporting a name

`.export` gives a name a second name, and the second one can be public. It can open up anything in the [scope](#the-name-tree) it's written in, whatever its visibility: labels, operand labels, private constants and variables, private procedures and the names inside them, and `endproc`.

{% include generated/scope-export.html %}

When the value is a single name, the export is an alias, not a copy. It has the same value and type as the name it points at, so an exported operand label is still a `byte` or a `ushort`, and an exported procedure is still a procedure. An export can point at another export, which resolves to the original name. A loop of exports is a build error, and so is exporting a `.debugalias`, as that only exists in the debugger.

The value can also be an [expression](/compiler/expressions), evaluated as a `.const` written in the same place would be. One that starts with a name and then adds or subtracts, such as `mixer:sample + 1`, has that name's type at the new address, so the export is still a `ushort` operand, a `byte` variable and so on. An array keeps its element type but not its length, as the offset points into it. Anything else, such as `<buffer` or `RATE * 2`, is a plain constant.

An export can be used anywhere a name can: in code, in `.const`, `.constvar` and `.var` values, and in [`.debugalias`](/compiler/directives#debugalias) expressions. It can also be used before the `.export` line, like any other forward reference.

Exports are public by default; `.export private` keeps the new name inside the scope. Outside its own scope `.export` follows the normal rules, so it can't open up a name another scope keeps private.

The [debugger](/debugger/) ignores all of this. Private names, labels and exports are all listed and can be evaluated. An alias shows the name it stands for, and an expression export shows its expression.

### Private names in templates

A [template](/templateengine/csharp-blocks) method that writes out a private name only works when the code it generates lands in a scope that can see that name. Code a library emits into your procedure is in your scope, so it can't use the library's private names. Export what the generated code needs, or keep the method's output inside the library.

## Libraries and procedures

Importing a [template library](/templateengine/csharp-blocks#library) doesn't give it a scope of its own. Its `.proc`s land wherever the current scope is when the library's code is spliced in, normally `Main`. Two libraries that both define, say, `.proc bsp` collide the moment both are imported into the same file. Wrap a library's procedures in their own [`.scope`](/compiler/directives#scope) to keep them out of each other's way. That also keeps the library's [private](#public-and-private) names private: everything in a scope can use its private names, so a library spliced into `Main` shares them with all of `Main`. A [private scope](#private-scopes) is the easiest way to write one.

## Viewing names

Set the `displayVariables` compile option to `true` to list every name and its value in the build output.
