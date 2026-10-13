import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parseEntry } from "./entries.ts";
import { mediaColor } from "./media-colors.ts";

const CONTENT = path.join(process.cwd(), "content");

const entries = fs
  .readdirSync(CONTENT)
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => parseEntry(fs.readFileSync(path.join(CONTENT, file), "utf8"), file.slice(0, -".mdx".length)));
const isImage = (src: string) => /\.(jpe?g|png|webp)$/i.test(src);

test("every hero image has an average color", () => {
  const frames = entries.flatMap((entry) => entry.hero?.frames ?? []).filter(isImage);
  assert.ok(frames.length > 0);
  for (const src of frames) assert.match(mediaColor(src) ?? "", /^#[0-9a-f]{6}$/, src);
});

// Lazy covers fade in over their average color too (work-tile.tsx), so each needs one.
test("every tile cover has an average color", () => {
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
