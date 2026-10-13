import { test } from "node:test";
import assert from "node:assert/strict";
import "./trip.js";

type Trip = {
  transitionType: (from: string | null | undefined, to: string | null | undefined) => string | null;
  liftDistance: (transform: string, height: string, viewport: number) => number;
  roomOf: (url: string | null | undefined) => string | null;
  sheetEdge: (transform: string, height: string, viewport: number) => number;
  frameWipe: (type: string, edge: number, lift: number, height: number) => { offset: number; clipPath: string }[] | null;
};
const { transitionType, liftDistance, roomOf, sheetEdge, frameWipe } = (globalThis as unknown as { __trip: Trip }).__trip;
const at = (p: string) => `https://derekpap.com${p}`;

test("front pages to a room go behind the work", () => {
  assert.equal(transitionType(at("/"), at("/bookshelf")), "to-back");
  assert.equal(transitionType(at("/work/sprout"), at("/bookshelf")), "to-back");
  assert.equal(transitionType(at("/work/sprout#evals"), at("/notes")), "to-back");
});

test("a room back to a front page comes forward", () => {
  assert.equal(transitionType(at("/bookshelf"), at("/")), "to-front");
  assert.equal(transitionType(at("/notes"), at("/work/renew")), "to-front");
});

test("home and case pages keep the case morph in both directions", () => {
  assert.equal(transitionType(at("/"), at("/work/sprout")), "to-case");
  assert.equal(transitionType(at("/"), at("/work/sprout#evals")), "to-case");
  assert.equal(transitionType(at("/work/sprout"), at("/")), "to-case");
});

test("trailing slashes and query strings don't change the type", () => {
  assert.equal(transitionType(at("/?ref=x"), at("/bookshelf/")), "to-back");
  assert.equal(transitionType(at("/bookshelf/"), at("/?a=1")), "to-front");
});

test("everything else gets no type", () => {
  assert.equal(transitionType(at("/bookshelf"), at("/bookshelf")), null);
  assert.equal(transitionType(at("/work/sprout"), at("/work/renew")), null);
  assert.equal(transitionType(at("/"), at("/")), null);
  assert.equal(transitionType("https://example.com/", at("/bookshelf")), null);
  assert.equal(transitionType(undefined, at("/bookshelf")), null);
  assert.equal(transitionType(at("/"), "not a url"), null);
});

test("roomOf names the room a URL opens, so only that doorway flies", () => {
  assert.equal(roomOf(at("/bookshelf")), "bookshelf");
  assert.equal(roomOf(at("/notes/")), "notes");
  assert.equal(roomOf(at("/")), null);
  assert.equal(roomOf(at("/work/sprout")), null);
  assert.equal(roomOf("not a url"), null);
  assert.equal(roomOf(undefined), null);
});

test("room entry URLs count as the room", () => {
  assert.equal(transitionType(at("/"), at("/notes/git-worktrees")), "to-back");
  assert.equal(transitionType(at("/bookshelf/the-way-of-kings"), at("/")), "to-front");
  assert.equal(roomOf(at("/notes/git-worktrees")), "notes");
  assert.equal(roomOf(at("/bookshelf/the-way-of-kings/")), "bookshelf");
});

test("moving inside one room keeps the room still", () => {
  assert.equal(transitionType(at("/bookshelf"), at("/bookshelf/the-way-of-kings")), "within-room");
  assert.equal(transitionType(at("/notes/a"), at("/notes/b")), "within-room");
  assert.equal(transitionType(at("/notes/a"), at("/bookshelf/b")), null);
  assert.equal(transitionType(at("/notes/a"), at("/notes/a")), null);
});

test("the lift clears the sheet's bottom edge plus room for its shadow", () => {
  // A 2400px sheet whose top is 1900px above the viewport ends 500px down the screen.
  assert.equal(liftDistance("matrix(1, 0, 0, 1, 0, -1900)", "2400px", 900), 620);
  assert.equal(liftDistance("matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, -1900, 0, 1)", "2400px", 900), 620);
});

