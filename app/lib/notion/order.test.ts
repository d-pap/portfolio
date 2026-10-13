import { test } from "node:test";
import assert from "node:assert/strict";
import { bookSub, filtersFor, formatDate, orderBooks, orderNotes } from "./order.ts";

const book = (title: string, status: "reading" | "read" | "other", date: string | null, createdTime: string) => ({ title, status, date, createdTime });

test("books: reading, then read, then other; newest first; then title without articles", () => {
  const ordered = orderBooks([
    book("Zed", "read", null, "2026-01-01T00:00:00.000Z"),
    book("The Apple", "read", null, "2026-01-01T00:00:00.000Z"),
    book("Old read", "read", "2025-01-01", "2026-03-01T00:00:00.000Z"),
    book("Newer read", "read", "2026-02-01", "2026-01-01T00:00:00.000Z"),
    book("Other", "other", null, "2026-09-01T00:00:00.000Z"),
    book("Now", "reading", null, "2026-01-01T00:00:00.000Z"),
  ]).map((b) => b.title);
  assert.deepEqual(ordered, ["Now", "Newer read", "The Apple", "Zed", "Old read", "Other"]);
});

test("notes: newest first by date, falling back to creation time", () => {
  const ordered = orderNotes([
    { title: "a", date: "2026-10-01", createdTime: "2026-01-01T00:00:00.000Z" },
    { title: "b", date: null, createdTime: "2026-10-05T00:00:00.000Z" },
    { title: "c", date: "2026-10-03", createdTime: "2026-01-01T00:00:00.000Z" },
  ]).map((n) => n.title);
  assert.deepEqual(ordered, ["b", "c", "a"]);
});

test("filters show only values in use, in canonical order, after all", () => {
  assert.deepEqual(filtersFor(["read", "read"], ["reading", "read", "other"]), ["all", "read"]);
  assert.deepEqual(filtersFor([null, "config", "docs"], ["docs", "bookmarks", "config"]), ["all", "docs", "config"]);
  assert.deepEqual(filtersFor([null], ["docs", "bookmarks", "config"]), ["all"]);
});

test("dates read like Oct 11, 2026, in UTC", () => {
  assert.equal(formatDate("2026-10-11"), "Oct 11, 2026");
  assert.equal(formatDate("2026-01-02T23:30:00.000-05:00"), "Jan 2, 2026");
});

test("the book line under a title: author, then year when known", () => {
  assert.equal(bookSub({ author: "Brandon Sanderson", year: 2010 }), "Brandon Sanderson, 2010");
  assert.equal(bookSub({ author: "Brandon Sanderson", year: null }), "Brandon Sanderson");
});
