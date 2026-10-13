import { test } from "node:test";
import assert from "node:assert/strict";
import { caseLinks, nextEntry, splitLede } from "./case.ts";
import type { Entry } from "./entries.ts";

test("splitLede separates the text before the first section", () => {
  const { lede, rest } = splitLede("First paragraph.\n\nSecond.\n\n## the system\n\nBody.");
  assert.equal(lede, "First paragraph.\n\nSecond.");
  assert.equal(rest, "## the system\n\nBody.");
});

test("splitLede with no sections is all lede", () => {
  assert.deepEqual(splitLede("\nOnly a lede.\n"), { lede: "Only a lede.", rest: "" });
});

test("splitLede with no lede", () => {
  assert.deepEqual(splitLede("## overview\n\nText."), { lede: "", rest: "## overview\n\nText." });
});

test("splitLede ignores ### and inline ##", () => {
  const { lede } = splitLede("Uses C## sometimes.\n\n### small\n\n## real\n\nx");
  assert.equal(lede, "Uses C## sometimes.\n\n### small");
});

test("caseLinks labels App Store, sites, and source", () => {
  assert.deepEqual(caseLinks({ website: "https://apps.apple.com/us/app/x/id1", availability: "code is private" }), {
    links: [{ label: "App Store", href: "https://apps.apple.com/us/app/x/id1" }],
    note: "code is private",
  });
  assert.deepEqual(caseLinks({ website: "https://example.org", repository: "https://github.com/d-pap/x" }).links, [
    { label: "visit site", href: "https://example.org" },
    { label: "source", href: "https://github.com/d-pap/x" },
  ]);
  assert.deepEqual(caseLinks({}), { links: [], note: undefined });
});

const e = (slug: string) => ({ slug }) as Entry;

test("nextEntry cycles through the ordered list", () => {
  const ordered = [e("a"), e("b"), e("c")];
  assert.equal(nextEntry(ordered, "a")?.slug, "b");
  assert.equal(nextEntry(ordered, "c")?.slug, "a");
  assert.equal(nextEntry(ordered, "missing")?.slug, "a");
  assert.equal(nextEntry([e("a")], "a"), undefined);
});
