import { test } from "node:test";
import assert from "node:assert/strict";
import { signWebhookPayload } from "@notionhq/client";
import { isTrusted, readWebhook, tagsForEvent, wantsSlug } from "./webhook.ts";

const body = JSON.stringify({ type: "page.content_updated", entity: { id: "p1", type: "page" } });

test("a request signed with the secret is trusted", async () => {
  const signature = await signWebhookPayload({ body, verificationToken: "test_secret" });
  assert.equal(await isTrusted(body, signature, "test_secret"), true);
});

test("a tampered body, a wrong secret, or a missing signature or secret is not", async () => {
  const signature = await signWebhookPayload({ body, verificationToken: "test_secret" });
  assert.equal(await isTrusted(body.replace("p1", "p2"), signature, "test_secret"), false);
  assert.equal(await isTrusted(body, signature, "other_secret"), false);
  assert.equal(await isTrusted(body, null, "test_secret"), false);
  assert.equal(await isTrusted(body, signature, undefined), false);
  assert.equal(await isTrusted(body, signature, ""), false);
});

test("Notion's one-time handshake carries a verification token", () => {
  assert.deepEqual(readWebhook(JSON.stringify({ verification_token: "secret_abc" })), { kind: "verification", token: "secret_abc" });
});

test("an event names its type and entity", () => {
  assert.deepEqual(readWebhook(JSON.stringify({ type: "page.content_updated", entity: { id: "p1", type: "page" } })), {
    kind: "event", type: "page.content_updated", entityId: "p1",
  });
});

test("anything else is invalid", () => {
  assert.deepEqual(readWebhook("not json"), { kind: "invalid" });
  assert.deepEqual(readWebhook(JSON.stringify({ hello: 1 })), { kind: "invalid" });
});

test("page events refresh the page and both lists; schema events refresh everything", () => {
  assert.deepEqual(tagsForEvent("page.properties_updated", "p1"), ["notion:page:p1", "notion:books", "notion:notes"]);
  assert.deepEqual(tagsForEvent("data_source.schema_updated", "d1"), ["notion"]);
  assert.deepEqual(tagsForEvent("database.content_updated", "d1"), ["notion"]);
  assert.deepEqual(tagsForEvent("comment.created", "c1"), []);
});

test("only creation and property changes can need a slug written", () => {
  assert.equal(wantsSlug("page.created"), true);
  assert.equal(wantsSlug("page.properties_updated"), true);
  assert.equal(wantsSlug("page.content_updated"), false);
});
