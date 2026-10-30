import { slugify } from "../headings.ts";

/**
 * Where a book's cover is kept in Blob: one name per book, so a cover copied once never needs a catalog again. A typed
 * ISBN names it instead, so correcting a match brings the edition's cover.
 */
export function coverKey(book: { title: string; author: string; isbn: string | null }): string {
  return `covers/${book.isbn ?? slugify(`${book.title} ${book.author}`)}.jpg`;
}

/** Where a Notion image lives in Blob: its block (or page) id plus its last edit, so each version is uploaded once. */
export function blobKey(id: string, edited: string, sourceUrl: string): string {
  const extension = /\.([a-z0-9]{2,5})$/i.exec(new URL(sourceUrl).pathname)?.[1]?.toLowerCase().replace("jpeg", "jpg") ?? "img";
  return `notion/${id.replace(/-/g, "")}-${Date.parse(edited) || 0}.${extension}`;
}

/**
 * A Blob key's public URL, built the way the Blob SDK builds it: the store id is the fourth part of the read-write token
 * (vercel_blob_rw_<store>_<secret>). Null for a token not in that shape.
 */
export function blobUrl(key: string, token: string): string | null {
  const store = token.split("_")[3];
  return token.startsWith("vercel_blob_rw_") && store ? `https://${store.toLowerCase()}.public.blob.vercel-storage.com/${key}` : null;
}

/** Hosts in next.config.ts `images.remotePatterns`. Anything else renders unoptimized rather than throwing. */
export function optimizable(url: string): boolean {
  return /^https:\/\/(covers\.openlibrary\.org\/b\/|[a-z0-9]+\.public\.blob\.vercel-storage\.com\/)/.test(url);
}
