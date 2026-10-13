import { unstable_cache } from "next/cache";
import { getReading } from "app/lib/content";
import { notionConfig } from "./client";
import { queryPublished, readBlocks } from "./source";
import { parseBookPage, parseNotePage, type Parsed } from "./pages";
import { assignSlugs } from "./slugs";
import { orderBooks, orderNotes } from "./order";
import { IncompleteLookup, coverSource, lookupBook, mergeBook, type Lookup } from "./enrich";
import { keepCover, mirror } from "./mirror";
import { coverKey } from "./images";
import { toBlocks, type Block } from "./blocks";
import { fallbackBooks } from "./fallback";
import type { BookEntry, NoteEntry } from "./model";

// Spec §5.6: every read is cached and tagged; the webhook refreshes tags, and an hour is the safety net. A read that
// throws is never cached, so a Notion outage keeps the last good page up. Errors from mirror() are left to throw for
// the same reason; they are never logged with their cause, which can hold a signed URL.
const HOUR = 3600;
const MONTH = 60 * 60 * 24 * 30;
let saidFallback = false;

function valid<T>(results: Parsed<T>[]): T[] {
  const records: T[] = [];
  for (const result of results) {
    if (result.ok) records.push(result.record);
    else console.warn(result.message);
  }
  return records;
}

function fallback(): BookEntry[] {
  if (!saidFallback) {
    saidFallback = true;
    console.warn("[notion] NOTION_TOKEN not set; using content/reading.json");
  }
  return fallbackBooks(getReading());
}

type Named = { title: string; author: string; isbn: string | null };

// A build renders every page at once and every page loads every book, so cache misses arrive together. They share the
// work still in flight: Open Library sees one request per book, not one per page (it allows us 3 a second).
const inFlight = new Map<string, Promise<unknown>>();
function shared<T>(key: string, run: () => Promise<T>): Promise<T> {
  let pending = inFlight.get(key) as Promise<T> | undefined;
  if (!pending) {
    pending = run().finally(() => inFlight.delete(key));
    inFlight.set(key, pending);
  }
  return pending;
}

// Spec §5.4: a book is looked up by its title and author, or by an ISBN typed to correct the match, and kept 30 days. All
// three are in the key, so a fix in Notion gets a fresh lookup. A lookup that gave up on a passing failure throws, so it
// isn't kept; this render uses what it did find. Never call this inside another unstable_cache: Next 15.1 skips reading
// a nested one, so every call would go to the catalog.
async function lookup({ title, author, isbn }: Named): Promise<Lookup> {
  try {
    return await unstable_cache(() => shared(`lookup:${isbn}:${title}:${author}`, () => lookupBook({ title, author, isbn })), ["book-lookup-v5", isbn ?? "", title, author], { revalidate: MONTH })();
  } catch (error) {
    if (error instanceof IncompleteLookup) return error.partial;
    throw error;
  }
}

class NoCover extends Error {}

// A cover found once is copied to Blob under the book's own name and kept for good, so it never needs Open Library, its
// slow cover server, or the lookup cache again. Until a copy exists (no Blob token locally, a failed copy, nothing found
// yet) the cover comes straight from Open Library and the next render tries again.
async function cover(book: Named, coverId: number | null): Promise<string | null> {
  const source = coverId ? coverSource(coverId) : null;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return source;
  const key = coverKey(book);
  try {
    return await unstable_cache(async () => {
      const kept = await shared(`cover:${key}`, () => keepCover(key, source));
      if (!kept) throw new NoCover();
      return kept;
    }, ["book-cover-v1", key], { revalidate: false })();
  } catch (error) {
    if (!(error instanceof NoCover)) console.warn(`[notion] could not keep the cover for ${book.title}; using Open Library's`);
    return source;
  }
}

/** A book from the list before its lookup. `own` is what Notion gives (the cover mirrored), which wins over the lookup. */
type ListedBook = Omit<BookEntry, "year" | "description" | "cover"> & { own: { year: number | null; description: string | null; cover: string | null } };

