/**
 * Year, description, and cover for a book from public catalogs (spec §5.4). Derek types a title and author, and an ISBN
 * only to correct a wrong match; these fill the rest. Notion overrides always win. Lookups never log: the Google key is
 * in the request URL. A lookup that gave up on transient errors throws IncompleteLookup carrying what it did find, so
 * callers don't cache it.
 */
export type Lookup = { year: number | null; description: string | null; source: "google books" | "open library" | null; coverId: number | null };
export const NO_LOOKUP: Lookup = { year: null, description: null, source: null, coverId: null };
type GoogleItem = { volumeInfo?: { title?: string; authors?: string[]; description?: string; publishedDate?: string; industryIdentifiers?: { identifier: string }[] } };
export class IncompleteLookup extends Error {
  readonly partial: Lookup;
  // No parameter property: Node's type stripping doesn't support them.
  constructor(partial: Lookup) {
    super("book lookup incomplete");
    this.partial = partial;
    this.name = "IncompleteLookup";
  }
}
type Named = { title: string; author: string };
type Book = Named & { isbn: string };

const decode = (s: string) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

export function stripHtml(html: string): string {
  return decode(html.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).trim();
}

export function cleanOpenLibraryDescription(text: string): string {
  return text.replace(/\r/g, "").replace(/\(\[source\][^)]*\)/g, "").replace(/\n-{3,}[\s\S]*$/, "").replace(/\n{3,}/g, "\n\n").trim();
}

