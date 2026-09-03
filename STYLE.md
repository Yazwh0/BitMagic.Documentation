# BitMagic Documentation Style Guide

This defines how the BitMagic docs are written so pages stay consistent as they're
edited and added. If you're changing a page, skim the [checklist](#checklist) at the end.

This file is not published. It's listed under `exclude:` in `_config.yml`.

## Voice

The docs are written by one person who built the tools, talking directly to a
developer who wants to use them. Keep that.

- **First person singular for the maintainer.** "I knew there could be a better way",
  "if you find a bug, let me know". Not "we", not "the BitMagic team".
- **Second person for the reader.** "you", "your project", "the developer". Address
  them directly.
- **Enthusiastic about what works, honest about what doesn't.** Exclamation marks are
  fine for a genuine win ("full frame rate vectors!"). They are not filler; one per
  few paragraphs at most. When something is rough, say so plainly: "the emulator
  isn't an exact match for the official one", "performance of breakpoints with an
  expression is poor", "frame syncing isn't great".
- **Assume 6502 / X16 literacy.** The reader knows what the accumulator, zero page and
  an IRQ are. Don't re-teach the machine. Link to the
  [X16Community docs](https://github.com/X16Community/x16-docs) for hardware behaviour
  and spend the words on BitMagic.
- **A short aside is welcome** where it helps, in parentheses or after a comma. "Yes,
  that is an empty json file!" is on-brand. A paragraph of backstory is only worth it
  when it motivates a feature (see the ca65 origin story in *Made With BitMagic*).

### Tone: do / don't

| Don't | Do |
| --- | --- |
| "BitMagic provides a comprehensive suite of debugging capabilities." | "You can debug your application from within VSCode, like any modern language." |
| "It is recommended that the user obtains a ROM image." | "Before you can run the emulator you'll need a copy of the [ROM](/emulator/rom)." |
| "This feature is currently under development and will be available in a future release." | Either document what exists now, or leave it out. No placeholders. |
| "Utilise the memory viewer to ascertain…" | "Use the memory view to find where a value is stored." |

## Punctuation and grammar

- **UK English throughout.** Spelling (colour, visualise, behaviour, initialise, centre)
  and grammar. See [Spelling and terminology](#spelling-and-terminology).
- **No em-dashes (`—`) and no en-dashes (`–`).** Recast the sentence instead: a comma
  for a light aside, a colon before a list or an explanation, a semicolon between two
  linked clauses, brackets for a true parenthetical, or just a full stop and a new
  sentence.
- **No comma splices.** Two independent clauses need a full stop, a semicolon, or a
  conjunction, not a bare comma.
- **Ranges** are written with "to": `R38 to R48`, `$a000 to $bfff`.
- A plain hyphen `-` is fine inside identifiers and file names (`git-ignored`,
  `hit-count`), never as a sentence dash.

## Page structure

Every page is a Jekyll page and starts with frontmatter:

```yaml
---
layout: page          # "home" for a section landing page, "page" for a leaf
title: Memory Viewer  # Title Case
permalink: /debugger/memoryview   # lowercase, no spaces, section-prefixed, no .html
description: Visualise how the X16 is using memory and search for values in RAM.
---
```

- **`layout`**: `home` for the top page of a section (Compiler, Debugger, Emulator,
  Template Engine), `page` for everything below it.
- **`title`**: Title Case, matches the H1.
- **`permalink`**: lowercase, section-prefixed, no file extension, stable. Once
  published, don't change it; renaming the source file is fine, changing the permalink
  breaks inbound links.
- **`description`**: one sentence, present on every page. It's the search-result
  snippet; without it every page shares the site description.

Then:

1. A single `#` H1 that matches `title`. One H1 per page, never a second.
2. One or two sentences saying what the page is for and who needs it.
3. `##` / `###` headings phrased as tasks: "How to open", "Getting started", "How to
   interpret the data", "Example".

## Formatting

- **Paragraphs are one to three sentences.** If a paragraph runs longer, it's usually a
  list.
- **Lists** for anything enumerable: options, steps, conditions.
- **Tables** for every parameter or option reference. Use a consistent column order:

  ```markdown
  | Name | Type | Optional | Description |
  | ---- | ---- | -------- | ----------- |
  ```

  For command-line flags: `| Argument | Description |`.
- **Inline code** for anything the reader would type or see literally: `project.json`,
  `.bmasm`, `lda #$00`, `BITMAGIC_ROM`, `F5`, `.segment`.
- **Emphasis** with `*asterisks*`. Reserve **bold** for genuine warnings, used
  sparingly.
- **No admonition plugins;** the theme has none. For a caveat, use a plain sentence:
  "Note: this can only be viewed while a debug session is active."

## Code examples

Every concept gets a worked example. Examples are the primary teaching tool here, not
an afterthought.

- **Always tag the fence** with a language: ` ```bmasm `, ` ```asm `, ` ```json `,
  ` ```text `, ` ```c# `. Use `bmasm` for BitMagic assembly with directives or C#
  macros; `asm` for plain 65c02.
- **Show the result inline** with a comment:

  ```bmasm
  lda data + 3   ; loads $13 into the accumulator
  ```

- **Use realistic values.** Hex with a `$` prefix in assembly (`$801`, `$9f20`), `0x`
  prefix in JSON and C# contexts (`0x801`). Be consistent within a page.
- **Keep snippets minimal:** just enough to make the point, no full program unless the
  page is a tutorial.

## Links and images

- **Cross-link with site-absolute permalinks:** `[the compiler](/compiler/)`,
  `[scopes](/compiler/scope)`. Never `[scopes](Scope.md)`; relative `.md` links work
  in the GitHub file browser but 404 on the built site.
- **Images from the site root:** `![Memory Visualiser](/Images/MemoryViewExample.png)`.
  Never `../Images/...`.
- **External links** get a normal inline link. Link out to X16Community, the X16 forums
  and Discord rather than duplicating their material.
- Every how-to page ends with the screenshot or GIF of the feature if one exists in
  `/Images`.

## Spelling and terminology

- **British spelling.** colour, visualise, behaviour, initialise, centre, analyse.
- **Canonical spellings**, use these exactly:

  | Use | Not |
  | --- | --- |
  | X16, Commander X16 | x16, CX16, C16 |
  | VSCode | VS Code, vscode |
  | VERA | Vera, vera |
  | `.bmasm` | bmasm file, BMASM |
  | cc65 | CC65 (ca65 is the assembler specifically) |
  | kernal | kernel (the X16's ROM is the "kernal", deliberate) |
  | ROM, `rom.bin` | Rom, rom |
  | zero page (prose), ZP (code/tables) | zeropage |
  | GitHub Pages | GitLab Pages (the site is on **GitHub** Pages) |
  | 65c02 | 6502c02, 65C02 (lowercase c) |

- **BitMagic** is always one word, capital B, capital M.

## What not to do

- **No perma-banners.** "Documentation is a work in progress while the old docs are
  brought up to date" was on three pages since 2023. If a page is thin, either fill it
  or cut it; don't apologise for it at the top.
- **No "coming soon" / placeholder pages.** Document what ships today.
- **No second H1**, no duplicate `# Title` under the frontmatter `title`.
- **Don't say "GitLab".** It's GitHub throughout.
- **Don't restate the hardware.** Link to X16Community.

## Checklist

Before committing a new or edited page:

- [ ] Frontmatter has `layout`, `title`, `permalink`, `description`
- [ ] One `#` H1, matching `title`
- [ ] Opening sentence says what the page is for
- [ ] Headings are task-phrased
- [ ] Every concept has a language-tagged code example with expected results in comments
- [ ] Parameter/option references are tables with `Name | Type | Optional | Description`
- [ ] All internal links are `/section/page` permalinks, not `File.md`
- [ ] All image links are `/Images/...`
- [ ] UK spelling and grammar; terminology matches the canonical table
- [ ] No em-dashes or en-dashes; no comma splices
- [ ] No "work in progress" banner, no placeholder sections
- [ ] Screenshot/GIF at the end if the feature has one
