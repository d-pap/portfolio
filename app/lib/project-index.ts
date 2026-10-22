import type { Entry } from "./entries";
import type { TileMedia } from "./tiles";

export type IndexPreview = { image: string; video?: string };
export type IndexRow = {
  id: string;
  href: string;
  title: string;
  period: string;
  area: string;
  role: string;
  summary: string;
  preview?: IndexPreview;
};
export type IndexGroup = { title: string; rows: IndexRow[] };

function preview(media: TileMedia | undefined): IndexPreview | undefined {
  if (media?.kind === "cover")
    return { image: media.src, video: media.recording };
  if (media?.kind === "phones") return { image: media.frames[0] };
  if (media?.kind === "logo") return { image: media.src };
}

/** Original grouped index. Dates refer to when work on the parent project began. */
export function projectIndex(main: Entry[], earlier: Entry[]): IndexGroup[] {
  return [
    {
      title: "Selected work",
      rows: main.map((entry) => ({
        id: entry.slug,
        href: `/work/${entry.slug}`,
        title: entry.shortTitle,
        period: entry.period.match(/\d{4}/)?.[0] ?? "",
        area: entry.area,
        role: entry.role,
        summary: entry.summary,
        preview:
          preview(entry.tile?.media) ??
          (entry.hero
            ? { image: entry.hero.frames[0], video: entry.hero.recording }
            : undefined),
      })),
    },
    {
      title: "Systems & features",
      rows: main.flatMap((entry) =>
        entry.sections.map((section) => ({
          id: `${entry.slug}#${section.id}`,
          href: `/work/${entry.slug}#${section.id}`,
          title: section.title,
          period: entry.period.match(/\d{4}/)?.[0] ?? "",
          area: entry.shortTitle,
          role: section.label,
          summary: `${section.title} — ${section.label}.`,
          preview: preview(section.media),
        })),
      ),
    },
    {
      title: "Earlier",
      rows: earlier.map((entry) => ({
        id: entry.slug,
        href: `/work/${entry.slug}`,
        title: entry.shortTitle,
        period: entry.period.match(/\d{4}/)?.[0] ?? "",
        area: entry.area,
        role: entry.role,
        summary: entry.summary,
        preview: entry.hero
          ? { image: entry.hero.frames[0], video: entry.hero.recording }
          : undefined,
      })),
    },
  ].filter((group) => group.rows.length > 0);
}
