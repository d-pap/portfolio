import { notion, notionConfig } from "./client.ts";
import { queryAll } from "./source.ts";
import { plainText, type RawPage } from "./pages.ts";
import { assignSlugs } from "./slugs.ts";

/**
 * The only write the site makes to Notion: once an entry is published, its URL slug is saved on the page, so renaming the
 * title later never breaks the link. The write fires one more webhook, which finds the Slug set and stops.
 */
export async function writeSlugIfMissing(pageId: string): Promise<void> {
  const config = notionConfig();
  if (!config) return;
  const n = notion(config.token);
  const page = (await n.pages.retrieve({ page_id: pageId })) as unknown as RawPage & { parent?: { data_source_id?: string } };
  const source = page.parent?.data_source_id;
  if (source !== config.booksDataSource && source !== config.notesDataSource) return;
  if (!page.properties.Published?.checkbox || plainText(page.properties.Slug?.rich_text)) return;
  const all = await queryAll(config.token, source);
  const slug = assignSlugs(all.map((p) => ({
    id: p.id, title: plainText(p.properties.Title?.title), slug: plainText(p.properties.Slug?.rich_text) || null, createdTime: p.created_time,
  }))).get(page.id);
  if (!slug) return;
  await n.pages.update({ page_id: page.id, properties: { Slug: { rich_text: [{ type: "text", text: { content: slug } }] } } });
}
