import { collectPaginatedAPI } from "@notionhq/client";
import { notion } from "./client.ts";
import type { RawPage } from "./pages.ts";
import type { RawBlock } from "./blocks.ts";

export async function queryPublished(token: string, dataSourceId: string): Promise<RawPage[]> {
  const n = notion(token);
  return (await collectPaginatedAPI(n.dataSources.query, {
    data_source_id: dataSourceId,
    filter: { property: "Published", checkbox: { equals: true } },
  })) as unknown as RawPage[];
}

/** Every page, published or not (slug collisions must count drafts that will publish later). */
export async function queryAll(token: string, dataSourceId: string): Promise<RawPage[]> {
  const n = notion(token);
  return (await collectPaginatedAPI(n.dataSources.query, { data_source_id: dataSourceId })) as unknown as RawPage[];
}

/** A page's blocks with their children attached (four levels deep is plenty for notes). */
export async function readBlocks(token: string, blockId: string, depth = 0): Promise<RawBlock[]> {
  const n = notion(token);
  const blocks = (await collectPaginatedAPI(n.blocks.children.list, { block_id: blockId })) as unknown as RawBlock[];
  for (const block of blocks) {
    if (block.has_children && depth < 4 && block.type !== "child_page" && block.type !== "child_database") {
      block.children = await readBlocks(token, block.id, depth + 1);
    }
  }
  return blocks;
}
