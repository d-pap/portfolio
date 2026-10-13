import { test } from "node:test";
import assert from "node:assert/strict";
import { parseBookPage, parseNotePage, type RawPage } from "./pages.ts";

const rt = (text: string) => [{ plain_text: text }];
function bookPage(over: Record<string, unknown> = {}): RawPage {
  return {
    id: "b1", url: "https://www.notion.so/b1", created_time: "2026-10-01T12:00:00.000Z", last_edited_time: "2026-10-02T12:00:00.000Z",
    properties: {
      Title: { type: "title", title: rt("The Way of Kings") }, Author: { type: "rich_text", rich_text: rt("Brandon Sanderson") },
      ISBN: { type: "rich_text", rich_text: rt("978-0-7653-6527-9") }, Status: { type: "select", select: { name: "read" } },
      Published: { type: "checkbox", checkbox: true }, Date: { type: "date", date: { start: "2026-09-30" } },
      Year: { type: "number", number: null }, Description: { type: "rich_text", rich_text: [] },
      Cover: { type: "files", files: [] }, Slug: { type: "rich_text", rich_text: [] },
      ...over,
    },
  } as RawPage;
}

test("a complete book page becomes a record", () => {
  const parsed = parseBookPage(bookPage());
  assert.ok(parsed.ok);
  assert.deepEqual(parsed.record, {
    id: "b1", url: "https://www.notion.so/b1", title: "The Way of Kings", author: "Brandon Sanderson", isbn: "9780765365279",
    status: "read", date: "2026-09-30", createdTime: "2026-10-01T12:00:00.000Z", lastEditedTime: "2026-10-02T12:00:00.000Z",
    year: null, description: null, cover: null, slug: null,
  });
});

test("overrides come through: year, description, cover, slug", () => {
  const parsed = parseBookPage(bookPage({
    Year: { type: "number", number: 2010 }, Description: { type: "rich_text", rich_text: rt("Mine.") },
    Cover: { type: "files", files: [{ type: "file", name: "c.jpg", file: { url: "https://files.notion.so/c.jpg?sig=1" } }] },
    Slug: { type: "rich_text", rich_text: rt("kings") },
  }));
  assert.ok(parsed.ok);
  assert.equal(parsed.record.year, 2010);
  assert.equal(parsed.record.description, "Mine.");
  assert.equal(parsed.record.cover, "https://files.notion.so/c.jpg?sig=1");
  assert.equal(parsed.record.slug, "kings");
});

test("a bad book page is described, not returned", () => {
  const parsed = parseBookPage(bookPage({ Title: { type: "title", title: [] }, Author: { type: "rich_text", rich_text: [] }, Status: { type: "select", select: null }, ISBN: { type: "rich_text", rich_text: rt("123") } }));
  assert.equal(parsed.ok, false);
  assert.equal(!parsed.ok && parsed.message, '[notion] Books "Untitled" (https://www.notion.so/b1): Title is empty; Author is empty; Status is not set; ISBN "123" must be 10 or 13 digits');
});

test("an unknown status is named", () => {
  const parsed = parseBookPage(bookPage({ Status: { type: "select", select: { name: "abandoned" } } }));
  assert.equal(!parsed.ok && parsed.message, '[notion] Books "The Way of Kings" (https://www.notion.so/b1): Status "abandoned" is not one of reading, read, other');
});

test("a note page becomes a record; category is optional", () => {
  const page = {
    id: "n1", url: "https://www.notion.so/n1", created_time: "2026-10-12T09:00:00.000Z", last_edited_time: "2026-10-12T10:00:00.000Z",
    properties: { Title: { type: "title", title: rt("keeping your place") }, Category: { type: "select", select: null }, Date: { type: "date", date: { start: "2026-10-12" } }, Published: { type: "checkbox", checkbox: true }, Slug: { type: "rich_text", rich_text: [] } },
  } as RawPage;
  const parsed = parseNotePage(page);
  assert.ok(parsed.ok);
  assert.equal(parsed.record.category, null);
  assert.equal(parsed.record.title, "keeping your place");
  const bad = parseNotePage({ ...page, properties: { ...page.properties, Category: { type: "select", select: { name: "essays" } } } } as RawPage);
  assert.equal(!bad.ok && bad.message, '[notion] Notes "keeping your place" (https://www.notion.so/n1): Category "essays" is not one of docs, bookmarks, config');
});
