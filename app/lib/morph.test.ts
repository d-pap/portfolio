import { test } from "node:test";
import assert from "node:assert/strict";
import { letters, matchLetters, springEasing } from "./morph.ts";

test("letters skips whitespace and keeps punctuation", () => {
  assert.deepEqual(letters(" I’m  Derek.\n"), ["I", "’", "m", "D", "e", "r", "e", "k", "."]);
});

test("identical text keeps every letter in place", () => {
  assert.deepEqual(matchLetters(["ab cd"], ["ab cd"]), [[0, 0], [1, 1], [2, 2], [3, 3]]);
});

test("within a changed part, shared words anchor and letters between them pair up where they can", () => {
  // I(0) b u i l d(5) A I  →  I(0) c a r v e w o o d(9)
  assert.deepEqual(matchLetters(["I build AI"], ["I carve wood"]), [[0, 0], [5, 9]]);
  assert.deepEqual(matchLetters(["a bc d"], ["a xc d"]), [[0, 0], [2, 2], [3, 3]]);
});

test("a kept letter never travels past a shared word", () => {
  // "a" and "b" exist on both sides, but on opposite sides of the anchor Z, so they don't pair.
  assert.deepEqual(matchLetters(["ab Z cd"], ["dc Z ba"]), [[2, 2]]);
});

test("text between parts stays pinned, and letters never pair across parts", () => {
  // Parts: "I " | phrase | " and also" | phrase. The phrases swap words with each other, which a
  // whole-text match would chase across the fixed text; per part, only the fixed text and the
  // letters each phrase shares with its own other version carry over.
  const pairs = matchLetters(["I ", "ran", " and also", "sat"], ["I ", "sat", " and also", "ran"]);
  const fixed = [[0, 0], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10]];
  for (const pair of fixed) assert.ok(pairs.some(([i, j]) => i === pair[0] && j === pair[1]), `missing ${pair}`);
  assert.deepEqual(pairs.filter(([i]) => i >= 1 && i <= 3), [[2, 2]]); // only "a" carries over inside ran → sat
});

test("matchLetters needs the same number of parts on both sides", () => {
  assert.throws(() => matchLetters(["a"], ["a", "b"]), /same number of parts/);
});

test("springEasing starts at 0, ends at 1, and overshoots a little", () => {
  const css = springEasing(0.78);
  assert.match(css, /^linear\(0, .*, 1\)$/);
  const points = css.slice("linear(".length, -1).split(", ").map(Number);
  const peak = Math.max(...points);
  assert.ok(peak > 1 && peak < 1.04, `peak was ${peak}`);
  assert.throws(() => springEasing(1), /between 0 and 1/);
});
