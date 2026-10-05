import { test } from "node:test";
import assert from "node:assert/strict";
import { playbackMode } from "./playback.ts";

test("no recording never plays", () => {
  assert.equal(playbackMode({ hasRecording: false, canHover: true, reducedMotion: false }), "none");
  assert.equal(playbackMode({ hasRecording: false, canHover: false, reducedMotion: true }), "none");
});

test("pointer devices play on hover, even with reduced motion (the visitor starts it)", () => {
  assert.equal(playbackMode({ hasRecording: true, canHover: true, reducedMotion: false }), "hover");
  assert.equal(playbackMode({ hasRecording: true, canHover: true, reducedMotion: true }), "hover");
});

test("touch devices play in view, or on tap with reduced motion", () => {
  assert.equal(playbackMode({ hasRecording: true, canHover: false, reducedMotion: false }), "in-view");
  assert.equal(playbackMode({ hasRecording: true, canHover: false, reducedMotion: true }), "tap");
});
