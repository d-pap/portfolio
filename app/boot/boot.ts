import fs from "node:fs";
import path from "node:path";

// Order matters only for readability; each file is a self-contained IIFE, inlined as its own <script>.
// This experiment has an ordinary white reading surface; the original sheet trip is not mounted.
const FILES = ["arrive.js", "filter.js", "project-transitions.js"];

// Read once per server process. next.config.ts traces these files into every route's bundle, so pages rendered on
// request can read them too; a missing file degrades to nothing (no trip) rather than failing the page. Development
// rereads on every render so edits show up without a restart.
const cache = new Map<string, string>();
function read(...parts: string[]): string {
  const file = path.join(process.cwd(), ...parts);
  const hit = cache.get(file);
  if (hit !== undefined) return hit;
  let text = "";
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    text = "";
  }
  if (process.env.NODE_ENV === "production") cache.set(file, text);
  return text;
}

/**
 * The plain-JS boot code, one source per file, inlined in <head> so it runs before the first paint. Separate scripts
 * mean an exception in one file can't stop the others.
 */
export function bootScripts(): string[] {
  return FILES.map((file) => read("app", "boot", file)).filter(Boolean);
}

/**
 * The trip's view-transition rules, inlined in <head> as written. Next's CSS minifier rewrites
 * `::view-transition-group(*.door)` to `(.door)`, and the trip depends on these selectors reaching the browser verbatim.
 */
export function tripStyle(): string {
  return read("app", "styles", "trip.css");
}
