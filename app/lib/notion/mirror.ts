import { BlobNotFoundError, head, put } from "@vercel/blob";
import { blobKey, blobUrl } from "./images.ts";

export type Mirrored = { url: string; width: number | null; height: number | null };
type Size = { width: number | null; height: number | null };
const UNKNOWN: Size = { width: null, height: null };
let warned = false;

type File = { bytes: Buffer; type: string | null };

/** The file, null when the host answers 4xx (a dead link, permanent), or a throw for a network error, timeout, or 5xx. */
async function download(url: string): Promise<File | null> {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (response.ok) return { bytes: Buffer.from(await response.arrayBuffer()), type: response.headers.get("content-type") };
  if (response.status >= 400 && response.status < 500) return null;
  throw new Error(`image host answered ${response.status}`);
}

/** Like download, but any failure is just null: for the no-token branch, where the original link is used regardless. */
async function tryDownload(url: string): Promise<File | null> {
  try {
    return await download(url);
  } catch {
    return null;
  }
}

/**
 * The copy already in Blob under `key`, or null when there is none. It is read through its public URL, which Blob's CDN
 * answers without a metered operation; `head` counts as one every time, and the hourly refresh asked once per image.
 * Throws on anything that may pass.
 */
async function findCopy(key: string): Promise<{ url: string; file: File | null } | null> {
  const url = blobUrl(key, process.env.BLOB_READ_WRITE_TOKEN ?? "");
  if (url) {
    const file = await download(url);
    return file ? { url, file } : null;
  }
  try {
    return { url: (await head(key)).url, file: null };
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

/** The image's pixel size as shown, so the page reserves its space before it loads. */
async function measure(bytes: Buffer): Promise<Size> {
  try {
    // Loaded only when an image is measured: rooms.ts imports this module, and the back plane imports rooms.ts on
    // every front page.
    const { default: sharp } = await import("sharp");
    const { width, height, orientation } = await sharp(bytes).metadata();
    if (!width || !height) return UNKNOWN;
    // EXIF orientations 5 to 8 turn the image a quarter (a phone photo held upright), so it shows height by width.
    return orientation && orientation >= 5 ? { width: height, height: width } : { width, height };
  } catch {
    return UNKNOWN;
  }
}

/**
 * A permanent URL for a Notion image, and its size. Notion's own file links expire after about an hour, so each image
 * is copied to Blob once (spec §5.5); `head` finds one already copied. Without a Blob token (local, no store) the
 * original link is used and that is said once. With a Blob store, a failure that may pass throws so the caller's cache
 * keeps the last good page; a source that answers 4xx keeps its own link. Errors carry the image id, never a URL.
 */
export async function mirror(sourceUrl: string, id: string, edited: string): Promise<Mirrored> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    if (!warned) {
      warned = true;
      console.warn("[notion] BLOB_READ_WRITE_TOKEN is not set; using Notion's own image links, which expire after about an hour");
    }
    const file = await tryDownload(sourceUrl);
    return { url: sourceUrl, ...(file ? await measure(file.bytes) : UNKNOWN) };
  }
  const key = blobKey(id, edited, sourceUrl);
  let copied: Awaited<ReturnType<typeof findCopy>>;
  try {
    copied = await findCopy(key);
  } catch (error) {
    throw new Error(`[notion] could not copy image ${id} to Blob`, { cause: error });
  }
  if (copied) {
    // The copy exists; only its size is unknown if it couldn't be read.
    const file = copied.file ?? (await tryDownload(copied.url));
    return { url: copied.url, ...(file ? await measure(file.bytes) : UNKNOWN) };
  }
  try {
    const file = await download(sourceUrl);
    if (!file) return { url: sourceUrl, ...UNKNOWN };
    const size = await measure(file.bytes);
    const blob = await put(key, file.bytes, {
      access: "public", addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 31536000,
      contentType: file.type ?? undefined,
    });
    return { url: blob.url, ...size };
  } catch (error) {
    throw new Error(`[notion] could not copy image ${id} to Blob`, { cause: error });
  }
}

/**
 * A book cover's permanent URL: the copy already in Blob under `key`, else `sourceUrl` copied there. Null when there is
 * no copy yet and no source, or the source answers 4xx. Throws on anything that may pass.
 */
export async function keepCover(key: string, sourceUrl: string | null): Promise<string | null> {
  let copied: Awaited<ReturnType<typeof findCopy>>;
  try {
    copied = await findCopy(key);
  } catch (error) {
    throw new Error(`[notion] could not check ${key} in Blob`, { cause: error });
  }
  if (copied) return copied.url;
  if (!sourceUrl) return null;
  const file = await download(sourceUrl);
  if (!file) return null;
  const blob = await put(key, file.bytes, {
    access: "public", addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 31536000,
    contentType: file.type ?? "image/jpeg",
  });
  return blob.url;
}
