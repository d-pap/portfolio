import { BOOK_STATUSES, type BookStatus } from "./schema.ts";

const sortKey = (title: string) => title.replace(/^(the|a|an)\s+/i, "").toLowerCase();
const when = (date: string | null, createdTime: string) => (date ? `${date}T00:00:00.000Z` : createdTime);

/** Reading, then read, then other; newest first by Date (else creation); then title, ignoring a leading article. */
export function orderBooks<T extends { status: BookStatus; date: string | null; createdTime: string; title: string }>(books: T[]): T[] {
  return [...books].sort((a, b) =>
    BOOK_STATUSES.indexOf(a.status) - BOOK_STATUSES.indexOf(b.status) ||
    when(b.date, b.createdTime).localeCompare(when(a.date, a.createdTime)) ||
    sortKey(a.title).localeCompare(sortKey(b.title)));
}

/** Newest first by Date (else creation), then title. */
export function orderNotes<T extends { date: string | null; createdTime: string; title: string }>(notes: T[]): T[] {
  return [...notes].sort((a, b) =>
    when(b.date, b.createdTime).localeCompare(when(a.date, a.createdTime)) || sortKey(a.title).localeCompare(sortKey(b.title)));
}

/** "all", then each canonical value that at least one entry has. */
export function filtersFor(values: readonly (string | null)[], canonical: readonly string[]): string[] {
  return ["all", ...canonical.filter((value) => values.includes(value))];
}

export function formatDate(isoDate: string): string {
  return new Date(`${isoDate.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function bookSub(book: { author: string; year: number | null }): string {
  return book.year ? `${book.author}, ${book.year}` : book.author;
}
