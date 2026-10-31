/** Notion's blocks reduced to the small set the rooms render (spec §5.2). Anything else is skipped by name. */
export type Inline = { text: string; href?: string; bold?: true; italic?: true; strike?: true; underline?: true; code?: true; math?: true };
export type ListItem = { text: Inline[]; children: Block[] };
export type TodoItem = ListItem & { checked: boolean };
export type TocItem = { level: 2 | 3 | 4; text: string; anchor: string };
export type Block =
  | { type: "paragraph"; text: Inline[] }
  | { type: "heading"; level: 2 | 3 | 4; text: Inline[]; anchor?: string }
  | { type: "list"; ordered: boolean; items: ListItem[] }
  | { type: "todo"; items: TodoItem[] }
  | { type: "quote"; text: Inline[]; children: Block[] }
  | { type: "callout"; icon?: string; text: Inline[]; children: Block[] }
  | { type: "toggle"; summary: Inline[]; children: Block[] }
  | { type: "code"; language: string; code: string; caption: Inline[] }
  | { type: "image"; id: string; edited: string; src: string; width?: number; height?: number; caption: Inline[] }
  | { type: "divider" }
  | { type: "link"; href: string; caption: Inline[] }
  // Rows of cells; with `header` the first row is the column header, with `rowHeader` each row's first cell is.
  | { type: "table"; header: boolean; rowHeader: boolean; rows: Inline[][][] }
  // Each column's share of the width (Notion's width_ratio, which sums to 1), or none for equal columns.
  | { type: "columns"; columns: { ratio?: number; children: Block[] }[] }
  | { type: "equation"; expression: string }
  | { type: "video"; src: string; caption: Inline[] }
  | { type: "toc"; items: TocItem[] };

export type RawRichText = {
  type?: string; plain_text: string; href?: string | null; equation?: { expression: string };
  annotations?: { bold?: boolean; italic?: boolean; strikethrough?: boolean; underline?: boolean; code?: boolean };
};
export type RawBlock = { id: string; type: string; last_edited_time?: string; has_children?: boolean; children?: RawBlock[]; [key: string]: unknown };
type RawData = {
  rich_text?: RawRichText[]; caption?: RawRichText[]; language?: string; url?: string;
  icon?: { type: string; emoji?: string }; type?: string; file?: { url: string }; external?: { url: string };
  checked?: boolean; expression?: string; cells?: RawRichText[][]; has_column_header?: boolean; has_row_header?: boolean;
  width_ratio?: number;
};

/** A link a <video> element can play: a file ending in a video extension. YouTube and the like become links. */
export function isVideoFile(url: string): boolean {
  try {
    return /\.(mp4|m4v|webm|mov)$/i.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

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
  return rich.filter((item) => item.plain_text || item.equation?.expression).map((item) => {
    const a = item.annotations ?? {};
    // An inline equation's text is its TeX source; the renderer turns it into MathML.
    if (item.type === "equation") return { text: item.equation?.expression ?? item.plain_text, math: true };
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
  const skipped: string[] = [];
  const blocks = convert(raw, skipped);
  anchor(blocks);
  return { blocks, skipped };
}

function convert(raw: RawBlock[], skipped: string[]): Block[] {
  const blocks: Block[] = [];
  const inner = (block: RawBlock) => convert(block.children ?? [], skipped);
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
      case "to_do": {
        const item = { text: toInline(data.rich_text), checked: !!data.checked, children: inner(block) };
        const last = blocks[blocks.length - 1];
        if (last?.type === "todo") last.items.push(item);
        else blocks.push({ type: "todo", items: [item] });
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
      case "video": {
        // Only linked files play. A video uploaded into Notion is skipped: copying it to Blob like an image would
        // spend the free tier's transfer, and Blob locks for 30 days once that runs out, images included.
        const src = data.type === "external" ? data.external?.url : undefined;
        if (src && isVideoFile(src)) blocks.push({ type: "video", src, caption: toInline(data.caption) });
        else if (src) blocks.push({ type: "link", href: src, caption: toInline(data.caption) });
        else skipped.push("video (uploaded to Notion; link a hosted file instead)");
        break;
      }
      case "table": {
        const rows = (block.children ?? []).filter((row) => row.type === "table_row")
          .map((row) => ((row.table_row as RawData | undefined)?.cells ?? []).map((cell) => toInline(cell)));
        if (rows.length) blocks.push({ type: "table", header: !!data.has_column_header, rowHeader: !!data.has_row_header, rows });
        else skipped.push("table");
        break;
      }
      case "column_list": {
        const columns = (block.children ?? []).filter((column) => column.type === "column").map((column) => {
          const ratio = (column.column as RawData | undefined)?.width_ratio;
          return { ...(ratio ? { ratio } : {}), children: inner(column) };
        });
        if (columns.length) blocks.push({ type: "columns", columns });
        break;
      }
      case "equation":
        if (data.expression) blocks.push({ type: "equation", expression: data.expression });
        break;
      case "table_of_contents":
        blocks.push({ type: "toc", items: [] });
        break;
      case "divider":
        blocks.push({ type: "divider" });
        break;
      case "bookmark":
      case "link_preview":
      case "embed":
        // An embed would put someone else's page inside the note; it reads as a link to that page instead.
        if (data.url) blocks.push({ type: "link", href: data.url, caption: toInline(data.caption) });
        break;
      default:
        skipped.push(block.type);
    }
  }
  return blocks;
}

/** Plain text of a heading, lowercased into a URL fragment ("Two things that broke" → "two-things-that-broke"). */
function slugify(text: string): string {
  return text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";
}

/** Gives every heading a unique anchor, in page order, and fills each table of contents with them. */
function anchor(blocks: Block[]): void {
  const headings: TocItem[] = [];
  const used = new Map<string, number>();
  const walk = (list: Block[]) => {
    for (const block of list) {
      if (block.type === "heading") {
        const base = slugify(block.text.map((part) => part.text).join(""));
        const count = used.get(base) ?? 0;
        used.set(base, count + 1);
        block.anchor = count ? `${base}-${count + 1}` : base;
        headings.push({ level: block.level, text: block.text.map((part) => part.text).join(""), anchor: block.anchor });
      }
      else if (block.type === "columns") block.columns.forEach((column) => walk(column.children));
      else if (block.type === "list" || block.type === "todo") block.items.forEach((item) => walk(item.children));
      else if ("children" in block) walk(block.children);
    }
  };
  walk(blocks);
  const fill = (list: Block[]) => {
    for (const block of list) {
      if (block.type === "toc") block.items = headings;
      else if (block.type === "columns") block.columns.forEach((column) => fill(column.children));
      else if ("children" in block) fill(block.children);
    }
  };
  fill(blocks);
}
