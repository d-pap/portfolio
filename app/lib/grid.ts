import { parse as parseYaml } from "yaml";
import type { Entry, Hero } from "./entries.ts";
import type { Shape, TileMedia } from "./tiles.ts";

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

/** Home entries in reading order; CSS gives them unequal widths and offsets. */
export type Grid = Tile[];

export function parseGridFile(raw: string, where = "content/grid.yml"): string[] {
  let data: unknown;
  try {
    data = parseYaml(raw);
  } catch (error) {
    throw new Error(`${where}: invalid YAML (${(error as Error).message})`);
  }
  const tiles = (data as { tiles?: unknown } | null)?.tiles;
  if (!Array.isArray(tiles) || tiles.length === 0 || !tiles.every((id) => typeof id === "string" && id.trim())) {
    throw new Error(`${where}: "tiles" must be a non-empty list of tile ids`);
  }
  return tiles;
}

export function resolveGrid(ids: string[], entries: Entry[], where = "content/grid.yml"): Grid {
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
  const grid = ids.map((id) => {
    const tile = defined.get(id);
    if (!tile) {
      const owner = bySlug.get(id.split("#")[0]);
      if (owner && owner.index !== "main") throw new Error(`${where}: "${id}" belongs to an ${owner.index} entry, which isn't shown in the grid`);
      throw new Error(`${where}: unknown tile "${id}"`);
    }
    if (placed.has(id)) throw new Error(`${where}: "${id}" is placed twice`);
    placed.add(id);
    return tile;
  });
  const missing = [...defined.keys()].filter((id) => !placed.has(id));
  if (missing.length > 0) throw new Error(`${where}: tiles not placed: ${missing.join(", ")}`);
  return grid;
}
