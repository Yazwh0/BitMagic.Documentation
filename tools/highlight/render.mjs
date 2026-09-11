// Pre-renders .bmasm example files into syntax-highlighted HTML, using the
// real BitMagic.VSC TextMate grammar (source.bmasm) instead of relying on
// GitHub Pages' Rouge highlighter, which doesn't know 65c02 or any BitMagic
// directive.
//
// Run from a full superproject checkout (BitMagic.VSC must be a sibling of
// BitMagic.Documentation): `node tools/highlight/render.mjs`.
//
// For every _examples/<name>.bmasm this writes _includes/generated/<name>.html,
// which pages pull in with `{% include generated/<name>.html %}`. Re-run after
// editing any .bmasm source or after the grammar itself changes; commit the
// regenerated .html alongside the .bmasm change.

import { createHighlighter } from "shiki";
import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(here, "..", "..");
const grammarPath = path.resolve(
  docsRoot,
  "..",
  "BitMagic.VSC",
  "Bitmagic.VscExtension",
  "syntaxes",
  "bmasm.tmLanguage.json"
);
const examplesDir = path.join(docsRoot, "_examples");
const outDir = path.join(docsRoot, "_includes", "generated");

if (!existsSync(grammarPath)) {
  console.error(
    `Can't find the bmasm grammar at ${grammarPath}.\n` +
      "This script needs BitMagic.VSC checked out as a sibling of BitMagic.Documentation " +
      "(clone the superproject with --recurse-submodules)."
  );
  process.exit(1);
}

const grammar = JSON.parse(await readFile(grammarPath, "utf8"));
// Shiki wants an explicit lowercase `name` to key the language by; the grammar
// file's own "name" is a human-readable title ("BitMagic X16 Asm"), not that key.
const bmasmLang = { ...grammar, name: "bmasm" };

// bmasm.tmLanguage.json's own pattern list falls through to `source.csasm` for
// anything that isn't assembly -- that's how a template's C# control flow
// (for/if/method bodies around the asm lines) gets tokenised at all. Shiki
// resolves that cross-grammar include by scopeName, so both have to be
// loaded, even though only bmasm is ever passed as the `lang` option below.
const csasmGrammarPath = path.join(path.dirname(grammarPath), "csasm.tmLanguage.json");
const csasmGrammar = JSON.parse(await readFile(csasmGrammarPath, "utf8"));
const csasmLang = { ...csasmGrammar, name: "csasm" };

// Matches the palette in assets/css/style.scss: muted comments, one accent
// for keywords/opcodes/directives, pink for numbers (the same pink already
// used for `inline code`), gold for strings. Everything else is left as
// defaultColor so identifiers/operands don't fight for attention -- see the
// comment above the Rouge rules this replaces.
const theme = {
  name: "bitmagic-docs",
  type: "dark",
  // Matches --fg in style.scss, so unstyled tokens (identifiers, operators,
  // punctuation) look identical to this theme's default body text.
  colors: { "editor.foreground": "#eaeaea" },
  settings: [
    {
      scope: ["comment.line.bmasm", "comment.block.bmasm", "punctuation.definition.comment.bmasm"],
      settings: { foreground: "#8f8f8f", fontStyle: "italic" },
    },
    {
      scope: [
        "entity.name.function.bmasm.6502",
        "entity.name.function.bmasm.65c02",
        "entity.name.function.pseudofunction.bmasm",
        "entity.name.function.bmasm",
        "keyword.control.block.bmasm",
        "keyword.type.bmasm",
      ],
      settings: { foreground: "#b5e853" },
    },
    {
      scope: [
        "constant.numeric.binary.bmasm",
        "constant.numeric.hex.bmasm",
        "constant.numeric.decimal.bmasm",
      ],
      settings: { foreground: "#ff79c6" },
    },
    {
      scope: [
        "string.quoted.double.bmasm",
        "string.quoted.single.bmasm",
        "constant.character.escape.bmasm",
      ],
      settings: { foreground: "#e6db74" },
    },
    // Broad fallbacks for the embedded C# (source.csasm) a template's control
    // flow and method bodies pull in around the asm lines -- not a full
    // theming of the C# grammar, just enough that a `for`/`if`/method
    // signature reads the same way the bmasm-specific rules above do.
    // Listed after the specific bmasm.* rules so those still win: theme
    // matching prefers the more specific scope when both could apply.
    { scope: ["comment"], settings: { foreground: "#8f8f8f", fontStyle: "italic" } },
    { scope: ["keyword", "storage"], settings: { foreground: "#b5e853" } },
    { scope: ["constant.numeric"], settings: { foreground: "#ff79c6" } },
    { scope: ["string"], settings: { foreground: "#e6db74" } },
  ],
};

const highlighter = await createHighlighter({
  themes: [theme],
  langs: [bmasmLang, csasmLang],
});

await mkdir(outDir, { recursive: true });

const files = (await readdir(examplesDir)).filter((f) => f.endsWith(".bmasm"));

if (files.length === 0) {
  console.warn(`No .bmasm files found in ${examplesDir}`);
}

for (const file of files) {
  const src = await readFile(path.join(examplesDir, file), "utf8");
  let html = highlighter.codeToHtml(src.replace(/\n$/, ""), {
    lang: "bmasm",
    theme: "bitmagic-docs",
  });

  // Drop Shiki's own inline background/foreground on the wrapping <pre> --
  // #main_content pre already supplies that chrome, so a highlighted block
  // matches an unhighlighted one. Per-token <span style="color:..."> is left
  // alone; that's the actual highlighting.
  html = html.replace(/<pre[^>]*>/, '<pre class="shiki">');

  const outName = file.replace(/\.bmasm$/, ".html");
  await writeFile(path.join(outDir, outName), html + "\n", "utf8");
  console.log(`${file} -> _includes/generated/${outName}`);
}

process.exit(0);
