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

## Content

- `content/home.mdx`: the about paragraph on the home page. External markdown links open in a new tab and get the same underline as the links list beside it.
- `content/<slug>.mdx`: one entry per project or role. YAML frontmatter is validated at build time (`app/lib/entries.ts`); errors name the file. `index: main` entries need a `hero` (`phones`, `screen`, or `logo` for a single centered SVG) and appear as wide figures on the home page; `index: earlier` entries are text rows; `hidden` entries only have a page. Text before the first `##` is the two-column lede. Use `<Figure>` for media.
- `content/reading.json`: `[{ "title", "author", "isbn"?, "year"?, "notes"? }]`. Covers come from Open Library by ISBN. With an empty list, `/reading` is hidden.
- Recordings: add `recording: /projects/<name>.mp4` under `hero` (H.264, about 2–3 MB, 1440px wide). The first frame image is the poster.

## Design

The spec lives in `docs/` (kept local, not committed). Tokens are in `app/styles/tokens.css`; the text face is one token (`--font-text`). Motion is limited to the figure-to-hero view transition, recordings, and the reading highlight; all respect `prefers-reduced-motion`.
