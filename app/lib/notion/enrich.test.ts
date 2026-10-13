import { test } from "node:test";
import assert from "node:assert/strict";
import { IncompleteLookup, NO_LOOKUP as none, cleanOpenLibraryDescription, lookupBook, mergeBook, pickGoogleMatch, stripHtml, type Lookup } from "./enrich.ts";
const kings = { title: "The Way of Kings", author: "Brandon Sanderson", isbn: "9780765365279" };
const item = (title: string, authors: string[], description?: string, isbn?: string) => ({ volumeInfo: { title, authors, description, industryIdentifiers: isbn ? [{ identifier: isbn }] : [] } });

test("Notion overrides win over everything", () => {
  const found: Lookup = { year: 2011, description: "From Google.", source: "google books", coverId: 42 };
  assert.deepEqual(mergeBook({ year: 2010, description: "Mine.", cover: "https://blob/x.jpg" }, found), {
    year: 2010, description: { text: "Mine.", source: "notion" }, cover: "https://blob/x.jpg",
  });
});

test("lookups fill what Notion leaves empty", () => {
  assert.deepEqual(mergeBook({ year: null, description: null, cover: null }, { year: 2010, description: "Roshar.", source: "open library", coverId: 7 }), {
    year: 2010, description: { text: "Roshar.", source: "open library" }, cover: "https://covers.openlibrary.org/b/id/7-L.jpg",
  });
});

test("a book with nothing anywhere has no year, description, or cover", () => {
  assert.deepEqual(mergeBook({ year: null, description: null, cover: null }, none), { year: null, description: null, cover: null });
});

test("Google matches need the title and the author's surname, and prefer the ISBN", () => {
  const items = [
    item("The Way of Kings Prime", ["Brandon Sanderson"], "Prime."),
    item("The Way of Kings", ["Someone Else"], "Wrong author."),
    item("The Way of Kings", ["Brandon Sanderson"], "Any edition."),
    item("The Way of Kings: Book One of the Stormlight Archive", ["Brandon Sanderson"], "This edition.", "9780765365279"),
  ];
  assert.equal(pickGoogleMatch(items, kings)?.volumeInfo?.description, "This edition.");
  assert.equal(pickGoogleMatch(items.slice(0, 3), kings)?.volumeInfo?.description, "Any edition.");
  assert.equal(pickGoogleMatch(items.slice(0, 2), kings), null);
});

test("descriptions come through as plain text", () => {
  assert.equal(stripHtml("<p>One &amp; two.</p><p>Three<br>four.</p>"), "One & two.\n\nThree\nfour.");
  assert.equal(cleanOpenLibraryDescription("Roshar is a world.\r\n\r\n([source][1])\n\n----------\n[1]: https://example.com"), "Roshar is a world.");
});

async function withStubbedFetch(answer: (url: string) => Response, run: (urls: string[]) => Promise<void>) {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.GOOGLE_BOOKS_API_KEY;
  delete process.env.GOOGLE_BOOKS_API_KEY;
  const urls: string[] = [];
  globalThis.fetch = (async (input: any) => { const url = String(input); urls.push(url); return answer(url); }) as typeof fetch;
  try {
    await run(urls);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey !== undefined) process.env.GOOGLE_BOOKS_API_KEY = originalKey;
  }
}

test("a lookup where every catalog answers 404 resolves to nothing", async () => {
  await withStubbedFetch(() => new Response("{}", { status: 404 }), async () => {
    assert.deepEqual(await lookupBook(kings, { retryBaseMs: 0 }), { year: null, description: null, source: null, coverId: null });
  });
});

test("a lookup that gave up on transient errors throws IncompleteLookup with what it found", async () => {
  await withStubbedFetch(
    (url) => url.includes("/search.json")
      ? new Response(JSON.stringify({ docs: [{ first_publish_year: 2010, cover_i: 7 }] }), { status: 200 })
      : new Response("busy", { status: 503 }),
    async (urls) => {
      await assert.rejects(lookupBook(kings, { retryBaseMs: 0 }), (error) => {
        assert.ok(error instanceof IncompleteLookup);
        assert.deepEqual(error.partial, { year: 2010, description: null, source: null, coverId: 7 });
        return true;
      });
      assert.equal(urls.filter((u) => u.includes("/isbn/")).length, 4);
    },
  );
});
