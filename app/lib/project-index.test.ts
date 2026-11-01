import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parseEntry, sortEntries } from "./entries.ts";
import { projectIndex } from "./project-index.ts";

test("the homepage lists every visible project once, using full titles and project links", () => {
  const content = path.join(process.cwd(), "content");
  const entries = fs.readdirSync(content)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => parseEntry(fs.readFileSync(path.join(content, file), "utf8"), file.slice(0, -4)));
  const { main, earlier } = sortEntries(entries);
  const rows = projectIndex(main, earlier);
  const visible = entries.filter((entry) => entry.index !== "hidden");

  assert.equal(rows.length, visible.length);
  assert.equal(new Set(rows.map((row) => row.id)).size, visible.length);
  for (const entry of visible) {
    const row = rows.find((row) => row.id === entry.slug);
    assert.ok(row, `${entry.title} is missing from the project list`);
    assert.equal(row.title, entry.title);
    assert.equal(row.href, `/work/${entry.slug}`);
    assert.ok(row.summary.trim(), `${entry.title} needs a visible description`);
    assert.match(row.period, /\d{4}/, `${entry.title} needs a project date`);
    assert.doesNotMatch(row.period, /[–—]/, `${entry.title} dates should use ordinary hyphens`);
    if (entry.context === "Personal project") {
      assert.match(row.period, /^\d{4}$/, `${entry.title} should show only its starting year`);
    }
    if (/present/i.test(row.period)) {
      assert.ok(["Michigan Medicine", "Freelance"].includes(entry.context), `${entry.title} is not ongoing job or freelance work`);
    }
    assert.notEqual(row.description, row.summary, `${entry.title} needs an expanded preview description`);
    assert.ok(row.topics.length > 0, `${entry.title} needs project topics`);
    assert.ok(row.logos.length > 0, `${entry.title} needs technology logos`);
    assert.ok(row.preview, `${entry.title} needs a thumbnail`);
    assert.ok(fs.existsSync(path.join(process.cwd(), "public", row.preview.image)), `${entry.title} thumbnail is missing`);
  }
  assert.ok(rows.some((row) => row.title === "Bank customer churn analysis"));
  assert.ok(rows.some((row) => row.title === "Gaming sentiment analysis"));
});
