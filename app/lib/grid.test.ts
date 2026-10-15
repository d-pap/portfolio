import { test } from "node:test";
import assert from "node:assert/strict";
import type { Entry } from "./entries.ts";
import { parseGridFile, resolveGrid } from "./grid.ts";

test("the grid is an ordered, non-empty list of ids", () => {
  assert.deepEqual(parseGridFile("tiles: [a, b#x, c]"), ["a", "b#x", "c"]);
  for (const raw of ["tiles: []", "tiles: [a, 1]", "tiles: ['']", "columns: [[a], [b], [c]]"]) {
    assert.throws(() => parseGridFile(raw), /non-empty list of tile ids/);
  }
  assert.throws(() => parseGridFile("tiles: [unclosed"), /invalid YAML/);
});

const entry = (slug: string, index: "main" | "earlier", sectionIds: string[] = []) =>
  ({
    slug,
    index,
    shortTitle: slug.toUpperCase(),
    area: `${slug} area`,
    hero: { type: "phones", frames: ["/hero.webp"] },
    tile: index === "main" ? { shape: "4:5" } : undefined,
    sections: sectionIds.map((id) => ({ id, title: `${slug} ${id}`, label: `${id} label`, shape: "1:1", media: { kind: "logo", src: "/l.svg" } })),
  }) as unknown as Entry;

test("resolveGrid builds tiles from entries", () => {
  const grid = resolveGrid(["p", "p#s", "q"], [entry("p", "main", ["s"]), entry("q", "main")]);
  assert.deepEqual(grid[0], { id: "p", slug: "p", href: "/work/p", title: "P", label: "p area", shape: "4:5", media: { kind: "hero", hero: { type: "phones", frames: ["/hero.webp"] } }, main: true });
  assert.deepEqual(grid[1], { id: "p#s", slug: "p", href: "/work/p#s", title: "p s", label: "s label", shape: "1:1", media: { kind: "logo", src: "/l.svg" }, main: false });
});

test("resolveGrid rejects unknown, repeated, missing, and earlier tiles", () => {
  const entries = [entry("p", "main", ["s"]), entry("q", "main"), entry("old", "earlier")];
  assert.throws(() => resolveGrid(["p", "zzz", "p#s", "q"], entries), /content\/grid\.yml: unknown tile "zzz"/);
  assert.throws(() => resolveGrid(["p", "p#s", "p", "q"], entries), /"p" is placed twice/);
  assert.throws(() => resolveGrid(["p", "q", "q#none"], entries), /unknown tile "q#none"/);
  assert.throws(() => resolveGrid(["p", "q", "old"], entries), /"old" belongs to an earlier entry, which isn't shown in the grid/);
  assert.throws(() => resolveGrid(["p", "q", "q"], entries), /"q" is placed twice/);
  assert.throws(() => resolveGrid(["p", "q"], entries), /tiles not placed: p#s/);
});
