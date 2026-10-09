import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldPlayLoop } from "./playback.ts";

const visibleFilm = { hasRecording: true, visible: true, reducedMotion: false, documentHidden: false };

test("visible films autoplay without requiring hover or a control", () => {
  assert.equal(shouldPlayLoop(visibleFilm), true);
});

test("offscreen films and hidden tabs stop playback", () => {
  assert.equal(shouldPlayLoop({ ...visibleFilm, visible: false }), false);
  assert.equal(shouldPlayLoop({ ...visibleFilm, documentHidden: true }), false);
});

test("reduced motion and still images never autoplay", () => {
  assert.equal(shouldPlayLoop({ ...visibleFilm, reducedMotion: true }), false);
  assert.equal(shouldPlayLoop({ ...visibleFilm, hasRecording: false }), false);
});
