import fs from "node:fs";
import path from "node:path";
import { parseAbout, type AboutPart } from "./about";
import { parseReading, type Book } from "./reading";
import { parseEntry, sortEntries, type Entry } from "./entries";
import { parseGridFile, resolveGrid, type Grid } from "./grid";

const CONTENT = path.join(process.cwd(), "content");

export function getEntries(): Entry[] {
  return fs
    .readdirSync(CONTENT)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => parseEntry(fs.readFileSync(path.join(CONTENT, file), "utf8"), file.slice(0, -".mdx".length)));
}

export function getEntry(slug: string): Entry | undefined {
  return getEntries().find((entry) => entry.slug === slug);
}

export function getIndex(): { main: Entry[]; earlier: Entry[] } {
  return sortEntries(getEntries());
}

export function getAbout(): AboutPart[] {
  return parseAbout(fs.readFileSync(path.join(CONTENT, "about.txt"), "utf8"));
}

export function getReading(): Book[] {
  const file = path.join(CONTENT, "reading.json");
  if (!fs.existsSync(file)) return [];
  return parseReading(fs.readFileSync(file, "utf8"));
}

export function getGrid(): Grid {
  return resolveGrid(parseGridFile(fs.readFileSync(path.join(CONTENT, "grid.yml"), "utf8")), getEntries());
}
