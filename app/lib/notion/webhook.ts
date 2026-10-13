import { verifyWebhookSignature } from "@notionhq/client";

/**
 * Notion's webhook says "page X changed"; it never carries content the site trusts (spec §5.7). Events only choose which
 * cache tags to throw away, and the next request re-reads Notion through the authenticated SDK.
 */
export type WebhookBody = { kind: "verification"; token: string } | { kind: "event"; type: string; entityId: string } | { kind: "invalid" };

export function readWebhook(body: string): WebhookBody {
  try {
    const data = JSON.parse(body);
    if (typeof data?.verification_token === "string" && data.type === undefined) return { kind: "verification", token: data.verification_token };
    if (typeof data?.type === "string" && typeof data?.entity?.id === "string") return { kind: "event", type: data.type, entityId: data.entity.id };
  } catch {
    // Not JSON.
  }
  return { kind: "invalid" };
}

/** Signed with NOTION_WEBHOOK_SECRET (constant-time compare in the SDK). No secret configured means nothing is trusted. */
export async function isTrusted(body: string, signature: string | null, secret: string | undefined): Promise<boolean> {
  const token = secret?.trim();
  if (!token || !signature) return false;
  return verifyWebhookSignature({ body, signature, verificationToken: token });
}

export function tagsForEvent(type: string, entityId: string): string[] {
  if (type.startsWith("page.")) return [`notion:page:${entityId}`, "notion:books", "notion:notes"];
  if (type.startsWith("database.") || type.startsWith("data_source.")) return ["notion"];
  return [];
}

export function wantsSlug(type: string): boolean {
  return type === "page.created" || type === "page.properties_updated";
}
