import type { Entry, ProjectTopic } from "./entries";
import type { TileMedia } from "./tiles";
import { stackLogos } from "./stack-logos.ts";

export type IndexPreview = { image: string; video?: string };
export type IndexRow = {
  id: string;
  href: string;
  title: string;
  period: string;
  summary: string;
  description: string;
  topics: ProjectTopic[];
  logos: { name: string; path: string }[];
  hasHero: boolean;
  preview?: IndexPreview;
};

function preview(media: TileMedia | undefined): IndexPreview | undefined {
  if (media?.kind === "cover")
    return { image: media.src, video: media.recording };
  if (media?.kind === "phones") return { image: media.frames[0] };
  if (media?.kind === "logo") return { image: media.src };
}

/** One row per project, including the analysis projects. */
export function projectIndex(main: Entry[], earlier: Entry[]): IndexRow[] {
  return [...main, ...earlier].map((entry) => ({
    id: entry.slug,
    href: `/work/${entry.slug}`,
    title: entry.title,
    period: entry.period,
    summary: entry.summary,
    description: entry.previewDescription ?? entry.summary,
    topics: entry.topics,
    logos: stackLogos(entry.stack ?? ""),
    hasHero: Boolean(entry.hero),
    preview:
      preview(entry.tile?.media) ??
      (entry.hero
        ? { image: entry.hero.frames[0], video: entry.hero.recording }
        : undefined),
  }));
}
