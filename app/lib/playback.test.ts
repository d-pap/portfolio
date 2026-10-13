import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldPlayLoop } from "./playback.ts";

const visibleFilm = { hasRecording: true, visible: true, documentHidden: false };

test("visible films autoplay without requiring hover or a control", () => {
  assert.equal(shouldPlayLoop(visibleFilm), true);
});

test("offscreen films and hidden tabs stop playback", () => {
  assert.equal(shouldPlayLoop({ ...visibleFilm, visible: false }), false);
  assert.equal(shouldPlayLoop({ ...visibleFilm, documentHidden: true }), false);
});

test("still images never autoplay", () => {
  assert.equal(shouldPlayLoop({ ...visibleFilm, hasRecording: false }), false);
});

test("films play for everyone; there is no reduced-motion still", () => {
  assert.equal(shouldPlayLoop.length, 1);
  assert.equal(shouldPlayLoop({ ...visibleFilm, reducedMotion: true } as never), true);
});
