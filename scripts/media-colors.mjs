// Writes app/lib/media-colors.json: each project image's edge color, painted under it while it loads and wherever a
// contained image doesn't reach. Also writes app/lib/media-sizes.json: each image's intrinsic size, so a preview can
// hold its space before the image arrives. next.config.ts runs it before `next dev` and `next build` however they're started;
// `pnpm test` runs this file directly.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const IMAGE = /\.(jpe?g|png|webp)$/i;
const SIZED = /\.(jpe?g|png|webp|svg)$/i;

function* walk(dir, pattern = IMAGE) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(file, pattern);
    else if (pattern.test(entry.name)) yield file;
  }
}

// Writes only when the content changed: Next loads its config in more than one process, and none of them should see
// a file rewritten under it.
function writeIfChanged(file, data) {
  const json = JSON.stringify(data, null, 2) + "\n";
  let current = "";
  try {
    current = fs.readFileSync(file, "utf8");
  } catch {}
  if (current !== json) fs.writeFileSync(file, json);
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
  const key = (file) => "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
  const colors = {};
  for (const file of walk(path.join(PUBLIC, "projects"))) colors[key(file)] = await edgeColor(file);
  const sizes = {};
  for (const file of walk(path.join(PUBLIC, "projects"), SIZED)) {
    const { width, height } = await sharp(file).metadata();
    if (width && height) sizes[key(file)] = [width, height];
  }
  const sorted = (table) => Object.fromEntries(Object.entries(table).sort(([a], [b]) => a.localeCompare(b)));
  writeIfChanged(path.join(root, "app", "lib", "media-colors.json"), sorted(colors));
  writeIfChanged(path.join(root, "app", "lib", "media-sizes.json"), sorted(sizes));
  console.log(`media-colors: ${Object.keys(colors).length} images, ${Object.keys(sizes).length} sized`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeMediaColors().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
