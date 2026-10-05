import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseLayout } from "app/components/case/case-layout";
import { nextEntry } from "app/lib/case";
import { getEntries, getEntry } from "app/lib/content";
import { sortEntries } from "app/lib/entries";
import { metaData } from "app/config";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getEntries().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  const images = entry.hero ? [entry.hero.frames[0]] : undefined;
  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { title: entry.title, description: entry.summary, type: "article", url: `/work/${slug}`, images },
    twitter: { card: "summary_large_image", title: entry.title, description: entry.summary, images },
  };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const entries = getEntries();
  const entry = entries.find((item) => item.slug === slug);
  if (!entry) notFound();
  const { main, earlier } = sortEntries(entries);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: entry.title,
    description: entry.summary,
    url: new URL(`/work/${slug}`, metaData.baseUrl).href,
    author: { "@type": "Person", name: "Derek Papierski" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <CaseLayout entry={entry} next={nextEntry([...main, ...earlier], slug)} />
    </>
  );
}
