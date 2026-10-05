import fs from "node:fs";
import path from "node:path";
import { parseEntry, sortEntries, type Entry } from "./entries";

const CONTENT = path.join(process.cwd(), "content");

export function getEntries(): Entry[] {
  return fs
    .readdirSync(CONTENT)
    .filter((file) => file.endsWith(".mdx") && file !== "home.mdx")
    .map((file) => parseEntry(fs.readFileSync(path.join(CONTENT, file), "utf8"), file.slice(0, -".mdx".length)));
}

export function getEntry(slug: string): Entry | undefined {
  return getEntries().find((entry) => entry.slug === slug);
}

export function getIndex(): { main: Entry[]; earlier: Entry[] } {
  return sortEntries(getEntries());
}
