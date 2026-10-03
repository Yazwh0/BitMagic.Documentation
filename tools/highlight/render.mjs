// Pre-renders .bmasm example files into syntax-highlighted HTML, using the
// real BitMagic.VSC TextMate grammar (see highlighter.mjs).
//
// Run from a full superproject checkout (BitMagic.VSC must be a sibling of
// BitMagic.Documentation): `node tools/highlight/render.mjs`.
//
// For every _examples/<name>.bmasm this writes _includes/generated/<name>.html,
// which pages pull in with `{% include generated/<name>.html %}`. Re-run after
// editing any .bmasm source or after the grammar itself changes; commit the
// regenerated .html alongside the .bmasm change.

import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import { createBmasmHighlighter, docsRoot } from "./highlighter.mjs";

const examplesDir = path.join(docsRoot, "_examples");
const outDir = path.join(docsRoot, "_includes", "generated");

const highlight = await createBmasmHighlighter();

await mkdir(outDir, { recursive: true });

const files = (await readdir(examplesDir)).filter((f) => f.endsWith(".bmasm"));

if (files.length === 0) {
  console.warn(`No .bmasm files found in ${examplesDir}`);
}

for (const file of files) {
  const src = await readFile(path.join(examplesDir, file), "utf8");
  const html = highlight(src);

  const outName = file.replace(/\.bmasm$/, ".html");
  await writeFile(path.join(outDir, outName), html + "\n", "utf8");
  console.log(`${file} -> _includes/generated/${outName}`);
}

process.exit(0);
