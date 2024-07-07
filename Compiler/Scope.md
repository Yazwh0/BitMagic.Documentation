---
title: Scope
layout: page
permalink: /compiler/scope
---

# Scope

A [scope](https://en.wikipedia.org/wiki/Scope_(computer_science)) is a collection of variables, constants and code references. Scopes work in BitMagic how you'd expect them to work in other languages.

Variables in the text below can refer to a label, constant, or other definition.

## Scope Hierarchy

Scopes in BitMagic consist of at least three levels.

The top level is the application, or `App`. This cannot be changed and holds all the predefined constants for the machine, such as the VERA addresses.

The next level down is the 'scope' set in code. By default this is the `Main` scope. This is akin to a namespace in other languages and lets us keep code that performs different functions separate. For example you could define a scope for your sound engine and one for your user input handling. The other prime example is so that libraries can keep their definitions away from the code they're being included into.

The third level is the current procedure. If you do not define a procedure, an anonymous one will be created, however it will not appear in the fully qualified variable names.

Extra layers can be defined by creating nested procedures. These can be name or unnamed to create anonymous scope blocks. As you'd expect, you can't guarantee the name of an anonymous proc. This doesn't mean the variables can be accessed from other scopes.

To create a unique name for each label or constant, the names of the parts are concatenated together with `:` used as a separator.

## Defaults

When a `proc` is defined an entry is made for the address of the proc. This is how `jmp <procname>` is compiled properly. An additional entry is created called `endproc` in the procs scope. This can be useful for storing data after the code.

## Viewing Names

All the variables can be viewed by setting the `compileOptions.displayVariables` to `true`.

## Accessing Variables

The simplest way to access a variable is through its name. If the name doesn't exist in the current scope then BitMagic will move up the scope tree looking for an exact match. This search is case sensitive. If there is no match then an error will be thrown.

A fully or partially qualified name can be used. It its partially qualified it will look up the tree looking for an exact match.

By omitting one section of the name that will act as a wildcard. For example `App::counter` will return counter in a scope, as long as it is unique. If it isn't unique it will error.
