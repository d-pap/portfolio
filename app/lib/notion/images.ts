/** Where a Notion image lives in Blob: its block (or page) id plus its last edit, so each version is uploaded once. */
export function blobKey(id: string, edited: string, sourceUrl: string): string {
  const extension = /\.([a-z0-9]{2,5})$/i.exec(new URL(sourceUrl).pathname)?.[1]?.toLowerCase().replace("jpeg", "jpg") ?? "img";
  return `notion/${id.replace(/-/g, "")}-${Date.parse(edited) || 0}.${extension}`;
}

/** Hosts in next.config.ts `images.remotePatterns`. Anything else renders unoptimized rather than throwing. */
export function optimizable(url: string): boolean {
  return /^https:\/\/(covers\.openlibrary\.org\/b\/|[a-z0-9]+\.public\.blob\.vercel-storage\.com\/)/.test(url);
}
