import { revalidateTag } from "next/cache";
import { isTrusted, readWebhook, tagsForEvent, wantsSlug } from "app/lib/notion/webhook";
import { writeSlugIfMissing } from "app/lib/notion/slug-writeback";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const body = await request.text();
  const message = readWebhook(body);
  if (message.kind === "verification") {
    // Notion's one-time handshake (spec §5.7): Derek copies this from the Vercel logs into Notion and NOTION_WEBHOOK_SECRET.
    console.log(`[notion] webhook verification token: ${message.token}`);
    return new Response(null, { status: 200 });
  }
  if (!(await isTrusted(body, request.headers.get("x-notion-signature"), process.env.NOTION_WEBHOOK_SECRET))) {
    return new Response(null, { status: 401 });
  }
  if (message.kind !== "event") return new Response(null, { status: 400 });
  // The slug is written before the refresh, so the refreshed list already has it; a failed write still refreshes.
  try {
    if (wantsSlug(message.type)) {
      await writeSlugIfMissing(message.entityId).catch((error) => console.warn(`[notion] slug write-back failed for ${message.entityId}: ${error?.code ?? error?.name}`));
    }
  } finally {
    for (const tag of tagsForEvent(message.type, message.entityId)) revalidateTag(tag);
  }
  return new Response(null, { status: 200 });
}
