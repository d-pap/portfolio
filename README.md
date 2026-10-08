# Derek’s portfolio

Next.js App Router, React, TypeScript, and plain CSS. Content is local MDX and JSON in `content/`.

## Development

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test                 # node --test, no extra dependencies (Node ≥ 22.18)
pnpm exec tsc --noEmit
pnpm build
```

Fragment Mono is downloaded during the build and served locally. `pnpm dev` and `pnpm build` both write to `.next/`; to build or preview alongside a running dev server, set `NEXT_DIST_DIR` (e.g. `NEXT_DIST_DIR=.next-build pnpm build`).

Judge motion on a production build (`NEXT_DIST_DIR=.next-build pnpm build`, then `NEXT_DIST_DIR=.next-build pnpm start -p 3100`). `pnpm dev` drops frames during the tile-to-hero transition and sometimes skips it, which the built site doesn't. To see what a first-time visitor sees, open the site in a private window.

## Content

- `content/about.txt`: the about paragraph on the home page. Write each switchable phrase as `{work version | play version}`. Clicking a phrase flips it on its own, so write the versions so any mix still reads as a sentence. Line breaks read as spaces. The paragraph is plain text (no links); mistakes fail the build with the line number (`app/lib/about.ts`).
- `content/<slug>.mdx`: one entry per product, project, or role. YAML frontmatter is validated at build time (`app/lib/entries.ts`); errors name the file. `index: main` entries need a `hero` (`phones`, `screen`, or `logo`) and a `tile` (`shape`, optional `media`) and appear in the home grid; `sections` adds feature tiles whose `id` must match a `## ` heading slug in the body (`## rag pipeline` → `rag-pipeline`). Shapes: `4:5`, `1:1`, `4:3`, `3:2`, `16:9`. Tile media: `cover`, `phones`, `logo`, or `diagram` (`routing`, `eval-checks`, `platform`, `memory`). Tile titles are 30 characters at most. `index: earlier` entries are text rows; `hidden` entries only have a page. Text before the first `##` is the two-column lede. Use `<Figure>` for media.
- `content/grid.yml`: places every tile in three hand-arranged columns. `npm test` checks the spacing rules on it (`app/lib/grid.content.test.ts`).
- `content/reading.json`: `[{ "title", "author", "isbn"?, "year"?, "notes"? }]`. Covers come from Open Library by ISBN. With an empty list, `/reading` is hidden.
- Recordings: add `recording: /projects/<name>.mp4` under `hero` (H.264, about 2–3 MB, 1440px wide). The first frame image is the poster.

## Design

The spec lives in `docs/` (kept local, not committed). Tokens are in `app/styles/tokens.css`; the text face is one token (`--font-text`). Motion is the figure-to-hero view transition, recordings, the reading highlight, and the work/play letter morph (`app/components/work-play.tsx`); all respect `prefers-reduced-motion`.
