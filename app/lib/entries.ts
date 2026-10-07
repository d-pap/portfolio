import { parse as parseYaml } from "yaml";

export type EntryIndex = "main" | "earlier" | "hidden";
export type EntryKind = "project" | "role" | "analysis";
/** A logo hero centers one image (usually an SVG) on the white stage, like a cover. */
export type Hero = { type: "phones" | "screen" | "logo"; frames: string[]; recording?: string; caption?: string };
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

  return {
    slug,
    title,
    shortTitle: opt("shortTitle") ?? title,
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
    body: match[2].trim(),
  };
}

function parseHero(value: unknown, where: string): Hero | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) throw new Error(`${where}: "hero" must be a mapping`);
  const h = value as Record<string, unknown>;
  if (h.type !== "phones" && h.type !== "screen" && h.type !== "logo") throw new Error(`${where}: hero.type must be "phones", "screen", or "logo"`);
  const frames = h.frames;
  if (!Array.isArray(frames) || frames.some((frame) => typeof frame !== "string" || !frame.startsWith("/"))) {
    throw new Error(`${where}: hero.frames must be a list of /public paths`);
  }
  const max = h.type === "phones" ? 2 : 1;
  if (frames.length < 1 || frames.length > max) throw new Error(`${where}: hero.frames needs 1–${max} images for type "${h.type}"`);
  if (h.recording !== undefined && (typeof h.recording !== "string" || !h.recording.startsWith("/") || !h.recording.endsWith(".mp4"))) {
    throw new Error(`${where}: hero.recording must be an .mp4 path`);
  }
  if (h.recording !== undefined && h.type === "logo") throw new Error(`${where}: hero.recording needs a "phones" or "screen" hero`);
  if (h.caption !== undefined && typeof h.caption !== "string") throw new Error(`${where}: hero.caption must be text`);
  return { type: h.type, frames: frames as string[], recording: h.recording as string | undefined, caption: h.caption as string | undefined };
}

export function sortEntries(entries: Entry[]): { main: Entry[]; earlier: Entry[] } {
  const byOrder = (a: Entry, b: Entry) => a.order - b.order || a.slug.localeCompare(b.slug);
  return {
    main: entries.filter((entry) => entry.index === "main").sort(byOrder),
    earlier: entries.filter((entry) => entry.index === "earlier").sort(byOrder),
  };
}
