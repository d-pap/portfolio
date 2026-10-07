import { test } from "node:test";
import assert from "node:assert/strict";
import { parseEntry, sortEntries, type Entry } from "./entries.ts";

const FRONT = `title: Sprout
shortTitle: Sprout
summary: An AI health coach inside RENEW
area: AI health coach
role: AI engineering
period: 2025 – present
context: Michigan Medicine
stack: Python, FastAPI
availability: code is private to Michigan Medicine
publishedAt: "2026-07-15"
index: main
order: 2
kind: project
hero:
  type: phones
  frames:
    - /projects/sprout-chat.webp
  caption: the coach's first screen · april 2026
`;
const BODY = `
Lede paragraph.

## the system

Body text.
`;
const file = (front = FRONT) => `---\n${front}---\n${BODY}`;

test("parses a complete entry", () => {
  const entry = parseEntry(file(), "rag-api");
  assert.equal(entry.slug, "rag-api");
  assert.equal(entry.title, "Sprout");
  assert.equal(entry.area, "AI health coach");
  assert.equal(entry.period, "2025 – present");
  assert.equal(entry.order, 2);
  assert.equal(entry.index, "main");
  assert.equal(entry.kind, "project");
  assert.equal(entry.availability, "code is private to Michigan Medicine");
  assert.deepEqual(entry.hero, { type: "phones", frames: ["/projects/sprout-chat.webp"], recording: undefined, caption: "the coach's first screen · april 2026" });
  assert.ok(entry.body.startsWith("Lede paragraph."));
  assert.ok(entry.body.includes("## the system"));
});

test("fills optional fields with defaults", () => {
  const front = FRONT.replace("shortTitle: Sprout\n", "").replace("order: 2\n", "").replace("kind: project\n", "");
  const entry = parseEntry(file(front), "rag-api");
  assert.equal(entry.shortTitle, "Sprout");
  assert.equal(entry.order, 99);
  assert.equal(entry.kind, "project");
});

test("numbers in text fields become strings", () => {
  const entry = parseEntry(file(FRONT.replace("period: 2025 – present", "period: 2024")), "x");
  assert.equal(entry.period, "2024");
});

test("a missing required field names the file and the field", () => {
  assert.throws(() => parseEntry(file(FRONT.replace("role: AI engineering\n", "")), "rag-api"), /content\/rag-api\.mdx: "role" is required/);
});

test("index is required and must be a known value", () => {
  assert.throws(() => parseEntry(file(FRONT.replace("index: main\n", "")), "x"), /"index" is required/);
  assert.throws(() => parseEntry(file(FRONT.replace("index: main", "index: featured")), "x"), /"index" must be one of main, earlier, hidden/);
});

test("a main entry needs a hero", () => {
  const front = FRONT.slice(0, FRONT.indexOf("hero:"));
  assert.throws(() => parseEntry(file(front), "x"), /content\/x\.mdx: main entries need a "hero"/);
  assert.doesNotThrow(() => parseEntry(file(front.replace("index: main", "index: earlier")), "x"));
});

test("hero frames are checked against the hero type", () => {
  const three = FRONT.replace("    - /projects/sprout-chat.webp\n", "    - /a.webp\n    - /b.webp\n    - /c.webp\n");
  assert.throws(() => parseEntry(file(three), "x"), /hero\.frames needs 1–2 images for type "phones"/);
  const screenTwo = FRONT.replace("type: phones", "type: screen").replace("    - /projects/sprout-chat.webp\n", "    - /a.webp\n    - /b.webp\n");
  assert.throws(() => parseEntry(file(screenTwo), "x"), /hero\.frames needs 1–1 images for type "screen"/);
  const relative = FRONT.replace("/projects/sprout-chat.webp", "projects/sprout-chat.webp");
  assert.throws(() => parseEntry(file(relative), "x"), /hero\.frames must be a list of \/public paths/);
  const badType = FRONT.replace("type: phones", "type: tablet");
  assert.throws(() => parseEntry(file(badType), "x"), /hero\.type must be "phones", "screen", or "logo"/);
});

test("a recording must be an mp4", () => {
  const front = FRONT.replace("  caption:", "  recording: /projects/renew.mov\n  caption:");
  assert.throws(() => parseEntry(file(front), "x"), /hero\.recording must be an \.mp4 path/);
});

test("a logo hero takes one image and no recording", () => {
  const logo = FRONT.replace("type: phones", "type: logo").replace("/projects/sprout-chat.webp", "/projects/sprout-logo.svg");
  assert.deepEqual(parseEntry(file(logo), "x").hero, { type: "logo", frames: ["/projects/sprout-logo.svg"], recording: undefined, caption: "the coach's first screen · april 2026" });
  const two = logo.replace("    - /projects/sprout-logo.svg\n", "    - /a.svg\n    - /b.svg\n");
  assert.throws(() => parseEntry(file(two), "x"), /hero\.frames needs 1–1 images for type "logo"/);
  const recorded = logo.replace("  caption:", "  recording: /projects/sprout.mp4\n  caption:");
  assert.throws(() => parseEntry(file(recorded), "x"), /hero\.recording needs a "phones" or "screen" hero/);
});

test("broken files fail with the file name", () => {
  assert.throws(() => parseEntry("no frontmatter here", "x"), /content\/x\.mdx: missing frontmatter block/);
  assert.throws(() => parseEntry("---\ntitle: [unclosed\n---\nbody", "x"), /content\/x\.mdx: invalid YAML/);
  assert.throws(() => parseEntry("---\n- just\n- a list\n---\nbody", "x"), /content\/x\.mdx: frontmatter must be a mapping/);
});

test("sortEntries splits by index and orders by order, then slug", () => {
  const make = (slug: string, index: string, order: number): Entry =>
    parseEntry(file(FRONT.replace("index: main", `index: ${index}`).replace("order: 2", `order: ${order}`)), slug);
  const { main, earlier } = sortEntries([make("b", "main", 2), make("a", "main", 2), make("c", "main", 1), make("d", "earlier", 1), make("e", "hidden", 1)]);
  assert.deepEqual(main.map((e) => e.slug), ["c", "a", "b"]);
  assert.deepEqual(earlier.map((e) => e.slug), ["d"]);
});
