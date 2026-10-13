import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parseEntry } from "./entries.ts";
import sharp from "sharp";
import { mediaColor } from "./media-colors.ts";
import { edgeColor } from "../../scripts/media-colors.mjs";

const CONTENT = path.join(process.cwd(), "content");

const entries = fs
  .readdirSync(CONTENT)
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => parseEntry(fs.readFileSync(path.join(CONTENT, file), "utf8"), file.slice(0, -".mdx".length)));
const isImage = (src: string) => /\.(jpe?g|png|webp)$/i.test(src);

test("every hero image has an edge color", () => {
  const frames = entries.flatMap((entry) => entry.hero?.frames ?? []).filter(isImage);
  assert.ok(frames.length > 0);
  for (const src of frames) assert.match(mediaColor(src) ?? "", /^#[0-9a-f]{6}$/, src);
});

// Lazy covers fade in over their edge color too (work-tile.tsx), so each needs one.
test("every tile cover has an edge color", () => {
  const covers = entries
    .flatMap((entry) => [entry.tile?.media, ...entry.sections.map((section) => section.media)])
    .flatMap((media) => (media?.kind === "cover" ? [media.src] : []))
    .filter(isImage);
  assert.ok(covers.length > 0);
  for (const src of covers) assert.match(mediaColor(src) ?? "", /^#[0-9a-f]{6}$/, src);
});

test("unknown images have no color", () => {
  assert.equal(mediaColor("/projects/missing.webp"), undefined);
});

// The color shows wherever a contained image doesn't reach (letterbox bars), so it must be the image's edge, not its
// average: a white screen with dark UI averages to light gray and leaves gray bars beside the white image.
test("an image's color is its edge color, not its average", async () => {
  const center = await sharp({ create: { width: 10, height: 10, channels: 3, background: "#000000" } }).png().toBuffer();
  const framed = await sharp({ create: { width: 12, height: 12, channels: 3, background: "#ffffff" } })
    .composite([{ input: center, left: 1, top: 1 }]).png().toBuffer();
  assert.equal(await edgeColor(framed), "#ffffff");
});
