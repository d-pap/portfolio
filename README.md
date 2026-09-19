# Derek’s portfolio

Next.js App Router, React, TypeScript, and Tailwind CSS. Case studies are local MDX files in `content/`.

## Development

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm exec tsc --noEmit
pnpm build
```

Next’s Inter font is downloaded during the build and served locally to visitors. The build needs network access on its first run. Stop the development server before building; both commands write to `.next/`. For a separate preview alongside an existing server, use `NEXT_DIST_DIR=.next-preview pnpm dev --port 3001`; use the same environment variable for its build and start commands.

## Content and layout

- `/`: short introduction and the complete work grid. Inline notes contain experience, areas of focus, and tools.
- `/work/[slug]`: project preview, facts, and case study. The project identity stays in the desktop sidebar; each `##` heading and its content sit in the main column. `ProjectFigure` components show large, vertically stacked images.
- `/work` and `/blog` redirect home. Existing `/blog/[slug]` links redirect to `/work/[slug]`.

Each case study has a title, summary, role, period, status, context, stack, and optional website/repository links in frontmatter. `order` controls the home-page sequence; every project appears. Keep the publication date separate from the project’s period. Use `##` headings for all body sections.

Project previews live in `app/components/project-art.tsx`; shared styles live in `app/global.css`. Screenshots are in `public/projects/`. They are real interfaces: Stitches is a development preview; the RENEW and Sprout screenshots are dated in the case studies. The analysis covers use actual notebook charts.

Inline notes support hover, keyboard focus, click/tap, outside dismissal, and Escape. Image galleries use a keyboard-accessible dialog. Motion respects `prefers-reduced-motion`.
