import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { toBlocks, toInline, type RawBlock } from "./blocks.ts";

const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), "app/lib/notion/fixtures/blocks.json"), "utf8")) as RawBlock[];
const { blocks, skipped } = toBlocks(raw);

test("rich text keeps annotations and links; mentions lose their Notion link", () => {
  assert.deepEqual(blocks[0], { type: "paragraph", text: [
    { text: "Plain, " }, { text: "bold", bold: true }, { text: " and " },
    { text: "a link", href: "https://example.com/", italic: true }, { text: "Another page" }, { text: "git worktree", code: true },
  ] });
});

test("Notion heading levels sit one below the entry title", () => {
  assert.deepEqual(blocks[1], { type: "heading", level: 2, text: [{ text: "Top heading" }] });
  assert.deepEqual(blocks[2], { type: "heading", level: 4, text: [{ text: "Small heading" }] });
});

test("consecutive list items merge; nesting and order type are kept", () => {
  assert.deepEqual(blocks[3], { type: "list", ordered: false, items: [
    { text: [{ text: "one" }], children: [{ type: "list", ordered: false, items: [{ text: [{ text: "one-a" }], children: [] }] }] },
    { text: [{ text: "two" }], children: [] },
  ] });
  assert.deepEqual(blocks[4], { type: "list", ordered: true, items: [{ text: [{ text: "first" }], children: [] }] });
});

test("quote, callout, toggle, code, images, divider, link", () => {
  assert.deepEqual(blocks[5], { type: "quote", text: [{ text: "A quote." }], children: [] });
  assert.deepEqual(blocks[6], { type: "callout", icon: "💡", text: [{ text: "Heads up." }], children: [] });
  assert.deepEqual(blocks[7], { type: "toggle", summary: [{ text: "More" }], children: [{ type: "paragraph", text: [{ text: "Inside." }] }] });
  assert.deepEqual(blocks[8], { type: "code", language: "bash", code: "git worktree add ../x\ncd ../x", caption: [] });
  assert.deepEqual(blocks[9], { type: "image", id: "i1", edited: "2026-10-12T11:00:00.000Z", src: "https://prod-files-secure.s3.us-west-2.amazonaws.com/x/desk.jpg?X-Amz-Signature=abc", caption: [{ text: "The desk." }] });
  assert.equal((blocks[10] as { src: string }).src, "https://example.com/pic.png");
  assert.deepEqual(blocks[11], { type: "divider" });
  assert.deepEqual(blocks[12], { type: "link", href: "https://rsms.me/", caption: [{ text: "rsms" }] });
  assert.equal(blocks.length, 13);
});

test("unsupported blocks are skipped by type, and everything else still converts", () => {
  assert.deepEqual(skipped, ["table", "embed", "child_page"]);
});

test("empty rich text items are dropped", () => {
  assert.deepEqual(toInline([{ plain_text: "" }, { plain_text: "x" }]), [{ text: "x" }]);
});

test("links into Derek's Notion render as their text; public notion.site pages keep theirs", () => {
  assert.deepEqual(toInline([
    { type: "text", plain_text: "relative", href: "/3f744376cf9081a7bab9e01c8e85cd49" },
    { type: "text", plain_text: "workspace", href: "https://www.notion.so/derek/Desk-3f744376cf9081a7bab9e01c8e85cd49" },
    { type: "text", plain_text: "bare", href: "https://notion.so/3f744376cf9081a7bab9e01c8e85cd49" },
    { type: "text", plain_text: "published", href: "https://derek.notion.site/Desk-3f744376cf9081a7bab9e01c8e85cd49" },
    { type: "text", plain_text: "site", href: "https://derekpap.com/notes" },
  ]), [
    { text: "relative" }, { text: "workspace" }, { text: "bare" },
    { text: "published", href: "https://derek.notion.site/Desk-3f744376cf9081a7bab9e01c8e85cd49" },
    { text: "site", href: "https://derekpap.com/notes" },
  ]);
});

test("a toggle heading's body follows it", () => {
  const result = toBlocks([{ id: "th", type: "heading_2", has_children: true,
    heading_2: { rich_text: [{ plain_text: "More" }], is_toggleable: true },
    children: [{ id: "c", type: "paragraph", paragraph: { rich_text: [{ plain_text: "Inside." }] } }] }]);
  assert.deepEqual(result.blocks, [{ type: "heading", level: 3, text: [{ text: "More" }] }, { type: "paragraph", text: [{ text: "Inside." }] }]);
  assert.deepEqual(result.skipped, []);
});
