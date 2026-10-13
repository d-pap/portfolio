import type { MetadataRoute } from "next";
import { getEntries } from "./lib/content";
import { laterDate, lastUpdated } from "./lib/updated";
import { loadBooks, loadNotes, roomsContent } from "./lib/notion/rooms";
import { metaData } from "./config";

const base = metaData.baseUrl.endsWith("/") ? metaData.baseUrl : `${metaData.baseUrl}/`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [books, notes, content] = await Promise.all([loadBooks(), loadNotes(), roomsContent()]);
  const updated = laterDate(lastUpdated(), content.latestEdit) ?? new Date().toISOString().slice(0, 10);
  const work = getEntries()
    .filter((entry) => entry.index !== "hidden")
    .map((entry) => ({ url: `${base}work/${entry.slug}`, lastModified: entry.publishedAt }));
  const rooms = [
    ...(books.length ? [{ url: `${base}bookshelf`, lastModified: updated }] : []),
    ...books.map((book) => ({ url: `${base}bookshelf/${book.slug}`, lastModified: book.lastEditedTime.slice(0, 10) })),
    ...(notes.length ? [{ url: `${base}notes`, lastModified: updated }] : []),
    ...notes.map((note) => ({ url: `${base}notes/${note.slug}`, lastModified: note.lastEditedTime.slice(0, 10) })),
  ];
  return [{ url: base, lastModified: updated }, ...work, ...rooms];
}
