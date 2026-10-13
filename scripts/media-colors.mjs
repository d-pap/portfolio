// Writes app/lib/media-colors.json: each project image's edge color, painted under it while it loads and wherever a
// contained image doesn't reach. next.config.ts runs it before `next dev` and `next build` however they're started;
// `pnpm test` runs this file directly.
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

/** The average of an image's outermost pixels: what sits beside the bars when it's contained in a wider frame. */
export async function edgeColor(input) {
  // Transparent pixels count as the white stage they sit on.
  const { data, info } = await sharp(input).flatten({ background: "#ffffff" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const sum = [0, 0, 0];
  let count = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y !== 0 && y !== height - 1 && x !== 0 && x !== width - 1) continue;
      const i = (y * width + x) * channels;
      for (let k = 0; k < 3; k++) sum[k] += data[i + k];
      count++;
    }
  }
  return `#${sum.map((total) => hex(total / count)).join("")}`;
}

export async function writeMediaColors(root = process.cwd()) {
  const PUBLIC = path.join(root, "public");
  const OUT = path.join(root, "app", "lib", "media-colors.json");
  const colors = {};
  for (const file of walk(path.join(PUBLIC, "projects"))) {
    const key = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
    colors[key] = await edgeColor(file);
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
