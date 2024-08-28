---
title: Multiline Template Code
layout: page
permalink: /debugger/multiline-template-code
---

## Multiline Template Code

When developing your application, it can be necessary to create code in a macro variable and then output that variable to the template.

This is perfectly possible in BitMagic. It works as you'd expect by simply using the inline block mechanism as below.

```asm
var codeblock = "lda #2 \n lda #3";

lda #1
@(codeblock)
lda #4
```

## Debugging

Debugging this code is a little different to norma.

Because BitMagic cannot be sure where of the location original lines of code that made up the string, it will step into the generated file instead. This means breakpoints on the code above will never hit -- this will be obvious by the breakpoint not becoming active.

![Multiline Template Debugging](/Images/TemplateVariablesExample.gif)
