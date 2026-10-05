import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { chooseRun, firstLine, mergeLines, routeSide, lastLine, threadPath } from "./thread-path.ts";

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

test("routeSide picks the side that crosses the least claim underline", () => {
  const last = { left: 100, top: 100, right: 300, bottom: 130 };
  const sameLine = { left: 340, top: 100.5, right: 500, bottom: 130 };
  assert.equal(routeSide(last, [], 800), "below");
  assert.equal(routeSide(last, [sameLine], 800), "above");
  assert.equal(routeSide(last, [sameLine, { left: 250, top: 61, right: 700, bottom: 91 }], 800), "below");
  assert.equal(routeSide(last, [{ left: 340, top: 100, right: 700, bottom: 130 }, { left: 280, top: 61, right: 400, bottom: 91 }], 800), "above");
});

test("routeSide ignores claims two lines up and claims before the phrase end", () => {
  const last = { left: 100, top: 100, right: 300, bottom: 130 };
  const sameLine = { left: 340, top: 100.5, right: 500, bottom: 130 };
  assert.equal(routeSide(last, [sameLine, { left: 300, top: 22, right: 700, bottom: 52 }], 800), "above");
  assert.equal(routeSide(last, [{ left: 0, top: 100, right: 90, bottom: 130 }], 800), "below");
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

test("far: drops beside the paragraph, runs under it, and ends at the note", () => {
  const d = threadPath({ phrase, marker, target: { x: 800, y: 200 }, runY: 180 });
  assert.equal(d, "M400 129.3 H413 Q422 129.3 422 138.3 V171 Q422 180 431 180 H757 Q766 180 766 189 V191 Q766 200 775 200 H800");
});

test("mergeLines joins fragments on the same line and sorts lines top to bottom", () => {
  const lowerLine = { left: 300, top: 140, right: 500, bottom: 170 };
  const upperStart = { left: 0, top: 100, right: 200, bottom: 130 };
  const upperEnd = { left: 200, top: 101, right: 450, bottom: 131 };
  assert.deepEqual(mergeLines([lowerLine, upperStart, upperEnd]), [
    { left: 0, top: 100, right: 450, bottom: 131 },
    { left: 300, top: 140, right: 500, bottom: 170 },
  ]);
  assert.deepEqual(mergeLines([]), []);
});

describe("chooseRun", () => {
  // turnX = 413, so the far route's drop runs at x = 422 and later lines must end before 420.
  const sameLine = { left: 500, top: 100.5, right: 700, bottom: 130 };
  const previousLine = { left: 300, top: 61, right: 500, bottom: 91 };
  const paragraph = (...laterRights: number[]) => [
    { left: 0, top: 61, right: 700, bottom: 91 },
    { left: 0, top: 100, right: 720, bottom: 130 },
    ...laterRights.map((right, i) => ({ left: 0, top: 139 + i * 39, right, bottom: 169 + i * 39 })),
  ];

  test("runs below the line when no claim sits later on it", () => {
    const before = { left: 0, top: 100, right: 150, bottom: 130 };
    assert.deepEqual(chooseRun({ phrase, marker, others: [before, previousLine], lines: paragraph(380), endX: 800 }), { above: false });
  });

  test("runs above the line when a later claim sits on it and the previous line is clear", () => {
    const earlyOnPrevious = { left: 0, top: 61, right: 200, bottom: 91 };
    assert.deepEqual(chooseRun({ phrase, marker, others: [sameLine, earlyOnPrevious], lines: paragraph(380), endX: 800 }), { above: true });
  });

  test("runs under the paragraph when both gaps are crowded and later lines end before the drop", () => {
    assert.deepEqual(chooseRun({ phrase, marker, others: [sameLine, previousLine], lines: paragraph(380, 419), endX: 800 }), { above: false, runY: 214 });
  });

  test("falls back to the least-crossing side when a later line reaches the drop", () => {
    // routeSide: below crosses 200px of underline, above crosses 100px (400 to 500).
    assert.deepEqual(chooseRun({ phrase, marker, others: [sameLine, previousLine], lines: paragraph(380, 420), endX: 800 }), { above: true });
  });

  test("counts raised markers and padded claim boxes as part of their own line", () => {
    // Range rects as the browser returns them: claim boxes are padded 4px, markers sit 3.1px low.
    const lines = [
      { left: 0, top: 61, right: 700, bottom: 91 },
      { left: 0, top: 100, right: 720, bottom: 130 },
      { left: 600, top: 103.1, right: 607, bottom: 116.6 }, // a later claim's marker on the phrase's line
      { left: 0, top: 135, right: 380, bottom: 173 }, // a padded claim box on the next line
      { left: 0, top: 139, right: 380, bottom: 169 },
      { left: 300, top: 142.1, right: 307, bottom: 155.6 }, // that claim's marker
    ];
    assert.deepEqual(chooseRun({ phrase, marker, others: [sameLine, previousLine], lines, endX: 800 }), { above: false, runY: 179 });
  });

  test("falls back when the phrase is on the paragraph's last line", () => {
    assert.deepEqual(chooseRun({ phrase, marker, others: [sameLine, previousLine], lines: paragraph(), endX: 800 }), { above: true });
  });
});
