import { slugify } from "../headings.ts";
import type { Book } from "../reading.ts";
import type { BookEntry } from "./model.ts";

const EPOCH = "1970-01-01T00:00:00.000Z";

/** Builds without Notion secrets (fresh clones, previews) still have a bookshelf: content/reading.json, all read. */
export function fallbackBooks(books: Book[]): BookEntry[] {
  return books.map((book) => ({
    id: `fallback-${slugify(book.title)}`, slug: slugify(book.title), title: book.title, author: book.author,
    isbn: book.isbn ?? null, status: "read", date: null, createdTime: EPOCH, lastEditedTime: EPOCH,
    year: book.year ?? null, cover: book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg` : null, description: null,
  }));
}
