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
  assert.deepEqual(blocks[1], { type: "heading", level: 2, text: [{ text: "Top heading" }], anchor: "top-heading" });
  assert.deepEqual(blocks[2], { type: "heading", level: 4, text: [{ text: "Small heading" }], anchor: "small-heading" });
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
});

test("a table keeps its rows, cell formatting and header settings", () => {
  assert.deepEqual(blocks[13], { type: "table", header: true, rowHeader: false, rows: [
    [[{ text: "Step" }], [{ text: "Time" }]],
    [[{ text: "Classify" }], [{ text: "2.4 s", bold: true }]],
  ] });
});

test("an embed reads as a link to the page it would have shown", () => {
  assert.deepEqual(blocks[14], { type: "link", href: "https://example.com/", caption: [] });
});

test("columns keep their width ratios and their own blocks", () => {
  assert.deepEqual(blocks[15], { type: "columns", columns: [
    { ratio: 0.6, children: [{ type: "paragraph", text: [{ text: "Left" }] }, { type: "heading", level: 3, text: [{ text: "Top heading" }], anchor: "top-heading-2" }] },
    { ratio: 0.4, children: [{ type: "image", id: "ci", edited: "", src: "https://example.com/col.png", caption: [] }] },
  ] });
});

test("consecutive to-dos merge into one list and keep their checked state", () => {
  assert.deepEqual(blocks[16], { type: "todo", items: [
    { text: [{ text: "Write the note" }], checked: true, children: [] },
    { text: [{ text: "Record the video" }], checked: false, children: [] },
  ] });
});

test("an equation keeps its TeX source", () => {
  assert.deepEqual(blocks[17], { type: "equation", expression: "e = mc^2" });
});

test("a table of contents lists every heading in page order, with anchors made unique", () => {
  assert.deepEqual(blocks[18], { type: "toc", items: [
    { level: 2, text: "Top heading", anchor: "top-heading" },
    { level: 4, text: "Small heading", anchor: "small-heading" },
    { level: 3, text: "Top heading", anchor: "top-heading-2" },
  ] });
});

test("a linked video file plays; other video links become links; videos uploaded to Notion are skipped", () => {
  assert.deepEqual(blocks[19], { type: "video", src: "https://media.example.com/notes/wait.mp4?v=2", caption: [{ text: "The old wait." }] });
  assert.deepEqual(blocks[20], { type: "link", href: "https://www.youtube.com/watch?v=abc", caption: [] });
});

test("an inline equation is marked as math and keeps its source", () => {
  assert.deepEqual(blocks[21], { type: "paragraph", text: [{ text: "Speed is " }, { text: "d/t", math: true }] });
  assert.equal(blocks.length, 22);
});

test("unsupported blocks are skipped by type, and everything else still converts", () => {
  assert.deepEqual(skipped, ["child_page", "video (uploaded to Notion; link a hosted file instead)", "table"]);
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
  assert.deepEqual(result.blocks, [{ type: "heading", level: 3, text: [{ text: "More" }], anchor: "more" }, { type: "paragraph", text: [{ text: "Inside." }] }]);
  assert.deepEqual(result.skipped, []);
});
