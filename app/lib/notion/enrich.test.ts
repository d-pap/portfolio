import { test } from "node:test";
import assert from "node:assert/strict";
import { IncompleteLookup, NO_LOOKUP as none, cleanGoogleDescription, cleanOpenLibraryDescription, lookupBook, mergeBook, pickGoogleMatch, resolveIsbn, stripHtml, type Lookup } from "./enrich.ts";
const kings = { title: "The Way of Kings", author: "Brandon Sanderson", isbn: "9780765365279" };
const item = (title: string, authors: string[], description?: string, isbn?: string) => ({ volumeInfo: { title, authors, description, industryIdentifiers: isbn ? [{ identifier: isbn }] : [] } });
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

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

async function withStubbedFetch(answer: (url: string) => Response, run: (urls: string[]) => Promise<void>, { googleKey }: { googleKey?: string } = {}) {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (googleKey) process.env.GOOGLE_BOOKS_API_KEY = googleKey;
  else delete process.env.GOOGLE_BOOKS_API_KEY;
  const urls: string[] = [];
  globalThis.fetch = (async (input: any) => { const url = String(input); urls.push(url); return answer(url); }) as typeof fetch;
  try {
    await run(urls);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey !== undefined) process.env.GOOGLE_BOOKS_API_KEY = originalKey;
    else delete process.env.GOOGLE_BOOKS_API_KEY;
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

test("an edition's own cover wins over the book's default cover", async () => {
  await withStubbedFetch(
    (url) => url.includes("/search.json") ? json({ docs: [{ first_publish_year: 2010, cover_i: 7 }] })
      : url.includes("/isbn/9780765365279") ? json({ covers: [-1, 14658076], works: [] })
      : json({}, 404),
    async () => {
      assert.equal((await lookupBook(kings, { retryBaseMs: 0 })).coverId, 14658076);
    },
  );
});

const dune = { title: "Dune", author: "Frank Herbert" };

test("a title and author resolve to the ISBN of Google's match, preferring one with a description", async () => {
  await withStubbedFetch(
    (url) => url.includes("googleapis.com") ? json({ items: [
      item("Dune", ["Frank Herbert"], undefined, "0441013597"),
      item("Dune", ["Frank Herbert"], "Arrakis.", "9780441013593"),
    ] }) : json({}, 404),
    async () => {
      assert.equal(await resolveIsbn(dune, { retryBaseMs: 0 }), "9780441013593");
    },
    { googleKey: "test-key" },
  );
});

test("Google matches without an ISBN fall through to Open Library's edition", async () => {
  await withStubbedFetch(
    (url) => url.includes("googleapis.com") ? json({ items: [item("Dune", ["Frank Herbert"], "A library scan.")] })
      : url.includes("/search.json") ? json({ docs: [
        { title: "Dune Messiah", author_name: ["Frank Herbert"], editions: { docs: [{ isbn: ["9780425074985"] }] } },
        { title: "Dune", author_name: ["Frank Herbert"], editions: { docs: [{ isbn: ["bad", "0425038912", "9780425038918"] }] } },
      ] })
      : json({}, 404),
    async () => {
      assert.equal(await resolveIsbn(dune, { retryBaseMs: 0 }), "9780425038918");
    },
    { googleKey: "test-key" },
  );
});

test("a title and author with no match anywhere resolve to nothing", async () => {
  await withStubbedFetch(() => json({}, 404), async () => {
    assert.equal(await resolveIsbn(dune, { retryBaseMs: 0 }), null);
  });
});

test("a resolve that gave up on transient errors throws instead of answering nothing", async () => {
  await withStubbedFetch(() => new Response("busy", { status: 503 }), async () => {
    await assert.rejects(resolveIsbn(dune, { retryBaseMs: 0 }), IncompleteLookup);
  });
});

test("a resolve doesn't settle for Open Library while Google is failing", async () => {
  await withStubbedFetch(
    (url) => url.includes("googleapis.com") ? new Response("busy", { status: 503 })
      : json({ docs: [{ title: "Dune", author_name: ["Frank Herbert"], editions: { docs: [{ isbn: ["9780425038918"] }] } }] }),
    async () => {
      await assert.rejects(resolveIsbn(dune, { retryBaseMs: 0 }), IncompleteLookup);
    },
    { googleKey: "test-key" },
  );
});

test("an ISBN Open Library doesn't list takes the year and cover from the matching work", async () => {
  const bryson = { title: "A Short History of Nearly Everything", author: "Bill Bryson", isbn: "9780385703499" };
  await withStubbedFetch(
    (url) => url.includes("/search.json?isbn=") ? json({ docs: [] })
      : url.includes("/search.json") ? json({ docs: [
        { title: "A Short History of Nearly Everything (Illustrated)", author_name: ["Bill Bryson"], first_publish_year: 2010, cover_i: 1 },
        { title: "A Short History of Nearly Everything", author_name: ["Bill Bryson"], first_publish_year: 2003, cover_i: 12725620 },
      ] })
      : json({}, 404),
    async () => {
      const found = await lookupBook(bryson, { retryBaseMs: 0 });
      assert.deepEqual([found.year, found.coverId], [2003, 12725620]);
    },
  );
});

test("Google blurbs lose the wrapping quotes and the publisher's sign-off", () => {
  assert.equal(cleanGoogleDescription(`"The war moves on. Dalinar leads."--Publisher's description.`), "The war moves on. Dalinar leads.");
  assert.equal(cleanGoogleDescription(`“A curly one.” -- Publisher’s Description`), "A curly one.");
  assert.equal(cleanGoogleDescription(`Plain text with a "quote" inside.`), `Plain text with a "quote" inside.`);
});

// A daily quota won't clear in seconds: retrying only slows every page that renders while it lasts.
const quotaRefusal = () => new Response(JSON.stringify({ error: { code: 429, message: "Quota exceeded for quota metric 'Queries' and limit 'Queries per day' of service 'books.googleapis.com'" } }), { status: 429 });

test("Google's daily-quota refusal isn't retried, and the lookup isn't kept", async () => {
  await withStubbedFetch(
    (url) => url.includes("googleapis.com") ? quotaRefusal() : json({}, 404),
    async (urls) => {
      await assert.rejects(lookupBook(kings, { retryBaseMs: 0 }), IncompleteLookup);
      assert.equal(urls.filter((u) => u.includes("googleapis.com")).length, 1);
    },
    { googleKey: "test-key" },
  );
});

test("a resolve stops at Google's daily-quota refusal without retrying", async () => {
  await withStubbedFetch(
    (url) => url.includes("googleapis.com") ? quotaRefusal() : json({}, 404),
    async (urls) => {
      await assert.rejects(resolveIsbn(dune, { retryBaseMs: 0 }), IncompleteLookup);
      assert.equal(urls.filter((u) => u.includes("googleapis.com")).length, 1);
    },
    { googleKey: "test-key" },
  );
});

// A catalog that never answers must not hold a page past the build's limit: the lookup stops at its budget.
test("a lookup stops at its time budget when a catalog never answers", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = ((_input: unknown, init?: RequestInit) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
  })) as typeof fetch;
  // AbortSignal.timeout doesn't hold Node's event loop open, and nothing else here would; a server always does.
  const keepAlive = setInterval(() => {}, 1000);
  try {
    const started = Date.now();
    await assert.rejects(lookupBook(kings, { retryBaseMs: 0, budgetMs: 150 }), IncompleteLookup);
    await assert.rejects(resolveIsbn(dune, { retryBaseMs: 0, budgetMs: 150 }), IncompleteLookup);
    assert.ok(Date.now() - started < 2000, `took ${Date.now() - started}ms`);
  } finally {
    clearInterval(keepAlive);
    globalThis.fetch = originalFetch;
  }
});
