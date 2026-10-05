import { test } from "node:test";
import assert from "node:assert/strict";
import { checkIntroPairs } from "./home-intro.ts";

const intro = (claims: number[], notes: number[]) =>
  `I build ${claims.map((n) => `<Claim n={${n}}>thing ${n}</Claim>`).join(" and ")}.\n\n` +
  notes.map((n) => `<Note n={${n}} thumb="icon:diagram" meta="m" text="t">\n  <EvalChecks />\n</Note>`).join("\n\n");

test("matching claims and notes return the sorted numbers", () => {
  assert.deepEqual(checkIntroPairs(intro([2, 1, 3], [1, 2, 3])), [1, 2, 3]);
});

test("a claim without a note fails with the file name", () => {
  assert.throws(() => checkIntroPairs(intro([1, 2], [1])), /content\/home\.mdx: claim 2 has no <Note n=\{2\}>/);
});

test("a note without a claim fails", () => {
  assert.throws(() => checkIntroPairs(intro([1], [1, 2])), /content\/home\.mdx: note 2 has no matching <Claim>/);
});

test("duplicates and empty intros fail", () => {
  assert.throws(() => checkIntroPairs(intro([1, 1], [1])), /claim 1 appears twice/);
  assert.throws(() => checkIntroPairs(intro([1], [1, 1])), /note 1 appears twice/);
  assert.throws(() => checkIntroPairs("Just text."), /no <Claim> found/);
});
