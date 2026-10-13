/**
 * Year, description, and cover for a book from Open Library (spec §5.4). Derek types a title and author, and an ISBN
 * only to correct a wrong match; these fill the rest. Notion overrides always win. A lookup that gave up on transient
 * errors throws IncompleteLookup carrying what it did find, so callers don't cache it.
 */
export type Lookup = { year: number | null; description: string | null; coverId: number | null };
export const NO_LOOKUP: Lookup = { year: null, description: null, coverId: null };
export class IncompleteLookup extends Error {
  readonly partial: Lookup;
  // No parameter property: Node's type stripping doesn't support them.
  constructor(partial: Lookup) {
    super("book lookup incomplete");
    this.partial = partial;
    this.name = "IncompleteLookup";
  }
}
type Book = { title: string; author: string; isbn: string | null };

export function cleanOpenLibraryDescription(text: string): string {
  return text.replace(/\r/g, "").replace(/\(\[source\][^)]*\)/g, "").replace(/\n-{3,}[\s\S]*$/, "").replace(/\n{3,}/g, "\n\n").trim();
}

const normalize = (title: string) => title.toLowerCase().split(":")[0].replace(/[^a-z0-9]+/g, " ").trim();
const surname = (author: string) => author.trim().split(/\s+/).pop()!.toLowerCase();
const isBook = (title: string | undefined, authors: string[] | undefined, book: Book) =>
  !!title && normalize(title) === normalize(book.title) && (authors ?? []).some((a) => a.toLowerCase().includes(surname(book.author)));

/** Open Library's large image for a cover id. */
export const coverSource = (coverId: number) => `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;

export function mergeBook(own: { year: number | null; description: string | null; cover: string | null }, found: Lookup) {
  const description = own.description
    ? { text: own.description, source: "notion" as const }
    : found.description ? { text: found.description, source: "open library" as const } : null;
  const cover = own.cover ?? (found.coverId ? coverSource(found.coverId) : null);
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
      const response = await fetch(url, { headers: { "User-Agent": "derekpap.com bookshelf (hello@derekpap.com)" }, signal: AbortSignal.timeout(Math.min(8000, left)) });
      if (response.ok) return { json: await response.json(), gaveUp: false };
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

type OpenLibraryWork = { key?: string; title?: string; author_name?: string[]; first_publish_year?: number; cover_i?: number };
const openLibrarySearch = (book: Book) =>
  `https://openlibrary.org/search.json?${new URLSearchParams({ title: book.title, author: surname(book.author), fields: "key,title,author_name,first_publish_year,cover_i", limit: "5" })}`;

export async function lookupBook(book: Book, { retryBaseMs = 800, budgetMs = BUDGET_MS }: { retryBaseMs?: number; budgetMs?: number } = {}): Promise<Lookup> {
  const { get, gaveUp } = catalog(retryBaseMs, budgetMs);
  let work: OpenLibraryWork | undefined = book.isbn
    ? (await get(`https://openlibrary.org/search.json?isbn=${book.isbn}&fields=key,first_publish_year,cover_i&limit=1`))?.docs?.[0]
    : undefined;
  // No ISBN, or an edition Open Library doesn't list: the work matching the title and author has the year and a cover.
  if (!work) {
    const docs: OpenLibraryWork[] = (await get(openLibrarySearch(book)))?.docs ?? [];
    work = docs.find((doc) => isBook(doc.title, doc.author_name, book));
  }
  const edition = book.isbn ? await get(`https://openlibrary.org/isbn/${book.isbn}.json`) : null;
  const workKey = edition?.works?.[0]?.key ?? work?.key;
  const details = workKey ? await get(`https://openlibrary.org${workKey}.json`) : null;
  const text = typeof details?.description === "string" ? details.description : details?.description?.value;
  const out: Lookup = {
    year: work?.first_publish_year ?? null,
    description: text ? cleanOpenLibraryDescription(text) : null,
    // The edition's own cover first: the work's cover is the same for every edition, so a typed ISBN wouldn't change it.
    coverId: edition?.covers?.find((id: number) => id > 0) ?? work?.cover_i ?? null,
  };
  if (gaveUp()) throw new IncompleteLookup(out);
  return out;
}
