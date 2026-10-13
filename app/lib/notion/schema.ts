/** The Notion schema the site reads (spec §4.2). The check script, the page validators, and the tests all use this. */
export const NOTION_VERSION = "2026-03-11";

export const BOOK_STATUSES = ["reading", "read", "other"] as const;
export type BookStatus = (typeof BOOK_STATUSES)[number];

export const NOTE_CATEGORIES = ["docs", "bookmarks", "config"] as const;
export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

export const SCHEMA = {
  Books: {
    properties: {
      Title: "title", Author: "rich_text", ISBN: "rich_text", Status: "select", Published: "checkbox",
      Date: "date", Year: "number", Description: "rich_text", Cover: "files", Slug: "rich_text",
    },
    options: { Status: BOOK_STATUSES },
  },
  Notes: {
    properties: { Title: "title", Category: "select", Date: "date", Published: "checkbox", Slug: "rich_text" },
    options: { Category: NOTE_CATEGORIES },
  },
} as const;

export type DatabaseName = keyof typeof SCHEMA;

type PropertyShape = { type?: string; select?: { options?: { name: string }[] } };

/** Where a data source's properties fall short of the schema, one readable line each. Extra properties are fine. */
export function schemaDifferences(name: DatabaseName, properties: Record<string, PropertyShape>): string[] {
  const want = SCHEMA[name];
  const out: string[] = [];
  for (const [property, type] of Object.entries(want.properties)) {
    const got = properties[property];
    if (!got) out.push(`${name}: missing property "${property}" (${type})`);
    else if (got.type !== type) out.push(`${name}: "${property}" is ${got.type}, expected ${type}`);
  }
  for (const [property, allowed] of Object.entries(want.options) as [string, readonly string[]][]) {
    const names = properties[property]?.select?.options?.map((option) => option.name) ?? [];
    if (!properties[property] || properties[property].type !== "select") continue;
    for (const option of allowed) if (!names.includes(option)) out.push(`${name}: "${property}" is missing the option "${option}"`);
  }
  return out;
}
