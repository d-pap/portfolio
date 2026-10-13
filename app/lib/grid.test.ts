import { test } from "node:test";
import assert from "node:assert/strict";
import type { Entry } from "./entries.ts";
import type { Shape } from "./tiles.ts";
import { CHECK_WIDTHS, checkGrid, gridEdges, parseGridFile, readingOrder, resolveGrid, type Grid, type Tile } from "./grid.ts";

const t = (id: string, shape: Shape, media: Tile["media"] = { kind: "logo", src: "/a.svg" }): Tile => ({
  id,
  slug: id.split("#")[0],
  href: `/work/${id}`,
  title: id,
  label: "label",
  shape,
  media,
  main: !id.includes("#"),
});

// The real arrangement with products renamed: a = renew, b = sprout, c = stitches, d = codecoach.
const GOOD: Grid = [
  [t("a#1", "1:1"), t("b#1", "4:3"), t("a#2", "4:5"), t("c#1", "4:3")],
  [t("b", "4:5"), t("a", "4:3"), t("b#2", "16:9")],
  [t("d", "3:2"), t("b#3", "4:3"), t("c", "3:2"), t("d#1", "1:1")],
];
const copy = (): Grid => GOOD.map((column) => [...column]);

test("gridEdges stacks tiles with the caption gap between them", () => {
  assert.deepEqual(gridEdges([[t("a", "1:1"), t("b", "16:9")]], 456), [[
    { id: "a", top: 0, bottom: 456 },
    { id: "b", top: 538, bottom: 794.5 },
  ]]);
});

test("the reference arrangement passes at both widths", () => {
  for (const width of CHECK_WIDTHS) assert.deepEqual(checkGrid(GOOD, width), [], `width ${width}`);
});

test("near-aligned neighbouring columns fail", () => {
  const grid: Grid = [[t("a#1", "4:5"), t("b#1", "1:1")], [t("b", "4:5"), t("a", "1:1")], [t("d", "3:2"), t("c", "4:3")]];
  const problems = checkGrid(grid, 456);
  assert.ok(problems.some((p) => p.startsWith('neighbouring columns 1 and 2: "a#1" bottom (570px) is 0px from "b" bottom (570px); needs 109px')), problems.join("\n"));
});

test("mirrored outer columns fail", () => {
  const grid = copy();
  grid[2] = [t("d", "1:1"), t("b#3", "4:3"), t("c", "4:5"), t("d#1", "4:3")];
  assert.ok(checkGrid(grid, 456).some((p) => p.startsWith("outer columns 1 and 3:")));
});

test("the middle column must open with the tallest tile", () => {
  const grid = copy();
  grid[1][0] = t("b", "16:9");
  assert.ok(checkGrid(grid, 456).includes('row one: the middle column\'s first tile ("b") must be the tallest'));
});

test("tiles from one product can't be stacked", () => {
  const grid = copy();
  grid[0][1] = t("a#3", "4:3");
  assert.ok(checkGrid(grid, 456).includes('column 1: "a#1" and "a#3" are from the same product and stacked'));
});

test("a column of three or more tiles mixes at least three shapes", () => {
  const grid = copy();
  grid[1] = [t("b", "4:5"), t("a", "4:5"), t("b#2", "16:9")];
  assert.ok(checkGrid(grid, 456).includes("column 2: uses fewer than three shapes"));
});

test("row one has no text-only tile", () => {
  const grid = copy();
  grid[2][0] = t("d", "3:2", { kind: "diagram", name: "eval-checks" });
  assert.ok(checkGrid(grid, 456).includes('row one: "d" is text-only'));
});

test("readingOrder sorts by top edge, then left to right", () => {
  assert.deepEqual(readingOrder(GOOD).map((tile) => tile.id), ["a#1", "b", "d", "b#3", "b#1", "a", "c", "a#2", "b#2", "d#1", "c#1"]);
});

test("parseGridFile reads three columns of ids", () => {
  assert.deepEqual(parseGridFile("columns:\n  - [a, b]\n  - [c]\n  - [d#x]\n"), [["a", "b"], ["c"], ["d#x"]]);
  assert.throws(() => parseGridFile("columns:\n  - [a]\n  - [b]\n"), /content\/grid\.yml: "columns" must be a list of three columns/);
  assert.throws(() => parseGridFile("columns:\n  - [a]\n  - [1]\n  - [c]\n"), /column 2 must be a non-empty list of tile ids/);
  assert.throws(() => parseGridFile("columns: [unclosed"), /content\/grid\.yml: invalid YAML/);
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
  const grid = resolveGrid([["p"], ["p#s"], ["q"]], [entry("p", "main", ["s"]), entry("q", "main")]);
  assert.deepEqual(grid[0][0], { id: "p", slug: "p", href: "/work/p", title: "P", label: "p area", shape: "4:5", media: { kind: "hero", hero: { type: "phones", frames: ["/hero.webp"] } }, main: true });
  assert.deepEqual(grid[1][0], { id: "p#s", slug: "p", href: "/work/p#s", title: "p s", label: "s label", shape: "1:1", media: { kind: "logo", src: "/l.svg" }, main: false });
});

test("resolveGrid rejects unknown, repeated, missing, and earlier tiles", () => {
  const entries = [entry("p", "main", ["s"]), entry("q", "main"), entry("old", "earlier")];
  assert.throws(() => resolveGrid([["p", "zzz"], ["p#s"], ["q"]], entries), /content\/grid\.yml: unknown tile "zzz"/);
  assert.throws(() => resolveGrid([["p"], ["p#s", "p"], ["q"]], entries), /"p" is placed twice/);
  assert.throws(() => resolveGrid([["p"], ["q"], ["q#none"]], entries), /unknown tile "q#none"/);
  assert.throws(() => resolveGrid([["p"], ["q"], ["old"]], entries), /"old" belongs to an earlier entry, which isn't shown in the grid/);
  assert.throws(() => resolveGrid([["p"], ["q"], ["q"]], entries), /"q" is placed twice/);
  assert.throws(() => resolveGrid([["p"], ["q"], []], entries), /tiles not placed: p#s/);
});
