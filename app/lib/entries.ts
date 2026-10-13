import { parse as parseYaml } from "yaml";
import { listHeadings } from "./headings.ts";
import { DIAGRAMS, MAX_TILE_TITLE, SHAPES, type DiagramName, type MainTile, type SectionTile, type Shape, type TileMedia } from "./tiles.ts";

export type EntryIndex = "main" | "earlier" | "hidden";
export type EntryKind = "project" | "role" | "analysis";
/** A logo hero centers one image (usually an SVG) on the white stage, like a cover. */
export type Hero = { type: "phones" | "screen" | "logo" | "composition"; frames: string[]; recording?: string; caption?: string };
export type Entry = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  area: string;
  role: string;
  period: string;
  context: string;
  stack?: string;
  status?: string;
  website?: string;
  repository?: string;
  availability?: string;
  publishedAt: string;
  index: EntryIndex;
  order: number;
  kind: EntryKind;
  hero?: Hero;
  tile?: MainTile;
  sections: SectionTile[];
  body: string;
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const INDEXES = ["main", "earlier", "hidden"] as const;
const KINDS = ["project", "role", "analysis"] as const;

export function parseEntry(raw: string, slug: string): Entry {
  const where = `content/${slug}.mdx`;
  const match = FRONTMATTER.exec(raw);
  if (!match) throw new Error(`${where}: missing frontmatter block`);

  let data: unknown;
  try {
    data = parseYaml(match[1]);
  } catch (error) {
    throw new Error(`${where}: invalid YAML (${(error as Error).message})`);
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error(`${where}: frontmatter must be a mapping`);
  const d = data as Record<string, unknown>;

  const opt = (key: string): string | undefined => {
    const value = d[key];
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value !== "string" && typeof value !== "number") throw new Error(`${where}: "${key}" must be text`);
    return String(value);
  };
  const req = (key: string): string => {
    const value = opt(key);
    if (value === undefined) throw new Error(`${where}: "${key}" is required`);
    return value;
  };
  const oneOf = <T extends string>(key: string, allowed: readonly T[], fallback?: T): T => {
    const value = opt(key) ?? fallback;
    if (value === undefined) throw new Error(`${where}: "${key}" is required`);
    if (!(allowed as readonly string[]).includes(value)) throw new Error(`${where}: "${key}" must be one of ${allowed.join(", ")}`);
    return value as T;
  };

  const order = d.order === undefined ? 99 : Number(d.order);
  if (!Number.isFinite(order)) throw new Error(`${where}: "order" must be a number`);
  const index = oneOf("index", INDEXES);
  const hero = parseHero(d.hero, where);
  if (index === "main" && !hero) throw new Error(`${where}: main entries need a "hero"`);
  const title = req("title");
  const shortTitle = opt("shortTitle") ?? title;
  const tile = parseMainTile(d.tile, where);
  if (index === "main" && !tile) throw new Error(`${where}: main entries need a "tile"`);
  if (tile && shortTitle.length > MAX_TILE_TITLE) {
    throw new Error(`${where}: "shortTitle" is the tile title and must be at most ${MAX_TILE_TITLE} characters`);
  }
  const sections = parseSections(d.sections, match[2], where);

  return {
    slug,
    title,
    shortTitle,
    summary: req("summary"),
    area: req("area"),
    role: req("role"),
    period: req("period"),
    context: req("context"),
    stack: opt("stack"),
    status: opt("status"),
    website: opt("website"),
    repository: opt("repository"),
    availability: opt("availability"),
    publishedAt: req("publishedAt"),
    index,
    order,
    kind: oneOf("kind", KINDS, "project"),
    hero,
    tile,
    sections,
    body: match[2].trim(),
  };
}

function parseHero(value: unknown, where: string): Hero | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) throw new Error(`${where}: "hero" must be a mapping`);
  const h = value as Record<string, unknown>;
  if (h.type !== "phones" && h.type !== "screen" && h.type !== "logo" && h.type !== "composition") throw new Error(`${where}: hero.type must be "phones", "screen", "logo", or "composition"`);
  const frames = h.frames;
  if (!Array.isArray(frames) || frames.some((frame) => typeof frame !== "string" || !frame.startsWith("/"))) {
    throw new Error(`${where}: hero.frames must be a list of /public paths`);
  }
  const max = h.type === "phones" ? 2 : 1;
  if (frames.length < 1 || frames.length > max) throw new Error(`${where}: hero.frames needs 1–${max} images for type "${h.type}"`);
  if (h.recording !== undefined && (typeof h.recording !== "string" || !h.recording.startsWith("/") || !h.recording.endsWith(".mp4"))) {
    throw new Error(`${where}: hero.recording must be an .mp4 path`);
  }
  if (h.recording !== undefined && h.type === "logo") throw new Error(`${where}: hero.recording needs a "phones", "screen", or "composition" hero`);
  if (h.caption !== undefined && typeof h.caption !== "string") throw new Error(`${where}: hero.caption must be text`);
  return { type: h.type, frames: frames as string[], recording: h.recording as string | undefined, caption: h.caption as string | undefined };
}

