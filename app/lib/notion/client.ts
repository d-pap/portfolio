import { Client } from "@notionhq/client";
import { NOTION_VERSION } from "./schema.ts";

/** The token and data sources, or null when any is missing (then the site builds from content/reading.json). */
export function notionConfig(): { token: string; booksDataSource: string; notesDataSource: string } | null {
  const token = process.env.NOTION_TOKEN?.trim();
  const booksDataSource = process.env.NOTION_BOOKS_DATA_SOURCE_ID?.trim();
  const notesDataSource = process.env.NOTION_NOTES_DATA_SOURCE_ID?.trim();
  return token && booksDataSource && notesDataSource ? { token, booksDataSource, notesDataSource } : null;
}

let client: Client | null = null;

/** The SDK retries 429, 529, and (for reads) 500/503 with backoff; pages are read one at a time. */
export function notion(token: string): Client {
  return (client ??= new Client({ auth: token, notionVersion: NOTION_VERSION, retry: { maxRetries: 4 } }));
}
