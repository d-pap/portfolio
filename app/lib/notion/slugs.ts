import { slugify } from "../headings.ts";

type Sluggable = { id: string; title: string; slug: string | null; createdTime: string };

/**
 * One URL slug per entry. Slugs written in Notion are claimed first; the rest come from titles, oldest entry first, so
 * an older entry keeps its URL when a newer one with the same title appears (it gets "-2").
 */
export function assignSlugs(records: Sluggable[]): Map<string, string> {
  const ordered = [...records].sort((a, b) => a.createdTime.localeCompare(b.createdTime) || a.id.localeCompare(b.id));
  const used = new Set<string>();
  const out = new Map<string, string>();
  for (const record of ordered) {
    const written = record.slug ? slugify(record.slug) : "";
    if (written && !used.has(written)) {
      used.add(written);
      out.set(record.id, written);
    }
  }
  for (const record of ordered) {
    if (out.has(record.id)) continue;
    const base = slugify(record.title) || "untitled";
    let candidate = base;
    for (let n = 2; used.has(candidate); n++) candidate = `${base}-${n}`;
    used.add(candidate);
    out.set(record.id, candidate);
  }
  return out;
}
