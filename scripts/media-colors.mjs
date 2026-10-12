// Writes app/lib/media-colors.json: each project image's average color, painted under it while it loads. next.config.ts
// runs it before `next dev` and `next build` however they're started; `pnpm test` runs this file directly.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const IMAGE = /\.(jpe?g|png|webp)$/i;

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(file);
    else if (IMAGE.test(entry.name)) yield file;
  }
}

const hex = (n) => Math.round(n).toString(16).padStart(2, "0");

export async function writeMediaColors(root = process.cwd()) {
  const PUBLIC = path.join(root, "public");
  const OUT = path.join(root, "app", "lib", "media-colors.json");
  const colors = {};
  for (const file of walk(path.join(PUBLIC, "projects"))) {
    // Transparent pixels count as the white stage they sit on.
    const { channels } = await sharp(file).flatten({ background: "#ffffff" }).stats();
    const key = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
    colors[key] = `#${hex(channels[0].mean)}${hex(channels[1].mean)}${hex(channels[2].mean)}`;
  }
  const sorted = Object.fromEntries(Object.entries(colors).sort(([a], [b]) => a.localeCompare(b)));
  const json = JSON.stringify(sorted, null, 2) + "\n";
  // Next loads its config in more than one process; an unchanged file is left alone so none of them sees it rewritten.
  let current = "";
  try {
    current = fs.readFileSync(OUT, "utf8");
  } catch {}
  if (current !== json) fs.writeFileSync(OUT, json);
  console.log(`media-colors: ${Object.keys(sorted).length} images`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeMediaColors().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
