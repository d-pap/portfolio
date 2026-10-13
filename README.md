# Derek’s portfolio

Next.js App Router, React, TypeScript, and plain CSS. Content is local MDX and JSON in `content/`.

## Development

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test                 # node --test (Node ≥ 22.18); regenerates media colors first, which needs sharp
pnpm exec tsc --noEmit
pnpm build
```

`app/lib/media-colors.json` (each project image's average color) is generated and gitignored. `next.config.ts` writes it whenever `next dev` or `next build` starts (however they are invoked), and `pnpm test` writes it before testing. The generator is `scripts/media-colors.mjs` and uses the `sharp` dev dependency.

The "updated" date on the back plane is the date of the last commit, read at build time (`app/lib/updated.ts`). It changes when a commit lands; redeploying the same commit keeps the date.

Fragment Mono is downloaded during the build and served locally. `pnpm dev` and `pnpm build` both write to `.next/`; to build or preview alongside a running dev server, set `NEXT_DIST_DIR` (e.g. `NEXT_DIST_DIR=.next-build pnpm build`).

Judge motion on a production build (`NEXT_DIST_DIR=.next-build pnpm build`, then `NEXT_DIST_DIR=.next-build pnpm start -p 3100`). `pnpm dev` drops frames during the tile-to-hero transition and sometimes skips it, which the built site doesn't. To see what a first-time visitor sees, open the site in a private window.

## Content

- `content/about.txt`: the about paragraph on the home page. Write each switchable phrase as `{work version | play version}`. Clicking a phrase flips it on its own, so write the versions so any mix still reads as a sentence. Line breaks read as spaces. The paragraph is plain text (no links); mistakes fail the build with the line number (`app/lib/about.ts`).
- `content/<slug>.mdx`: one entry per product, project, or role. YAML frontmatter is validated at build time (`app/lib/entries.ts`); errors name the file. `index: main` entries need a `hero` (`phones`, `screen`, or `logo`) and a `tile` (`shape`, optional `media`) and appear in the home grid; `sections` adds feature tiles whose `id` must match a `## ` heading slug in the body (`## rag pipeline` → `rag-pipeline`). Shapes: `4:5`, `1:1`, `4:3`, `3:2`, `16:9`. Tile media: `cover`, `phones`, `logo`, or `diagram` (`routing`, `eval-checks`, `platform`, `memory`). Tile titles are 30 characters at most. `index: earlier` entries are text rows; `hidden` entries only have a page. Text before the first `##` is the two-column lede. Use `<Figure>` for media.
- `content/grid.yml`: places every tile in three hand-arranged columns. `npm test` checks the spacing rules on it (`app/lib/grid.content.test.ts`).
- `/bookshelf` and `/notes` come from Notion (spec `docs/superpowers/specs/2026-10-12-notes-and-bookshelf-design.md`). Secrets live in `.env.local` (gitignored): `NOTION_TOKEN`, `NOTION_BOOKS_DATABASE_ID`, `NOTION_BOOKS_DATA_SOURCE_ID`, `NOTION_NOTES_DATABASE_ID`, `NOTION_NOTES_DATA_SOURCE_ID`, `GOOGLE_BOOKS_API_KEY`, `BLOB_READ_WRITE_TOKEN`, `NOTION_WEBHOOK_SECRET`. `pnpm notion:check` compares the Notion databases with `app/lib/notion/schema.ts`. Without the Notion secrets the site builds from `content/reading.json` and hides the notes room.
- Publishing: tick **Published** in Notion. A signed webhook (`/api/notion/webhook`) refreshes the affected pages within about a minute; everything also refreshes hourly. To set up the webhook: Notion connection → Webhooks → Create subscription with `https://<domain>/api/notion/webhook` and page and data source events; copy the verification token from the Vercel logs (`[notion] webhook verification token: …`) into Notion's Verify form and into `NOTION_WEBHOOK_SECRET`, then redeploy.
- Recordings: add `recording: /projects/<name>.mp4` under `hero` (H.264, about 2–3 MB, 1440px wide). The first frame image is the poster.

## Design

The spec lives in `docs/` (kept local, not committed). Tokens are in `app/styles/tokens.css`; the text face is one token (`--font-text`). The site has a dark front sheet (the work) over a lime back plane, whose rooms are `/bookshelf` and `/notes`. Motion: the reveal at the end of each front page (scroll-driven CSS), the trip to and from a room (cross-document view transitions with types; `app/boot/trip.js` and `app/styles/trip.css`), the tile-to-hero morph, recordings, the work/play letter morph, lazy images fading in (`app/boot/arrive.js`), and a first-visit entrance (`app/boot/first-visit.js`). There are no reduced-motion variants. Judge motion on a production build.
