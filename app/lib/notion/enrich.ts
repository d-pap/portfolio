/**
 * Year, description, and cover for a book from public catalogs (spec §5.4). Derek types title, author, and ISBN; these
 * fill the rest. Notion overrides always win. Lookups never log: the Google key is in the request URL. A lookup that
 * gave up on transient errors throws IncompleteLookup carrying what it did find, so callers don't cache it.
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
type Book = { title: string; author: string; isbn: string };

const decode = (s: string) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

export function stripHtml(html: string): string {
  return decode(html.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).trim();
}

export function cleanOpenLibraryDescription(text: string): string {
  return text.replace(/\r/g, "").replace(/\(\[source\][^)]*\)/g, "").replace(/\n-{3,}[\s\S]*$/, "").replace(/\n{3,}/g, "\n\n").trim();
}

const normalize = (title: string) => title.toLowerCase().split(":")[0].replace(/[^a-z0-9]+/g, " ").trim();
const surname = (author: string) => author.trim().split(/\s+/).pop()!.toLowerCase();

export function pickGoogleMatch(items: GoogleItem[], book: Book): GoogleItem | null {
  const matches = items.filter(({ volumeInfo: v }) =>
    v?.title && normalize(v.title) === normalize(book.title) && (v.authors ?? []).some((a) => a.toLowerCase().includes(surname(book.author))));
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

// gaveUp means all attempts ended in 429, 5xx, a network error, or a timeout; a 4xx (other than 429) is a definitive answer.
async function getJson(url: string, retryBaseMs: number): Promise<Fetched> {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "derekpapierski.com bookshelf" }, signal: AbortSignal.timeout(8000) });
      if (response.ok) return { json: await response.json(), gaveUp: false };
      if (response.status !== 429 && response.status < 500) return { json: null, gaveUp: false };
    } catch {
      // Network trouble or timeout: retry like a 5xx.
    }
    if (attempt < 3) await sleep(retryBaseMs * 2 ** attempt);
  }
  return { json: null, gaveUp: true };
}

export async function lookupBook(book: Book, { retryBaseMs = 800 }: { retryBaseMs?: number } = {}): Promise<Lookup> {
  const out: Lookup = { ...NO_LOOKUP };
  let gaveUp = false;
  const get = async (url: string) => {
    const result = await getJson(url, retryBaseMs);
    gaveUp ||= result.gaveUp;
    return result.json;
  };
  const ol = await get(`https://openlibrary.org/search.json?isbn=${book.isbn}&fields=first_publish_year,cover_i&limit=1`);
  out.year = ol?.docs?.[0]?.first_publish_year ?? null;
  out.coverId = ol?.docs?.[0]?.cover_i ?? null;

  // Google's qualifiers only work beside free text (measured 2026-10-12): "<title> inauthor:<surname>".
  const key = process.env.GOOGLE_BOOKS_API_KEY?.trim();
  if (key) {
    const query = new URLSearchParams({ q: `${book.title} inauthor:${surname(book.author)}`, key, maxResults: "10", printType: "books" });
    const google = await get(`https://www.googleapis.com/books/v1/volumes?${query}`);
    const match = pickGoogleMatch(google?.items ?? [], book)?.volumeInfo;
    if (match?.description) {
      out.description = stripHtml(match.description);
      out.source = "google books";
    }
    if (!out.year && match?.publishedDate) out.year = Number(match.publishedDate.slice(0, 4)) || null;
  }

  if (!out.description) {
    const edition = await get(`https://openlibrary.org/isbn/${book.isbn}.json`);
    const workKey = edition?.works?.[0]?.key;
    const work = workKey ? await get(`https://openlibrary.org${workKey}.json`) : null;
    const text = typeof work?.description === "string" ? work.description : work?.description?.value;
    if (text) {
      out.description = cleanOpenLibraryDescription(text);
      out.source = "open library";
    }
  }
  if (gaveUp) throw new IncompleteLookup(out);
  return out;
}
