import { test } from "node:test";
import assert from "node:assert/strict";
import { anchorFor, layoutNotes } from "./note-layout.ts";

const note = (n: number, anchor: number, collapsed = 60, expanded = 300) => ({ n, anchor, collapsed, expanded });

test("notes with room stay beside their lines", () => {
  const { tops, height } = layoutNotes([note(1, 0), note(2, 200), note(3, 400)], null);
  assert.deepEqual([...tops], [[1, 0], [2, 200], [3, 400]]);
  assert.equal(height, 460);
});

test("crowded notes stack with the minimum gap", () => {
  const { tops, height } = layoutNotes([note(1, 10), note(2, 40), note(3, 70)], null);
  assert.deepEqual([...tops], [[1, 10], [2, 92], [3, 174]]);
  assert.equal(height, 234);
});

test("the open note pushes the notes below it down", () => {
  const { tops, height } = layoutNotes([note(1, 10), note(2, 40), note(3, 70)], 1);
  assert.deepEqual([...tops], [[1, 10], [2, 332], [3, 414]]);
  assert.equal(height, 474);
});

test("switching notes is computed from the final state, so earlier notes return", () => {
  const notes = [note(1, 10), note(2, 40), note(3, 70)];
  layoutNotes(notes, 1);
  const { tops, height } = layoutNotes(notes, 3);
  assert.deepEqual([...tops], [[1, 10], [2, 92], [3, 174]]);
  assert.equal(height, 474);
});

test("input order does not matter", () => {
  const { tops } = layoutNotes([note(3, 70), note(1, 10), note(2, 40)], null);
  assert.deepEqual([...tops], [[1, 10], [2, 92], [3, 174]]);
});

test("a note anchored above the container is clamped to the top", () => {
  assert.equal(layoutNotes([note(1, -8)], null).tops.get(1), 0);
});

test("no notes have no height", () => {
  assert.deepEqual(layoutNotes([], null), { tops: new Map(), height: 0 });
});

test("anchorFor centers a 20px note line on the claim's line", () => {
  assert.equal(anchorFor({ top: 100, bottom: 139 }), 109.5);
  assert.equal(anchorFor({ top: 100, bottom: 130 }, 30), 100);
});
