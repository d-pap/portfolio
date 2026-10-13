/** Notion's blocks reduced to the small set the rooms render (spec §5.2). Anything else is skipped by name. */
export type Inline = { text: string; href?: string; bold?: true; italic?: true; strike?: true; underline?: true; code?: true };
export type ListItem = { text: Inline[]; children: Block[] };
export type Block =
  | { type: "paragraph"; text: Inline[] }
  | { type: "heading"; level: 2 | 3 | 4; text: Inline[] }
  | { type: "list"; ordered: boolean; items: ListItem[] }
  | { type: "quote"; text: Inline[]; children: Block[] }
  | { type: "callout"; icon?: string; text: Inline[]; children: Block[] }
  | { type: "toggle"; summary: Inline[]; children: Block[] }
  | { type: "code"; language: string; code: string; caption: Inline[] }
  | { type: "image"; id: string; edited: string; src: string; width?: number; height?: number; caption: Inline[] }
  | { type: "divider" }
  | { type: "link"; href: string; caption: Inline[] };

export type RawRichText = {
  type?: string; plain_text: string; href?: string | null;
  annotations?: { bold?: boolean; italic?: boolean; strikethrough?: boolean; underline?: boolean; code?: boolean };
};
export type RawBlock = { id: string; type: string; last_edited_time?: string; has_children?: boolean; children?: RawBlock[]; [key: string]: unknown };
type RawData = {
  rich_text?: RawRichText[]; caption?: RawRichText[]; language?: string; url?: string;
  icon?: { type: string; emoji?: string }; type?: string; file?: { url: string }; external?: { url: string };
};

// Links into Derek's Notion are private: a mention, a relative link (Notion's own form for a link to a page), or a
// notion.so URL. Pages published to *.notion.site are public and keep their links.
function isPrivate(href: string): boolean {
  if (href.startsWith("/")) return true;
  try {
    const host = new URL(href).hostname;
    return host === "notion.so" || host === "www.notion.so";
  } catch {
    return false;
  }
}

export function toInline(rich: RawRichText[] = []): Inline[] {
  return rich.filter((item) => item.plain_text).map((item) => {
    const a = item.annotations ?? {};
    const out: Inline = { text: item.plain_text };
    // A private link renders as its text.
    if (item.href && item.type !== "mention" && !isPrivate(item.href)) out.href = item.href;
    if (a.bold) out.bold = true;
    if (a.italic) out.italic = true;
    if (a.strikethrough) out.strike = true;
    if (a.underline) out.underline = true;
    if (a.code) out.code = true;
    return out;
  });
}

export function toBlocks(raw: RawBlock[]): { blocks: Block[]; skipped: string[] } {
  const blocks: Block[] = [];
  const skipped: string[] = [];
  const inner = (block: RawBlock) => {
    const result = toBlocks(block.children ?? []);
    skipped.push(...result.skipped);
    return result.blocks;
  };
  for (const block of raw) {
    const data = (block[block.type] ?? {}) as RawData;
    switch (block.type) {
      case "paragraph":
        blocks.push({ type: "paragraph", text: toInline(data.rich_text) });
        if (block.children?.length) blocks.push(...inner(block));
        break;
      case "heading_1":
      case "heading_2":
      case "heading_3":
        blocks.push({ type: "heading", level: (Number(block.type.slice(-1)) + 1) as 2 | 3 | 4, text: toInline(data.rich_text) });
        // Toggle headings keep their body in children; it follows the heading as siblings.
        if (block.children?.length) blocks.push(...inner(block));
        break;
      case "bulleted_list_item":
      case "numbered_list_item": {
        const ordered = block.type === "numbered_list_item";
        const item = { text: toInline(data.rich_text), children: inner(block) };
        const last = blocks[blocks.length - 1];
        if (last?.type === "list" && last.ordered === ordered) last.items.push(item);
        else blocks.push({ type: "list", ordered, items: [item] });
        break;
      }
      case "quote":
        blocks.push({ type: "quote", text: toInline(data.rich_text), children: inner(block) });
        break;
      case "callout":
        blocks.push({ type: "callout", ...(data.icon?.type === "emoji" && data.icon.emoji ? { icon: data.icon.emoji } : {}), text: toInline(data.rich_text), children: inner(block) });
        break;
      case "toggle":
        blocks.push({ type: "toggle", summary: toInline(data.rich_text), children: inner(block) });
        break;
      case "code":
        blocks.push({ type: "code", language: data.language ?? "plain text", code: (data.rich_text ?? []).map((t) => t.plain_text).join(""), caption: toInline(data.caption) });
        break;
      case "image": {
        // Notion-hosted ("file") and external images are both mirrored later, so only the URL matters here.
        const src = data.type === "file" ? data.file?.url : data.external?.url;
        if (src) blocks.push({ type: "image", id: block.id, edited: block.last_edited_time ?? "", src, caption: toInline(data.caption) });
        else skipped.push("image");
        break;
      }
      case "divider":
        blocks.push({ type: "divider" });
        break;
      case "bookmark":
      case "link_preview":
        if (data.url) blocks.push({ type: "link", href: data.url, caption: toInline(data.caption) });
        break;
      default:
        skipped.push(block.type);
    }
  }
  return { blocks, skipped };
}
