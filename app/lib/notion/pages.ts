import { BOOK_STATUSES, NOTE_CATEGORIES, type BookStatus, type NoteCategory } from "./schema.ts";
import type { BookRecord, NoteRecord } from "./model.ts";

type RichText = { plain_text: string };
type RawFile = { type: "file"; file: { url: string } } | { type: "external"; external: { url: string } };
type RawProperty = {
  type: string; title?: RichText[]; rich_text?: RichText[]; select?: { name: string } | null; checkbox?: boolean;
  date?: { start: string } | null; number?: number | null; files?: RawFile[];
};
/** The parts of a Notion page object the site reads. */
export type RawPage = { id: string; url: string; created_time: string; last_edited_time: string; properties: Record<string, RawProperty> };

export type Parsed<T> = { ok: true; record: T } | { ok: false; message: string };

export function plainText(items: RichText[] = []): string {
  return items.map((item) => item.plain_text).join("").trim();
}

const text = (page: RawPage, name: string) => plainText(page.properties[name]?.title ?? page.properties[name]?.rich_text);
const day = (page: RawPage) => page.properties.Date?.date?.start?.slice(0, 10) ?? null;
const slug = (page: RawPage) => text(page, "Slug") || null;

function cover(page: RawPage): string | null {
  const first = page.properties.Cover?.files?.[0];
  if (!first) return null;
  return first.type === "file" ? first.file.url : first.external.url;
}

function fail(database: string, page: RawPage, problems: string[]): { ok: false; message: string } {
  const title = text(page, "Title") || "Untitled";
  return { ok: false, message: `[notion] ${database} "${title}" (${page.url}): ${problems.join("; ")}` };
}

export function parseBookPage(page: RawPage): Parsed<BookRecord> {
  const problems: string[] = [];
  const title = text(page, "Title");
  const author = text(page, "Author");
  const statusName = page.properties.Status?.select?.name;
  const isbnRaw = text(page, "ISBN");
  const isbn = isbnRaw ? isbnRaw.replace(/[-\s]/g, "").toUpperCase() : null;
  if (!title) problems.push("Title is empty");
  if (!author) problems.push("Author is empty");
  if (!statusName) problems.push("Status is not set");
  else if (!BOOK_STATUSES.includes(statusName as BookStatus)) problems.push(`Status "${statusName}" is not one of ${BOOK_STATUSES.join(", ")}`);
  if (isbn && !/^(\d{9}[\dX]|\d{13})$/.test(isbn)) problems.push(`ISBN "${isbnRaw}" must be 10 or 13 digits`);
  if (problems.length) return fail("Books", page, problems);
  const year = page.properties.Year?.number;
  return {
    ok: true,
    record: {
      id: page.id, url: page.url, title, author, isbn, status: statusName as BookStatus, date: day(page),
      createdTime: page.created_time, lastEditedTime: page.last_edited_time,
      year: Number.isInteger(year) ? (year as number) : null, description: text(page, "Description") || null,
      cover: cover(page), slug: slug(page),
    },
  };
}

export function parseNotePage(page: RawPage): Parsed<NoteRecord> {
  const problems: string[] = [];
  const title = text(page, "Title");
  const categoryName = page.properties.Category?.select?.name ?? null;
  if (!title) problems.push("Title is empty");
  if (categoryName && !NOTE_CATEGORIES.includes(categoryName as NoteCategory)) problems.push(`Category "${categoryName}" is not one of ${NOTE_CATEGORIES.join(", ")}`);
  if (problems.length) return fail("Notes", page, problems);
  return {
    ok: true,
    record: {
      id: page.id, url: page.url, title, category: categoryName as NoteCategory | null, date: day(page),
      createdTime: page.created_time, lastEditedTime: page.last_edited_time, slug: slug(page),
    },
  };
}
