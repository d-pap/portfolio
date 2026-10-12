import { test } from "node:test";
import assert from "node:assert/strict";
import { ROOMS, visibleRooms } from "./rooms.ts";

test("rooms appear in a fixed order when their content exists", () => {
  assert.deepEqual(ROOMS, ["bookshelf", "desk"]);
  assert.deepEqual(visibleRooms({ books: true, desk: true }), ["bookshelf", "desk"]);
});

test("the bookshelf hides when there are no books", () => {
  assert.deepEqual(visibleRooms({ books: false, desk: true }), ["desk"]);
  assert.deepEqual(visibleRooms({ books: false, desk: false }), []);
});

test("the desk stays hidden until it has content", () => {
  assert.deepEqual(visibleRooms({ books: true, desk: false }), ["bookshelf"]);
});
