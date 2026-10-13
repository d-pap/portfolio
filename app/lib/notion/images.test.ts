import { test } from "node:test";
import assert from "node:assert/strict";
import { blobKey, optimizable } from "./images.ts";

test("keys name the block and its edit, so an edited image gets a new copy and an unchanged one never re-uploads", () => {
  assert.equal(
    blobKey("1a2b-3c4d", "2026-10-12T11:00:00.000Z", "https://prod-files-secure.s3.us-west-2.amazonaws.com/x/desk.JPG?X-Amz-Signature=abc"),
    "notion/1a2b3c4d-1791802800000.jpg",
  );
  assert.equal(blobKey("e", "2026-10-12T11:00:00.000Z", "https://example.com/pic.jpeg"), "notion/e-1791802800000.jpg");
  assert.equal(blobKey("e", "2026-10-12T11:00:00.000Z", "https://example.com/image"), "notion/e-1791802800000.img");
});

test("next/image optimizes only the hosts next.config.ts allows", () => {
  assert.equal(optimizable("https://rtjhok1asm83tuyk.public.blob.vercel-storage.com/notion/x-1.jpg"), true);
  assert.equal(optimizable("https://covers.openlibrary.org/b/id/7-L.jpg"), true);
  // A Notion link, used directly when there is no Blob token, would make next/image throw.
  assert.equal(optimizable("https://prod-files-secure.s3.us-west-2.amazonaws.com/x/desk.jpg"), false);
});
