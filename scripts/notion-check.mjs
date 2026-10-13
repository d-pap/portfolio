// Compares Derek's Notion data sources with the schema in app/lib/notion/schema.ts. Reports, never changes anything.
// Run with `pnpm notion:check` (loads .env.local). Prints no secrets.
import { Client } from "@notionhq/client";
import { NOTION_VERSION, SCHEMA, schemaDifferences } from "../app/lib/notion/schema.ts";

const token = process.env.NOTION_TOKEN?.trim();
if (!token) {
  console.error("NOTION_TOKEN is not set (pnpm notion:check reads .env.local)");
  process.exit(1);
}
const notion = new Client({ auth: token, notionVersion: NOTION_VERSION });
let failed = false;
try {
  const me = await notion.users.me({});
  console.log(`workspace: ${me.bot?.workspace_name ?? "unknown"}`);
  for (const [name, key] of [["Books", "NOTION_BOOKS_DATA_SOURCE_ID"], ["Notes", "NOTION_NOTES_DATA_SOURCE_ID"]]) {
    const id = process.env[key]?.trim();
    if (!id) { console.error(`${key} is not set`); failed = true; continue; }
    const source = await notion.dataSources.retrieve({ data_source_id: id });
    const problems = schemaDifferences(name, source.properties);
    const extra = Object.keys(source.properties).filter((property) => !(property in SCHEMA[name].properties));
    console.log(problems.length ? problems.join("\n") : `${name}: schema matches`);
    if (extra.length) console.log(`${name}: ignoring extra properties ${extra.join(", ")}`);
    if (problems.length) failed = true;
  }
} catch (error) {
  console.error(`notion check failed: ${error.code ?? error.name}`);
  failed = true;
}
process.exit(failed ? 1 : 0);
