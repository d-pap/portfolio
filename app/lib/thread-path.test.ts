import { test } from "node:test";
import assert from "node:assert/strict";
import { citedPhraseFollows, firstLine, lastLine, threadPath } from "./thread-path.ts";

const phrase = { left: 200, top: 100, right: 400, bottom: 130 };
const marker = { left: 402, top: 98, right: 410, bottom: 110 };

test("below: leaves the underline, drops into the gap, turns twice, ends at the note", () => {
  const d = threadPath({ phrase, marker, target: { x: 800, y: 200 } });
  assert.equal(d, "M400 129.3 H413 C418 129.3 416 135.3 422 135.3 H757 Q766 135.3 766 144.3 V191 Q766 200 775 200 H800");
});

test("a note level with the line gets a straight run", () => {
  const d = threadPath({ phrase, marker, target: { x: 800, y: 135.25 } });
  assert.doesNotMatch(d, /Q/);
  assert.match(d, / H800$/);
});

test("a small vertical offset clamps the corner radius", () => {
  const d = threadPath({ phrase, marker, target: { x: 800, y: 139.25 } });
  assert.match(d, / H764 Q766 135\.3 766 137\.3 V137\.3 Q766 139\.3 768 139\.3 H800$/);
});

test("a note above the line turns upward", () => {
  const d = threadPath({ phrase, marker, target: { x: 800, y: 50 } });
  assert.match(d, / H757 Q766 135\.3 766 126\.3 V59 Q766 50 775 50 H800$/);
});

test("above: starts at the marker and runs over the line", () => {
  const d = threadPath({ phrase, marker, target: { x: 800, y: 60 }, above: true });
  assert.equal(d, "M413 104 C418 104 416 94 422 94 H757 Q766 94 766 85 V69 Q766 60 775 60 H800");
});

test("the vertical run never crosses back over the phrase", () => {
  const d = threadPath({ phrase, marker, target: { x: 440, y: 200 } });
  assert.match(d, /Q431 /);
  assert.doesNotMatch(d, /NaN/);
});

test("citedPhraseFollows detects a later claim on the same line only", () => {
  const last = { left: 300, top: 100, right: 400, bottom: 130 };
  assert.equal(citedPhraseFollows(last, [{ left: 420, top: 100.5, right: 500, bottom: 130 }]), true);
  assert.equal(citedPhraseFollows(last, [{ left: 0, top: 139, right: 120, bottom: 169 }]), false);
  assert.equal(citedPhraseFollows(last, [{ left: 50, top: 100, right: 190, bottom: 130 }]), false);
  assert.equal(citedPhraseFollows(last, []), false);
});

test("a wrapped phrase anchors to its first line and threads from its last", () => {
  const top = { left: 500, top: 100, right: 700, bottom: 130 };
  const bottom = { left: 0, top: 139, right: 120, bottom: 169 };
  assert.deepEqual(firstLine([top, bottom]), top);
  assert.deepEqual(lastLine([top, bottom]), bottom);
  assert.deepEqual(firstLine([bottom, top]), top);
  assert.deepEqual(lastLine([bottom, top]), bottom);
  assert.throws(() => firstLine([]), /no line boxes/);
});
