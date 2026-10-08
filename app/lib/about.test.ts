import { test } from "node:test";
import assert from "node:assert/strict";
import { parseAbout } from "./about.ts";

test("splits plain text from {work | play} phrases, in order", () => {
  assert.deepEqual(parseAbout("I’m Derek, {an engineer | a woodworker}. I {build | carve} things."), [
    "I’m Derek, ",
    { work: "an engineer", play: "a woodworker" },
    ". I ",
    { work: "build", play: "carve" },
    " things.",
  ]);
});

test("line breaks and runs of spaces read as single spaces, and the ends are trimmed", () => {
  assert.deepEqual(parseAbout("\n  I {build\n  AI | carve   wood}.\nI read.\n"), ["I ", { work: "build AI", play: "carve wood" }, ". I read."]);
});

test("a phrase can open or close the paragraph", () => {
  assert.deepEqual(parseAbout("{Hi | Hey}"), [{ work: "Hi", play: "Hey" }]);
});

test("problems name the file and the line", () => {
  assert.throws(() => parseAbout("I {build | carve"), /content\/about\.txt: "\{" at line 1 is never closed/);
  assert.throws(() => parseAbout("I build}"), /content\/about\.txt: "\}" at line 1 has no matching "\{"/);
  assert.throws(() => parseAbout("I\n{a {b | c} | d}"), /"\{" at line 2 is inside another phrase/);
  assert.throws(() => parseAbout("I {build}"), /phrase at line 1 needs exactly one "\|"/);
  assert.throws(() => parseAbout("I {a | b | c}"), /phrase at line 1 needs exactly one "\|"/);
  assert.throws(() => parseAbout("I { | carve}"), /phrase at line 1 needs text on both sides of "\|"/);
  assert.throws(() => parseAbout("Just text."), /content\/about\.txt: needs at least one \{work \| play\} phrase/);
});