/** Google often wraps a publisher's blurb in quotes and signs it off with "--Publisher's description." */
export function cleanGoogleDescription(text: string): string {
  const unsigned = text.replace(/\s*-{2,}\s*Publisher['’]s description\.?\s*$/i, "").trim();
  const quoted = /^["“]([\s\S]*)["”]$/.exec(unsigned);
  return quoted && !/["“”]/.test(quoted[1]) ? quoted[1].trim() : unsigned;
}

const normalize = (title: string) => title.toLowerCase().split(":")[0].replace(/[^a-z0-9]+/g, " ").trim();
const surname = (author: string) => author.trim().split(/\s+/).pop()!.toLowerCase();
const isBook = (title: string | undefined, authors: string[] | undefined, book: Named) =>
  !!title && normalize(title) === normalize(book.title) && (authors ?? []).some((a) => a.toLowerCase().includes(surname(book.author)));

/** The ISBN-13 if there is one, else the ISBN-10. Anything else a catalog lists (library IDs, typos) is skipped. */
function bestIsbn(identifiers: string[]): string | null {
  const isbns = identifiers.map((id) => id.replace(/[-\s]/g, "").toUpperCase()).filter((id) => /^(\d{9}[\dX]|\d{13})$/.test(id));
  return isbns.find((id) => id.length === 13) ?? isbns[0] ?? null;
}
const googleIsbn = (item: GoogleItem) => bestIsbn(item.volumeInfo?.industryIdentifiers?.map((id) => id.identifier) ?? []);

export function pickGoogleMatch(items: GoogleItem[], book: Book): GoogleItem | null {
  const matches = items.filter(({ volumeInfo: v }) => isBook(v?.title, v?.authors, book));
  const byIsbn = matches.find((m) => m.volumeInfo?.industryIdentifiers?.some((id) => id.identifier === book.isbn));
  return byIsbn ?? matches.find((m) => m.volumeInfo?.description) ?? matches[0] ?? null;
}

export function mergeBook(own: { year: number | null; description: string | null; cover: string | null }, found: Lookup) {
  const description = own.description
    ? { text: own.description, source: "notion" as const }
    : found.description && found.source ? { text: found.description, source: found.source } : null;
  const cover = own.cover ?? (found.coverId ? `https://covers.openlibrary.org/b/id/${found.coverId}-L.jpg` : null);
  return { year: own.year ?? found.year, description, cover };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Fetched = { json: any | null; gaveUp: boolean };

// gaveUp means all attempts ended in 429, 5xx, a network error, or a timeout, or the lookup's time ran out; a 4xx (other
// than 429) is a definitive answer.
async function getJson(url: string, retryBaseMs: number, deadline: number): Promise<Fetched> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const left = deadline - Date.now();
    if (left <= 0) break;
    try {
      const response = await fetch(url, { headers: { "User-Agent": "derekpap.com bookshelf" }, signal: AbortSignal.timeout(Math.min(8000, left)) });
      if (response.ok) return { json: await response.json(), gaveUp: false };
      // A daily quota won't clear in seconds. Give up now: the lookup isn't kept, so a later render tries again.
      if (response.status === 429 && /per day/i.test(await response.text())) return { json: null, gaveUp: true };
      if (response.status !== 429 && response.status < 500) return { json: null, gaveUp: false };
    } catch {
      // Network trouble or timeout: retry like a 5xx.
    }
    if (attempt < 3) await sleep(Math.min(retryBaseMs * 2 ** attempt, Math.max(0, deadline - Date.now())));
  }
  return { json: null, gaveUp: true };
}

// A whole lookup's time, so a slow or failing catalog can't hold a page past the build's 60-second limit. Every page
// loads every book (and a book page does it twice, for its metadata and its body), so this stays well under it.
const BUDGET_MS = 10_000;

/** One lookup's requests, sharing one time budget and remembering whether any of them gave up. */
function catalog(retryBaseMs: number, budgetMs: number) {
  const deadline = Date.now() + budgetMs;
  let gaveUp = false;
  return {
    get: async (url: string) => {
      const result = await getJson(url, retryBaseMs, deadline);
      gaveUp ||= result.gaveUp;
      return result.json;
    },
    gaveUp: () => gaveUp,
  };
}

// Google's qualifiers only work beside free text (measured 2026-10-12): "<title> inauthor:<surname>".
function googleSearch(book: Named, key: string): string {
  const query = new URLSearchParams({ q: `${book.title} inauthor:${surname(book.author)}`, key, maxResults: "10", printType: "books" });
  return `https://www.googleapis.com/books/v1/volumes?${query}`;
}

type OpenLibraryWork = { title?: string; author_name?: string[]; first_publish_year?: number; cover_i?: number; editions?: { docs?: { isbn?: string[] }[] } };
const openLibrarySearch = (book: Named, fields: string) =>
  `https://openlibrary.org/search.json?${new URLSearchParams({ title: book.title, author: surname(book.author), fields, limit: "5" })}`;

export async function lookupBook(book: Book, { retryBaseMs = 800, budgetMs = BUDGET_MS }: { retryBaseMs?: number; budgetMs?: number } = {}): Promise<Lookup> {
  const out: Lookup = { ...NO_LOOKUP };
  const { get, gaveUp } = catalog(retryBaseMs, budgetMs);
  let work: OpenLibraryWork | undefined = (await get(`https://openlibrary.org/search.json?isbn=${book.isbn}&fields=first_publish_year,cover_i&limit=1`))?.docs?.[0];
  // An edition Open Library doesn't list (often one Google picked): the matching work still has the year and a cover.
  if (!work) {
    const docs: OpenLibraryWork[] = (await get(openLibrarySearch(book, "title,author_name,first_publish_year,cover_i")))?.docs ?? [];
    work = docs.find((doc) => isBook(doc.title, doc.author_name, book));
  }
  const edition = await get(`https://openlibrary.org/isbn/${book.isbn}.json`);
  out.year = work?.first_publish_year ?? null;
  // The edition's own cover first: the work's cover is the same for every edition, so a corrected ISBN wouldn't change it.
  out.coverId = edition?.covers?.find((id: number) => id > 0) ?? work?.cover_i ?? null;

  const key = process.env.GOOGLE_BOOKS_API_KEY?.trim();
  if (key) {
    const google = await get(googleSearch(book, key));
    const match = pickGoogleMatch(google?.items ?? [], book)?.volumeInfo;
    if (match?.description) {
      out.description = cleanGoogleDescription(stripHtml(match.description));
      out.source = "google books";
    }
    if (!out.year && match?.publishedDate) out.year = Number(match.publishedDate.slice(0, 4)) || null;
  }

  if (!out.description) {
    const workKey = edition?.works?.[0]?.key;
    const work = workKey ? await get(`https://openlibrary.org${workKey}.json`) : null;
    const text = typeof work?.description === "string" ? work.description : work?.description?.value;
    if (text) {
      out.description = cleanOpenLibraryDescription(text);
      out.source = "open library";
    }
  }
  if (gaveUp()) throw new IncompleteLookup(out);
  return out;
}

/**
 * The ISBN for a title and author: Google's match with an ISBN (one with a description first), else the edition Open
 * Library ranks first for the matching work. Null when neither has one. Throws IncompleteLookup when a catalog gave up,
 * so a passing Google failure never settles the match on Open Library's pick.
 */
export async function resolveIsbn(book: Named, { retryBaseMs = 800, budgetMs = BUDGET_MS }: { retryBaseMs?: number; budgetMs?: number } = {}): Promise<string | null> {
  const { get, gaveUp } = catalog(retryBaseMs, budgetMs);
  const key = process.env.GOOGLE_BOOKS_API_KEY?.trim();
  if (key) {
    const items: GoogleItem[] = (await get(googleSearch(book, key)))?.items ?? [];
    const withIsbn = items.filter((item) => isBook(item.volumeInfo?.title, item.volumeInfo?.authors, book) && googleIsbn(item));
    const pick = withIsbn.find((item) => item.volumeInfo?.description) ?? withIsbn[0];
    if (pick) return googleIsbn(pick);
    if (gaveUp()) throw new IncompleteLookup(NO_LOOKUP);
  }
  const docs: OpenLibraryWork[] = (await get(openLibrarySearch(book, "title,author_name,editions,editions.isbn")))?.docs ?? [];
  const work = docs.find((doc) => isBook(doc.title, doc.author_name, book));
  const isbn = bestIsbn(work?.editions?.docs?.[0]?.isbn ?? []);
  if (isbn) return isbn;
  if (gaveUp()) throw new IncompleteLookup(NO_LOOKUP);
  return null;
}
