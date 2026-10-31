import { bundledLanguages, codeToHtml } from "shiki";
import type { Block } from "./blocks.ts";

/** Notion's names for languages Shiki knows by another id. Anything else unknown is shown as plain text. */
const ALIASES: Record<string, string> = {
  "plain text": "text", "c++": "cpp", "c#": "csharp", "f#": "fsharp", shell: "shellscript", docker: "dockerfile",
  markup: "html", "java/c/c++/c#": "java", "visual basic": "vb", "vb.net": "vb", webassembly: "wasm", "objective-c": "objective-c",
};

/** The Shiki language for a Notion code block's language. */
export function shikiLanguage(notion: string): string {
  const name = notion.trim().toLowerCase();
  const id = ALIASES[name] ?? name;
  return id in bundledLanguages ? id : "text";
}

/**
 * A code block as colored HTML, in the GitHub light theme. The <pre>'s own background and color are dropped so the
 * block keeps the reader's gray fill and ink (reader.css); only the token colors come from the theme.
 */
export async function highlight(code: string, notionLanguage: string): Promise<string> {
  return codeToHtml(code, {
    lang: shikiLanguage(notionLanguage),
    theme: "github-light",
    transformers: [{ pre(node) { delete node.properties.style; delete node.properties.tabindex; } }],
  });
}

/** Every code block in a body, highlighted once when the body is loaded (and cached with it). */
export async function highlightCode(blocks: Block[]): Promise<Block[]> {
  return Promise.all(blocks.map(async (block): Promise<Block> => {
    switch (block.type) {
      case "code":
        try {
          return { ...block, html: await highlight(block.code, block.language) };
        } catch (error) {
          console.warn(`[notion] couldn't highlight a ${block.language} block; showing it plain`, error);
          return block;
        }
      case "list":
      case "todo":
        return { ...block, items: await Promise.all(block.items.map(async (item) => ({ ...item, children: await highlightCode(item.children) }))) } as Block;
      case "columns":
        return { ...block, columns: await Promise.all(block.columns.map(async (column) => ({ ...column, children: await highlightCode(column.children) }))) };
      case "quote":
      case "callout":
      case "toggle":
        return { ...block, children: await highlightCode(block.children) };
      default:
        return block;
    }
  }));
}
