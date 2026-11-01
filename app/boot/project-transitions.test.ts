import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const context = vm.createContext({ URL });
vm.runInContext(fs.readFileSync(new URL("./project-transitions.js", import.meta.url), "utf8"), context);
const route = (from: string, to: string) => {
  const result = context.__projectTransitions.route(from, to);
  return result ? JSON.parse(JSON.stringify(result)) : null;
};

test("shared media connects home with a project's opening, including history traversal", () => {
  assert.deepEqual(route("https://example.com/#projects", "https://example.com/work/renew?review=motion"), { direction: "open", slug: "renew" });
  assert.deepEqual(route("https://example.com/work/codecoach/", "https://example.com/#projects"), { direction: "close", slug: "codecoach" });
});

test("section jumps, other rooms, and external destinations don't take the hero transition", () => {
  for (const [from, to] of [
    ["https://example.com/", "https://example.com/work/renew#backend"],
    ["https://example.com/work/renew", "https://example.com/work/sprout"],
    ["https://example.com/notes", "https://example.com/work/renew"],
    ["https://example.com/", "https://other.com/work/renew"],
    ["invalid", "https://example.com/work/renew"],
  ]) assert.equal(route(from, to), null);
});
