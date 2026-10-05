export type Book = { title: string; author: string; isbn?: string; year?: number; notes?: string };

const sortKey = (title: string) => title.replace(/^(the|a|an)\s+/i, "").toLowerCase();

export function parseReading(raw: string, where = "content/reading.json"): Book[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    throw new Error(`${where}: invalid JSON (${(error as Error).message})`);
  }
  if (!Array.isArray(data)) throw new Error(`${where}: expected a list of books`);

  const books = data.map((item, i): Book => {
    const at = `${where}[${i}]`;
    if (!item || typeof item !== "object") throw new Error(`${at}: expected an object`);
    const b = item as Record<string, unknown>;
    if (typeof b.title !== "string" || !b.title.trim()) throw new Error(`${at}: "title" is required`);
    if (typeof b.author !== "string" || !b.author.trim()) throw new Error(`${at}: "author" is required`);
    let isbn: string | undefined;
    if (b.isbn !== undefined) {
      if (typeof b.isbn !== "string") throw new Error(`${at}: "isbn" must be text`);
      isbn = b.isbn.replace(/[-\s]/g, "").toUpperCase();
      if (!/^(\d{9}[\dX]|\d{13})$/.test(isbn)) throw new Error(`${at}: "isbn" must be 10 or 13 digits`);
    }
    if (b.year !== undefined && !Number.isInteger(b.year)) throw new Error(`${at}: "year" must be a whole number`);
    if (b.notes !== undefined && (typeof b.notes !== "string" || !/^[a-z0-9-]+$/.test(b.notes))) throw new Error(`${at}: "notes" must be a slug`);
    return { title: b.title.trim(), author: b.author.trim(), isbn, year: b.year as number | undefined, notes: b.notes as string | undefined };
  });

  return books.sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title)));
}

export function coverUrl(isbn: string): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
}

export function bookKey(book: Pick<Book, "title" | "author">): string {
  return `${book.title}-${book.author}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
