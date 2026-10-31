import { test } from "node:test";
import assert from "node:assert/strict";
import { highlight, highlightCode, shikiLanguage } from "./highlight.ts";
import type { Block } from "./blocks.ts";

test("Notion's language names map to Shiki's, and unknown ones fall back to plain text", () => {
  assert.equal(shikiLanguage("bash"), "bash");
  assert.equal(shikiLanguage("Python"), "python");
  assert.equal(shikiLanguage("plain text"), "text");
  assert.equal(shikiLanguage("c++"), "cpp");
  assert.equal(shikiLanguage("objective-c"), "objective-c");
  assert.equal(shikiLanguage("shell"), "shellscript");
  assert.equal(shikiLanguage("not a language"), "text");
});

test("highlighted code colors its tokens and leaves the block's fill to the reader", async () => {
  const html = await highlight('ipsw class-dump "$SB" # headers', "bash");
  assert.match(html, /^<pre class="shiki github-light"><code>/);
  assert.match(html, /style="color:#[0-9A-F]{6}"/i);
  assert.doesNotMatch(html, /<pre[^>]*style=/);
  assert.doesNotMatch(html, /tabindex/);
});

test("source text is escaped", async () => {
  assert.match(await highlight("<b>&</b>", "plain text"), /&#x3C;b>&#x26;&#x3C;\/b>|&lt;b&gt;&amp;&lt;\/b&gt;/);
});

test("code blocks are highlighted wherever they sit, and other blocks pass through", async () => {
  const code: Block = { type: "code", language: "python", code: "x = 1", caption: [] };
  const [toggle, paragraph] = await highlightCode([
    { type: "toggle", summary: [{ text: "Commands" }], children: [code] },
    { type: "paragraph", text: [{ text: "plain" }] },
  ]);
  assert.equal(toggle.type, "toggle");
  const inner = (toggle as { children: Block[] }).children[0] as { html?: string };
  assert.match(inner.html ?? "", /class="shiki/);
  assert.deepEqual(paragraph, { type: "paragraph", text: [{ text: "plain" }] });
});
