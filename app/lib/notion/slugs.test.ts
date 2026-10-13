import { test } from "node:test";
import assert from "node:assert/strict";
import { assignSlugs } from "./slugs.ts";

const r = (id: string, title: string, createdTime: string, slug: string | null = null) => ({ id, title, slug, createdTime });

test("slugs come from titles", () => {
  assert.deepEqual([...assignSlugs([r("a", "Git Worktrees!", "2026-01-01")])], [["a", "git-worktrees"]]);
});

test("the older of two same-titled entries keeps the plain slug", () => {
  const slugs = assignSlugs([r("new", "setup", "2026-05-01"), r("old", "setup", "2026-01-01")]);
  assert.equal(slugs.get("old"), "setup");
  assert.equal(slugs.get("new"), "setup-2");
});

test("a slug written in Notion wins and is never taken by a generated one", () => {
  const slugs = assignSlugs([r("a", "Setup", "2026-01-01"), r("b", "Anything", "2026-02-01", "setup")]);
  assert.equal(slugs.get("b"), "setup");
  assert.equal(slugs.get("a"), "setup-2");
});

test("an empty title still gets a URL", () => {
  assert.equal(assignSlugs([r("a", "!!!", "2026-01-01")]).get("a"), "untitled");
});