function parseShape(value: unknown, at: string): Shape {
  if (typeof value !== "string" || !(value in SHAPES)) throw new Error(`${at} must be one of ${Object.keys(SHAPES).join(", ")}`);
  return value as Shape;
}

const isPublicPath = (value: unknown): value is string => typeof value === "string" && value.startsWith("/");

function parseTileMedia(value: unknown, at: string): TileMedia {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${at} must be a mapping`);
  const m = value as Record<string, unknown>;
  switch (m.kind) {
    case "cover": {
      if (!isPublicPath(m.src)) throw new Error(`${at}.src must be a /public path`);
      if (m.position !== undefined && typeof m.position !== "string") throw new Error(`${at}.position must be text`);
      if (m.recording !== undefined && !(isPublicPath(m.recording) && m.recording.endsWith(".mp4"))) throw new Error(`${at}.recording must be an .mp4 path`);
      if (m.fit !== undefined && m.fit !== "cover" && m.fit !== "contain") throw new Error(`${at}.fit must be "cover" or "contain"`);
      return { kind: "cover", ...(m.fit ? { fit: m.fit as "cover" | "contain" } : {}), src: m.src, position: m.position as string | undefined, recording: m.recording as string | undefined };
    }
    case "phones": {
      if (!Array.isArray(m.frames) || m.frames.length < 1 || m.frames.length > 2 || !m.frames.every(isPublicPath)) {
        throw new Error(`${at}.frames needs 1–2 /public paths`);
      }
      return { kind: "phones", frames: m.frames as string[] };
    }
    case "logo": {
      if (!isPublicPath(m.src)) throw new Error(`${at}.src must be a /public path`);
      return { kind: "logo", src: m.src };
    }
    case "diagram": {
      if (!(DIAGRAMS as readonly unknown[]).includes(m.name)) throw new Error(`${at}.name must be one of ${DIAGRAMS.join(", ")}`);
      return { kind: "diagram", name: m.name as DiagramName };
    }
    default:
      throw new Error(`${at}.kind must be one of cover, phones, logo, diagram`);
  }
}

function parseMainTile(value: unknown, where: string): MainTile | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) throw new Error(`${where}: "tile" must be a mapping`);
  const t = value as Record<string, unknown>;
  return {
    shape: parseShape(t.shape, `${where}: tile.shape`),
    media: t.media === undefined ? undefined : parseTileMedia(t.media, `${where}: tile.media`),
  };
}

function parseSections(value: unknown, body: string, where: string): SectionTile[] {
  const headings = listHeadings(body);
  const headingIds = new Set<string>();
  for (const heading of headings) {
    if (headingIds.has(heading.id)) throw new Error(`${where}: two "## " headings share the id "${heading.id}"`);
    headingIds.add(heading.id);
  }
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error(`${where}: "sections" must be a list`);

  const seen = new Set<string>();
  return value.map((item, i): SectionTile => {
    const at = `${where}: sections[${i}]`;
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error(`${at} must be a mapping`);
    const s = item as Record<string, unknown>;
    for (const key of ["id", "title", "label"]) {
      if (typeof s[key] !== "string" || !(s[key] as string).trim()) throw new Error(`${at}.${key} is required`);
    }
    const id = (s.id as string).trim();
    if (seen.has(id)) throw new Error(`${at}.id "${id}" appears twice`);
    seen.add(id);
    if (!headingIds.has(id)) {
      throw new Error(`${at}.id "${id}" has no matching "## " heading (headings: ${headings.map((h) => h.id).join(", ") || "none"})`);
    }
    const title = (s.title as string).trim();
    if (title.length > MAX_TILE_TITLE) throw new Error(`${at}.title must be at most ${MAX_TILE_TITLE} characters`);
    return { id, title, label: (s.label as string).trim(), shape: parseShape(s.shape, `${at}.shape`), media: parseTileMedia(s.media, `${at}.media`) };
  });
}

export function sortEntries(entries: Entry[]): { main: Entry[]; earlier: Entry[] } {
  const byOrder = (a: Entry, b: Entry) => a.order - b.order || a.slug.localeCompare(b.slug);
  return {
    main: entries.filter((entry) => entry.index === "main").sort(byOrder),
    earlier: entries.filter((entry) => entry.index === "earlier").sort(byOrder),
  };
}
