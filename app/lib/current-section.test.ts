import { test } from "node:test";
import assert from "node:assert/strict";
import { currentSection } from "./current-section.ts";

const view = { line: 140, height: 900, atBottom: false, hash: "" };
const headings = [
  { id: "a", top: -400 },
  { id: "b", top: 100 },
  { id: "c", top: 500 },
];

test("the current section is the last heading at or above the line", () => {
  assert.equal(currentSection(headings, view), "b");
});

test("before the first heading reaches the line, the overview is current", () => {
  assert.equal(currentSection([{ id: "a", top: 300 }], view), "overview");
});

test("at the bottom of the page, a short last section counts once its heading is on screen", () => {
  assert.equal(currentSection(headings, { ...view, atBottom: true }), "c");
});

test("at the bottom of the page, the heading the visitor jumped to wins while it's on screen", () => {
  assert.equal(currentSection(headings, { ...view, atBottom: true, hash: "#b" }), "b");
  assert.equal(currentSection(headings, { ...view, atBottom: true, hash: "#a" }), "c");
});
