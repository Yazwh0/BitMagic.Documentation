---
layout: home
title: Examples
permalink: /examples/
description: Example projects that each show off a different part of BitMagic.
---

# Examples

The [BitMagic.Examples](https://github.com/Yazwh0/BitMagic.Examples) repository has a set of small projects, each showing a different BitMagic feature. Most are ready to go: open the folder in VSCode and press `F5`. A few need some setup first, so check the example's page.

Clone it with submodules, as some examples pull in other repositories:

```text
git clone --recurse-submodules https://github.com/Yazwh0/BitMagic.Examples.git
```

{% comment %}
The list and the example pages are generated from the READMEs in BitMagic.Examples
by tools/examples/sync.mjs. Edit the README, then re-run the script.
{% endcomment %}
{% for example in site.data.examples %}
## [{{ example.title }}]({{ example.url }})

{{ example.description }}

{% endfor %}
