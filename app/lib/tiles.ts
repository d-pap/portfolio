/** Tile shapes as width / height. The grid's spacing rules are computed from these. */
export const SHAPES = { "4:5": 4 / 5, "1:1": 1, "4:3": 4 / 3, "3:2": 3 / 2, "16:9": 16 / 9 } as const;
export type Shape = keyof typeof SHAPES;

export const DIAGRAMS = ["routing", "eval-checks", "platform", "memory"] as const;
export type DiagramName = (typeof DIAGRAMS)[number];

/** What a home tile shows. `cover` fills the tile; the others sit on the white stage. */
export type TileMedia =
  | { kind: "cover"; src: string; position?: string; fit?: "cover" | "contain"; recording?: string }
  | { kind: "phones"; frames: string[] }
  | { kind: "logo"; src: string }
  | { kind: "diagram"; name: DiagramName };

/** The product's own tile. It shows the hero unless `media` is set. */
export type MainTile = { shape: Shape; media?: TileMedia };

/** A tile for one part of a product. It links to the "## " section with the same id. */
export type SectionTile = { id: string; title: string; label: string; shape: Shape; media: TileMedia };

/** Tile captions are one line; the grid's spacing rules assume it. */
export const MAX_TILE_TITLE = 30;
