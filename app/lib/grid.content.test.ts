import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parseEntry } from "./entries.ts";
import { parseGridFile, resolveGrid } from "./grid.ts";

const CONTENT = path.join(process.cwd(), "content");

test("the home includes every main and feature tile, with the four products first", () => {
  const entries = fs
    .readdirSync(CONTENT)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => parseEntry(fs.readFileSync(path.join(CONTENT, file), "utf8"), file.slice(0, -".mdx".length)));
  const grid = resolveGrid(parseGridFile(fs.readFileSync(path.join(CONTENT, "grid.yml"), "utf8")), entries);
  assert.equal(grid.flat().length, 10);
  assert.deepEqual(grid.slice(0, 4).map((tile) => tile.id), ["renew", "codecoach", "stitches", "sprout"]);
  assert.ok(grid.slice(4).every((tile) => !tile.main));
});
