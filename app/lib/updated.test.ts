import { test } from "node:test";
import assert from "node:assert/strict";
import { lastUpdated, parseCommitDate } from "./updated.ts";

test("reads git's short commit date", () => {
  assert.equal(parseCommitDate("2026-10-08\n"), "2026-10-08");
  assert.equal(parseCommitDate("  2026-01-31  "), "2026-01-31");
});

test("rejects empty or unexpected output", () => {
  assert.equal(parseCommitDate(""), null);
  assert.equal(parseCommitDate("fatal: not a git repository"), null);
  assert.equal(parseCommitDate("Oct 8 2026"), null);
  assert.equal(parseCommitDate("2026-13-01"), null);
  assert.equal(parseCommitDate("2026-10-08\n2026-10-07"), null);
});

test("in this repository the last change is a date", () => {
  const value = lastUpdated();
  assert.ok(value === null || /^\d{4}-\d{2}-\d{2}$/.test(value), String(value));
});
