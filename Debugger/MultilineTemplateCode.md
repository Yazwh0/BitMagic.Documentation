---
title: Multiline Template Code
layout: page
permalink: /debugger/multiline-template-code
description: Debugging 65c02 code that was generated from a macro string rather than written inline.
---

# Multiline Template Code

Sometimes it's easier to build up a block of code in a string variable and drop the whole thing into the template at once, rather than writing it inline.

BitMagic supports this through the same inline block mechanism you'd use for anything else:

```bmasm
var codeblock = "lda #2 \n lda #3";

lda #1
@(codeblock)
lda #4
```

## Debugging

Debugging this code works a little differently.

BitMagic can't map the generated instructions back to the original lines inside the string, so stepping goes into the generated file instead. Breakpoints placed on the lines inside the string never hit; you'll notice this because the breakpoint never becomes active.

![Multiline Template Debugging](/Images/TemplateVariablesExample.gif)
