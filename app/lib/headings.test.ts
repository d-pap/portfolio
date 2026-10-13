import { test } from "node:test";
import assert from "node:assert/strict";
import { listHeadings, slugify } from "./headings.ts";

test("slugify lowercases and joins words with hyphens", () => {
  assert.equal(slugify("rag pipeline"), "rag-pipeline");
  assert.equal(slugify("Long-Term Memory"), "long-term-memory");
  assert.equal(slugify("  the workspace!  "), "the-workspace");
  assert.equal(slugify("RENEW: v2 / platform"), "renew-v2-platform");
});

test("listHeadings returns level-two headings in order", () => {
  const body = "Lede.\n\n## system design\n\nText.\n\n### detail\n\n## rag pipeline\n\n## long-term memory ##\n";
  assert.deepEqual(listHeadings(body), [
    { id: "system-design", text: "system design" },
    { id: "rag-pipeline", text: "rag pipeline" },
    { id: "long-term-memory", text: "long-term memory" },
  ]);
});

test("listHeadings skips fenced code and strips inline markdown", () => {
  const body = "## **brand** identity\n\n```md\n## not a heading\n```\n\n## `evals`\n";
  assert.deepEqual(listHeadings(body), [
    { id: "brand-identity", text: "brand identity" },
    { id: "evals", text: "evals" },
  ]);
});
