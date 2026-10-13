import { parse as parseYaml } from "yaml";
import type { Entry, Hero } from "./entries.ts";
import { SHAPES, type Shape, type TileMedia } from "./tiles.ts";

/** One tile on the home grid. Main tiles open the product page; section tiles open one of its sections. */
export type Tile = {
  id: string;
  slug: string;
  href: string;
  title: string;
  label: string;
  shape: Shape;
  media: TileMedia | { kind: "hero"; hero: Hero };
  main: boolean;
};

/** Three columns, each listed top to bottom. */
export type Grid = Tile[][];
export type Edge = { id: string; top: number; bottom: number };

/** Caption (12px gap, 21px title, 1px, 18px label) plus the 30px gap to the next tile. Must match tile.css. */
export const CAPTION_GAP = 82;

/** Column widths at 1440px and 1024px viewports: (min(viewport, 1440) − 2 × 24px gutter − 2 × 12px gap) / 3. */
export const CHECK_WIDTHS = [(1440 - 48 - 24) / 3, (1024 - 48 - 24) / 3];

export function parseGridFile(raw: string, where = "content/grid.yml"): string[][] {
  let data: unknown;
  try {
    data = parseYaml(raw);
  } catch (error) {
    throw new Error(`${where}: invalid YAML (${(error as Error).message})`);
  }
  const columns = (data as { columns?: unknown } | null)?.columns;
  if (!Array.isArray(columns) || columns.length !== 3) throw new Error(`${where}: "columns" must be a list of three columns`);
  return columns.map((column, i) => {
    if (!Array.isArray(column) || column.length === 0 || !column.every((id) => typeof id === "string")) {
      throw new Error(`${where}: column ${i + 1} must be a non-empty list of tile ids`);
    }
    return column as string[];
  });
}

export function resolveGrid(columns: string[][], entries: Entry[], where = "content/grid.yml"): Grid {
  const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));
  const defined = new Map<string, Tile>();
  for (const entry of entries) {
    if (entry.index !== "main" || !entry.tile) continue;
    defined.set(entry.slug, {
      id: entry.slug,
      slug: entry.slug,
      href: `/work/${entry.slug}`,
      title: entry.shortTitle,
      label: entry.area,
      shape: entry.tile.shape,
      media: entry.tile.media ?? { kind: "hero", hero: entry.hero as Hero },
      main: true,
    });
    for (const section of entry.sections) {
      const id = `${entry.slug}#${section.id}`;
      defined.set(id, { id, slug: entry.slug, href: `/work/${id}`, title: section.title, label: section.label, shape: section.shape, media: section.media, main: false });
    }
  }

  const placed = new Set<string>();
  const grid = columns.map((column) =>
    column.map((id) => {
      const tile = defined.get(id);
      if (!tile) {
        const owner = bySlug.get(id.split("#")[0]);
        if (owner && owner.index !== "main") throw new Error(`${where}: "${id}" belongs to an ${owner.index} entry, which isn't shown in the grid`);
        throw new Error(`${where}: unknown tile "${id}"`);
      }
      if (placed.has(id)) throw new Error(`${where}: "${id}" is placed twice`);
      placed.add(id);
      return tile;
    }),
  );
  const missing = [...defined.keys()].filter((id) => !placed.has(id));
  if (missing.length > 0) throw new Error(`${where}: tiles not placed: ${missing.join(", ")}`);
  return grid;
}

export function gridEdges(grid: Pick<Tile, "id" | "shape">[][], width: number): Edge[][] {
  return grid.map((column) => {
    let y = 0;
    return column.map((tile) => {
      const height = width / SHAPES[tile.shape];
      const edge = { id: tile.id, top: y, bottom: y + height };
      y += height + CAPTION_GAP;
      return edge;
    });
  });
}

const isTextOnly = (tile: Tile) => tile.media.kind === "diagram" && tile.media.name === "eval-checks";
const px = (n: number) => `${Math.round(n)}px`;

/** The rules that keep the staggered grid looking intentional (spec §5.3). One message per broken rule; empty means it passes. */
export function checkGrid(grid: Grid, width: number): string[] {
  const problems: string[] = [];
  const edges = gridEdges(grid, width);

  const compare = (i: number, j: number, ratio: number, kind: string) => {
    const minimum = ratio * width;
    for (const a of edges[i]) {
      for (const b of edges[j]) {
        for (const side of ["top", "bottom"] as const) {
          if (side === "top" && a.top === 0 && b.top === 0) continue;
          const gap = Math.abs(a[side] - b[side]);
          if (gap < minimum) {
            problems.push(`${kind} columns ${i + 1} and ${j + 1}: "${a.id}" ${side} (${px(a[side])}) is ${px(gap)} from "${b.id}" ${side} (${px(b[side])}); needs ${px(minimum)} at column width ${px(width)}`);
          }
        }
      }
    }
  };
  compare(0, 1, 0.24, "neighbouring");
  compare(1, 2, 0.24, "neighbouring");
  compare(0, 2, 0.15, "outer");

  const first = grid.map((column) => column[0]);
  if (!(SHAPES[first[1].shape] < SHAPES[first[0].shape] && SHAPES[first[1].shape] < SHAPES[first[2].shape])) {
    problems.push(`row one: the middle column's first tile ("${first[1].id}") must be the tallest`);
  }
  grid.forEach((column, i) => {
    column.forEach((tile, k) => {
      if (k > 0 && column[k - 1].slug === tile.slug) problems.push(`column ${i + 1}: "${column[k - 1].id}" and "${tile.id}" are from the same product and stacked`);
    });
    if (column.length >= 3 && new Set(column.map((tile) => tile.shape)).size < 3) problems.push(`column ${i + 1}: uses fewer than three shapes`);
  });
  for (const tile of first) if (isTextOnly(tile)) problems.push(`row one: "${tile.id}" is text-only`);
  return problems;
}

/** Single-column order for narrow screens: by top edge in the desktop layout, ties left to right. */
export function readingOrder(grid: Grid, width = CHECK_WIDTHS[0]): Tile[] {
  const edges = gridEdges(grid, width);
  return grid
    .flatMap((column, i) => column.map((tile, k) => ({ tile, top: edges[i][k].top, column: i })))
    .sort((a, b) => a.top - b.top || a.column - b.column)
    .map(({ tile }) => tile);
}
