import { test } from "node:test";
import assert from "node:assert/strict";
import { BOOK_STATUSES, NOTE_CATEGORIES, NOTION_VERSION, SCHEMA, schemaDifferences } from "./schema.ts";

const select = (...names: string[]) => ({ type: "select", select: { options: names.map((name) => ({ name })) } });
const books = {
  Title: { type: "title" }, Author: { type: "rich_text" }, ISBN: { type: "rich_text" }, Status: select("reading", "read", "other"),
  Published: { type: "checkbox" }, Date: { type: "date" }, Year: { type: "number" }, Description: { type: "rich_text" },
  Cover: { type: "files" }, Slug: { type: "rich_text" },
};

test("the schema is the one in the spec", () => {
  assert.equal(NOTION_VERSION, "2026-03-11");
  assert.deepEqual([...BOOK_STATUSES], ["reading", "read", "other"]);
  assert.deepEqual([...NOTE_CATEGORIES], ["docs", "bookmarks", "config"]);
  assert.deepEqual(Object.keys(SCHEMA.Notes.properties), ["Title", "Category", "Date", "Published", "Slug"]);
});

test("a matching data source has no differences", () => {
  assert.deepEqual(schemaDifferences("Books", books), []);
});

test("missing, mistyped, and option problems are named", () => {
  const { Author, ...noAuthor } = books;
  assert.deepEqual(schemaDifferences("Books", { ...noAuthor, Year: { type: "rich_text" }, Status: select("reading", "read") }), [
    'Books: missing property "Author" (rich_text)',
    'Books: "Year" is rich_text, expected number',
    'Books: "Status" is missing the option "other"',
  ]);
});

test("extra properties are not differences", () => {
  assert.deepEqual(schemaDifferences("Books", { ...books, Rating: { type: "number" } }), []);
});
