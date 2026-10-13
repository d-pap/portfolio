import type { Entry } from "./entries";

export function splitLede(body: string): { lede: string; rest: string } {
  const match = /^## /m.exec(body);
  if (!match) return { lede: body.trim(), rest: "" };
  return { lede: body.slice(0, match.index).trim(), rest: body.slice(match.index).trim() };
}

export type CaseLink = { label: string; href: string };

export function caseLinks(entry: Pick<Entry, "website" | "repository" | "availability">): { links: CaseLink[]; note?: string } {
  const links: CaseLink[] = [];
  if (entry.website) links.push({ label: entry.website.includes("apps.apple.com") ? "App Store" : "visit site", href: entry.website });
  if (entry.repository) links.push({ label: "source", href: entry.repository });
  return { links, note: entry.availability };
}

export function nextEntry(ordered: Entry[], slug: string): Entry | undefined {
  if (ordered.length < 2) return undefined;
  const index = ordered.findIndex((entry) => entry.slug === slug);
  return ordered[(index + 1) % ordered.length];
}
