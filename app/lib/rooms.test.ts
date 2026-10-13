import { test } from "node:test";
import assert from "node:assert/strict";
import { ROOMS, visibleRooms } from "./rooms.ts";

test("the rooms are the bookshelf and notes, in that order", () => {
  assert.deepEqual(ROOMS, ["bookshelf", "notes"]);
  assert.deepEqual(visibleRooms({ books: true, notes: true }), ["bookshelf", "notes"]);
});

test("a room with nothing published has no doorway", () => {
  assert.deepEqual(visibleRooms({ books: true, notes: false }), ["bookshelf"]);
  assert.deepEqual(visibleRooms({ books: false, notes: true }), ["notes"]);
});
