import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parseEntry } from "./entries.ts";
import { CHECK_WIDTHS, checkGrid, parseGridFile, resolveGrid } from "./grid.ts";

const CONTENT = path.join(process.cwd(), "content");

test("the real grid places every tile and follows the spacing rules", () => {
  const entries = fs
    .readdirSync(CONTENT)
    .filter((file) => file.endsWith(".mdx") && file !== "home.mdx")
    .map((file) => parseEntry(fs.readFileSync(path.join(CONTENT, file), "utf8"), file.slice(0, -".mdx".length)));
  const grid = resolveGrid(parseGridFile(fs.readFileSync(path.join(CONTENT, "grid.yml"), "utf8")), entries);
  assert.equal(grid.flat().length, 11);
  for (const width of CHECK_WIDTHS) assert.deepEqual(checkGrid(grid, width), [], `column width ${width}px`);
});