test("a sheet that runs past the fold lifts one viewport plus the clearance", () => {
  assert.equal(liftDistance("matrix(1, 0, 0, 1, 0, 60)", "3000px", 900), 1020);
});

test("an untransformed group counts as sitting at the top", () => {
  assert.equal(liftDistance("none", "400px", 900), 520);
});

test("unreadable geometry falls back to a full viewport", () => {
  assert.equal(liftDistance("", "auto", 900), 1020);
  assert.equal(liftDistance("matrix(1, 0, 0, 1, 0, -1900)", "", 900), 1020);
});

test("the sheet's edge is where its group ends on screen, clamped to the screen", () => {
  assert.equal(sheetEdge("matrix(1, 0, 0, 1, 0, -2042)", "2584.25px", 900), 542.25);
  assert.equal(sheetEdge("none", "2584px", 900), 900);
  assert.equal(sheetEdge("matrix(1, 0, 0, 1, 0, -3000)", "2584px", 900), 0);
  assert.ok(Number.isNaN(sheetEdge("none", "auto", 900)));
});

// Offsets rounded so float noise (1 - 0.8 = 0.19999999999999996) doesn't matter.
const wipe = (...args: Parameters<Trip["frameWipe"]>) =>
  frameWipe(...args)?.map((k) => [Math.round(k.offset * 1e9) / 1e9, k.clipPath]);

test("going behind, the lime frame is uncovered from its bottom up as the sheet's edge rises through it", () => {
  // Edge 480px down, lifted 600px, 60px frame: the edge is at 480 - 600p, so it meets the frame's bottom at p = .7
  // and its top at p = .8.
  assert.deepEqual(wipe("to-back", 480, 600, 60), [
    [0, "inset(60px 0px 0px 0px)"],
    [0.7, "inset(60px 0px 0px 0px)"],
    [0.8, "inset(0px 0px 0px 0px)"],
    [1, "inset(0px 0px 0px 0px)"],
  ]);
});

test("coming back, the dark frame is uncovered from its top down as the sheet's edge drops through it", () => {
  // The edge is at 480 - 600(1 - p): it meets the frame's top at p = .2 and its bottom at p = .3.
  assert.deepEqual(wipe("to-front", 480, 600, 60), [
    [0, "inset(0px 0px 60px 0px)"],
    [0.2, "inset(0px 0px 60px 0px)"],
    [0.3, "inset(0px 0px 0px 0px)"],
    [1, "inset(0px 0px 0px 0px)"],
  ]);
});

test("an edge that never passes through the frame switches it at the nearest end", () => {
  assert.deepEqual(wipe("to-back", 0, 120, 60), [
    [0, "inset(60px 0px 0px 0px)"],
    [0, "inset(60px 0px 0px 0px)"],
    [0, "inset(0px 0px 0px 0px)"],
    [1, "inset(0px 0px 0px 0px)"],
  ]);
  assert.deepEqual(wipe("to-front", 0, 120, 60), [
    [0, "inset(0px 0px 60px 0px)"],
    [1, "inset(0px 0px 60px 0px)"],
    [1, "inset(0px 0px 0px 0px)"],
    [1, "inset(0px 0px 0px 0px)"],
  ]);
});

test("an edge already inside the frame wipes from the start instead of jumping", () => {
  // Edge 30px down: going behind, the wipe starts at p = 0 (not at -30/150) and still clears the top at p = .2.
  assert.deepEqual(wipe("to-back", 30, 150, 60), [
    [0, "inset(60px 0px 0px 0px)"],
    [0, "inset(60px 0px 0px 0px)"],
    [0.2, "inset(0px 0px 0px 0px)"],
    [1, "inset(0px 0px 0px 0px)"],
  ]);
});

test("unreadable geometry gives no wipe, so the frame falls back to a crossfade", () => {
  assert.equal(frameWipe("to-back", NaN, 600, 60), null);
  assert.equal(frameWipe("to-front", 480, 0, 60), null);
  assert.equal(frameWipe("to-back", 480, 600, NaN), null);
});
