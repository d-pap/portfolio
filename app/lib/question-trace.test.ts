import { test } from "node:test";
import assert from "node:assert/strict";
import { Q01, traceCounts } from "./question-trace.ts";

test("the counts the trace figure states come from its data", () => {
  assert.deepEqual(traceCounts(Q01), { candidates: 20, passages: 4, documents: 3, cited: 2 });
});

test("every kept passage points at a supplied document, and only supplied documents are cited", () => {
  for (const passage of Q01.passages) assert.ok(Q01.sources[passage.source - 1], `passage ${passage.chunk}`);
  for (const index of Q01.cited) assert.ok(Q01.sources[index - 1], `citation [${index}]`);
});

test("kept passages are marked at their places among the candidates, in rank order", () => {
  const places = Q01.passages.map((passage) => passage.candidate);
  assert.deepEqual(places, [...places].sort((a, b) => a - b));
  for (const place of places) assert.ok(place >= 1 && place <= Q01.candidates, `candidate ${place}`);
});
