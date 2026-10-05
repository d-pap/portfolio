import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { bookKey, coverUrl, parseReading } from "./reading.ts";

const sample = fs.readFileSync(new URL("./fixtures/reading.sample.json", import.meta.url), "utf8");

test("parses, normalizes ISBNs, and sorts ignoring leading articles", () => {
  const books = parseReading(sample);
  assert.deepEqual(books.map((b) => b.title), ["The Design of Everyday Things", "Notes on the Synthesis of Form", "A Pattern Language", "Thinking, Fast and Slow"]);
  assert.equal(books[0].isbn, "9780465050659");
  assert.equal(books[0].year, 2024);
  assert.equal(books[1].isbn, undefined);
});

test("an empty list is valid", () => {
  assert.deepEqual(parseReading("[]"), []);
});

test("problems name the file and the item", () => {
  assert.throws(() => parseReading("{"), /content\/reading\.json: invalid JSON/);
  assert.throws(() => parseReading('{"title":"x"}'), /expected a list of books/);
  assert.throws(() => parseReading('[{"title":"x"}]'), /content\/reading\.json\[0\]: "author" is required/);
  assert.throws(() => parseReading('[{"title":"x","author":"y","isbn":"123"}]'), /\[0\]: "isbn" must be 10 or 13 digits/);
  assert.throws(() => parseReading('[{"title":"x","author":"y","year":"2024"}]'), /"year" must be a whole number/);
  assert.throws(() => parseReading('[{"title":"x","author":"y","notes":"Has Spaces"}]'), /"notes" must be a slug/);
});

test("ten-digit ISBNs may end in X", () => {
  assert.equal(parseReading('[{"title":"x","author":"y","isbn":"0-306-40615-x"}]')[0].isbn, "030640615X");
});

test("coverUrl asks Open Library for a 404 when there is no cover", () => {
  assert.equal(coverUrl("9780374533557"), "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg?default=false");
});

test("bookKey is stable and URL-safe", () => {
  assert.equal(bookKey({ title: "Thinking, Fast and Slow", author: "Daniel Kahneman" }), "thinking-fast-and-slow-daniel-kahneman");
});
