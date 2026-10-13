import { test } from "node:test";
import assert from "node:assert/strict";
import { fallbackBooks } from "./fallback.ts";

test("without a token, reading.json becomes read books with Open Library covers and no notes", () => {
  const [book] = fallbackBooks([{ title: "The Way of Kings", author: "Brandon Sanderson", isbn: "9780765365279" }]);
  assert.equal(book.slug, "the-way-of-kings");
  assert.equal(book.status, "read");
  assert.equal(book.cover, "https://covers.openlibrary.org/b/isbn/9780765365279-L.jpg");
  assert.equal(book.description, null);
  assert.equal(book.year, null);
});
