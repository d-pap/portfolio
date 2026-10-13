import { test } from "node:test";
import assert from "node:assert/strict";
import { IncompleteLookup, NO_LOOKUP as none, cleanOpenLibraryDescription, lookupBook, mergeBook, type Lookup } from "./enrich.ts";
const kings = { title: "The Way of Kings", author: "Brandon Sanderson", isbn: "9780765365279" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

test("Notion overrides win over everything", () => {
  const found: Lookup = { year: 2011, description: "From Open Library.", coverId: 42 };
  assert.deepEqual(mergeBook({ year: 2010, description: "Mine.", cover: "https://blob/x.jpg" }, found), {
    year: 2010, description: { text: "Mine.", source: "notion" }, cover: "https://blob/x.jpg",
  });
});

test("lookups fill what Notion leaves empty", () => {
  assert.deepEqual(mergeBook({ year: null, description: null, cover: null }, { year: 2010, description: "Roshar.", coverId: 7 }), {
    year: 2010, description: { text: "Roshar.", source: "open library" }, cover: "https://covers.openlibrary.org/b/id/7-L.jpg",
  });
});

test("a book with nothing anywhere has no year, description, or cover", () => {
  assert.deepEqual(mergeBook({ year: null, description: null, cover: null }, none), { year: null, description: null, cover: null });
});

test("descriptions come through as plain text", () => {
  assert.equal(cleanOpenLibraryDescription("Roshar is a world.\r\n\r\n([source][1])\n\n----------\n[1]: https://example.com"), "Roshar is a world.");
});

async function withStubbedFetch(answer: (url: string) => Response, run: (urls: string[]) => Promise<void>) {
  const originalFetch = globalThis.fetch;
  const urls: string[] = [];
  globalThis.fetch = (async (input: any) => { const url = String(input); urls.push(url); return answer(url); }) as typeof fetch;
  try {
    await run(urls);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("a lookup where every catalog answers 404 resolves to nothing", async () => {
  await withStubbedFetch(() => new Response("{}", { status: 404 }), async () => {
    assert.deepEqual(await lookupBook(kings, { retryBaseMs: 0 }), { year: null, description: null, coverId: null });
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
        assert.deepEqual(error.partial, { year: 2010, description: null, coverId: 7 });
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

test("a book without an ISBN takes its year, cover, and description from the work matching its title and author", async () => {
  await withStubbedFetch(
    (url) => url.includes("/search.json") ? json({ docs: [
      { key: "/works/OL1W", title: "The Way of Kings, Part One", author_name: ["Brandon Sanderson"], first_publish_year: 2011, cover_i: 1 },
      { key: "/works/OL2W", title: "The Way of Kings", author_name: ["Someone Else"], first_publish_year: 1999, cover_i: 2 },
      { key: "/works/OL3W", title: "The Way of Kings", author_name: ["Brandon Sanderson"], first_publish_year: 2010, cover_i: 14658316 },
    ] })
      : url.endsWith("/works/OL3W.json") ? json({ description: { value: "Roshar is a world of stone and storms." } })
      : json({}, 404),
    async (urls) => {
      assert.deepEqual(await lookupBook({ ...kings, isbn: null }, { retryBaseMs: 0 }), { year: 2010, description: "Roshar is a world of stone and storms.", coverId: 14658316 });
      assert.ok(!urls.some((u) => u.includes("isbn")), "no ISBN requests without an ISBN");
    },
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

// Open Library allows 1 request a second from apps that don't say who they are, 3 from ones that give a contact.
test("lookups tell Open Library who is asking and how to reach them", async () => {
  const originalFetch = globalThis.fetch;
  const agents: (string | null)[] = [];
  globalThis.fetch = (async (_input: unknown, init?: RequestInit) => {
    agents.push(new Headers(init?.headers).get("User-Agent"));
    return json({}, 404);
  }) as typeof fetch;
  try {
    await lookupBook(kings, { retryBaseMs: 0 });
    assert.ok(agents.length > 0 && agents.every((agent) => /derekpap\.com.*\(hello@derekpap\.com\)/.test(agent ?? "")), String(agents[0]));
  } finally {
    globalThis.fetch = originalFetch;
  }
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
    await assert.rejects(lookupBook({ ...kings, isbn: null }, { retryBaseMs: 0, budgetMs: 150 }), IncompleteLookup);
    assert.ok(Date.now() - started < 2000, `took ${Date.now() - started}ms`);
  } finally {
    clearInterval(keepAlive);
    globalThis.fetch = originalFetch;
  }
});