// The hourly list: validated, slugged, covers mirrored, in order. Lookups stay out of it (see lookup).
const listBooks = unstable_cache(async (): Promise<ListedBook[]> => {
  const config = notionConfig();
  if (!config) return [];
  const records = valid((await queryPublished(config.token, config.booksDataSource)).map(parseBookPage));
  const slugs = assignSlugs(records);
  const books: ListedBook[] = [];
  for (const record of records) {
    const cover = record.cover ? (await mirror(record.cover, record.id, record.lastEditedTime)).url : null;
    books.push({
      id: record.id, slug: slugs.get(record.id)!, title: record.title, author: record.author, isbn: record.isbn,
      status: record.status, date: record.date, createdTime: record.createdTime, lastEditedTime: record.lastEditedTime,
      own: { year: record.year, description: record.description, cover },
    });
  }
  return orderBooks(books);
}, ["notion-books-v2"], { tags: ["notion", "notion:books"], revalidate: HOUR });

/** The bookshelf: the hourly list, each book filled in from its own 30-day lookup, its cover from Blob once kept. */
export async function loadBooks(): Promise<BookEntry[]> {
  if (!notionConfig()) return fallback();
  const books = await listBooks();
  return Promise.all(books.map(async ({ own, ...book }) => {
    const found = await lookup(book);
    return { ...book, ...mergeBook({ ...own, cover: own.cover ?? (await cover(book, found.coverId)) }, found) };
  }));
}

export const loadNotes = unstable_cache(async (): Promise<NoteEntry[]> => {
  const config = notionConfig();
  if (!config) return [];
  const records = valid((await queryPublished(config.token, config.notesDataSource)).map(parseNotePage));
  const slugs = assignSlugs(records);
  // Ordered while an undated note's date is still empty, so it sorts by its creation time; then it shows that day.
  return orderNotes(records).map((record) => ({
    id: record.id, slug: slugs.get(record.id)!, title: record.title, category: record.category,
    date: record.date ?? record.createdTime.slice(0, 10), createdTime: record.createdTime, lastEditedTime: record.lastEditedTime,
  }));
}, ["notion-notes-v1"], { tags: ["notion", "notion:notes"], revalidate: HOUR });

async function mirrorImages(blocks: Block[]): Promise<Block[]> {
  const out: Block[] = [];
  for (const block of blocks) {
    if (block.type === "image") {
      const { url, width, height } = await mirror(block.src, block.id, block.edited);
      out.push({ ...block, src: url, ...(width && height ? { width, height } : {}) });
    }
    else if (block.type === "list") out.push({ ...block, items: await Promise.all(block.items.map(async (item) => ({ ...item, children: await mirrorImages(item.children) }))) });
    else if ("children" in block) out.push({ ...block, children: await mirrorImages(block.children) });
    else out.push(block);
  }
  return out;
}

/** A page's body. Keyed by its last edit too, so an edit is a new entry even before a tag refresh. */
export function loadBody(pageId: string, lastEditedTime: string): Promise<Block[]> {
  return unstable_cache(async () => {
    const config = notionConfig();
    if (!config) return [];
    const { blocks, skipped } = toBlocks(await readBlocks(config.token, pageId));
    if (skipped.length) console.warn(`[notion] page ${pageId}: skipped unsupported blocks (${[...new Set(skipped)].join(", ")})`);
    return mirrorImages(blocks);
  }, ["notion-body-v1", pageId, lastEditedTime], { tags: ["notion", `notion:page:${pageId}`], revalidate: HOUR })();
}

export async function roomsContent(): Promise<{ books: boolean; notes: boolean; latestEdit: string | null }> {
  const [books, notes] = await Promise.all([loadBooks(), loadNotes()]);
  const edits = [...books, ...notes].map((entry) => entry.lastEditedTime).filter((t) => !t.startsWith("1970")).sort();
  return { books: books.length > 0, notes: notes.length > 0, latestEdit: edits.length ? edits[edits.length - 1] : null };
}
