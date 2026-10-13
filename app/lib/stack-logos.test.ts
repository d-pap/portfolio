import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parseEntry } from "./entries.ts";
import { stackLogos, unknownTools } from "./stack-logos.ts";

const CONTENT = path.join(process.cwd(), "content");
const entries = fs
  .readdirSync(CONTENT)
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => parseEntry(fs.readFileSync(path.join(CONTENT, file), "utf8"), file.slice(0, -".mdx".length)));

test("every tool in every stack has a logo or is listed as having none", () => {
  const stacks = entries.flatMap((entry) => (entry.stack ? [entry.stack] : []));
  assert.ok(stacks.length > 0);
  for (const stack of stacks) assert.deepEqual(unknownTools(stack), [], stack);
});

test("logos come back in stack order, skipping tools without one", () => {
  const logos = stackLogos("React Native, pgvector, PHP");
  assert.deepEqual(logos.map((logo) => logo.name), ["React Native", "PHP"]);
  for (const logo of logos) assert.match(logo.path, /^M/);
});

test("a misspelled tool is caught rather than silently dropped", () => {
  assert.deepEqual(unknownTools("Typescript, PHP"), ["Typescript"]);
});
