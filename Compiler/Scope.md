---
title: Scope
layout: page
permalink: /compiler/scope
description: How BitMagic scopes constants, labels and definitions, and how names are resolved.
---

# Scope

Scope is what keeps the `loop` label in one routine from clashing with the `loop` in the next, and lets a sound library have an `init` that isn't your `init`.

Every name you define (a label, a constant or a variable) belongs to where you wrote it:

- inside a `.proc`, it is private to that procedure;
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

## Viewing names

Set the `displayVariables` compile option to `true` to list every name and its value in the build output.
