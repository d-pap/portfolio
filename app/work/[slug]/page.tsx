import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { ProjectArt } from "app/components/project-art";
import { Arrow } from "app/components/arrow";
import { getBlogPosts, getProjects } from "app/lib/posts";
import { metaData } from "app/config";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getBlogPosts().map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPosts().find(post => post.slug === slug);
  if (!post) return {};
  const { title, summary: description, image } = post.metadata;
  return { title, description, alternates: { canonical: `/work/${slug}` }, openGraph: { title, description, type: "article", url: `/work/${slug}`, images: image ? [image] : undefined }, twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined } };
}

const captions: Record<string, string> = {
  "renew-app": "Learning screens from the app · May–July 2026",
  "rag-api": "An earlier Sprout interface · April 2026",
  stitches: "Homepage development preview · September 2026",
  codecoach: "The problem-solving workspace",
  bank: "Independent data analysis · 2024",
  "twitter-nlp": "Independent data analysis · 2024",
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPosts().find(post => post.slug === slug);
  if (!post) notFound();
  const { metadata: data } = post;
  const sections = post.content.split(/^## /m).filter(Boolean).map((section, index) => {
    const newline = section.indexOf("\n");
    const title = section.slice(0, newline).trim();
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return { title, body: section.slice(newline + 1), id: id || `section-${index + 1}` };
  });
  const ordered = getProjects();
  const next = ordered[(ordered.findIndex(p => p.slug === slug) + 1) % ordered.length];
  const facts = [["role", data.role], ["with", data.context], ["when", data.period], ["status", data.status]];
  return <article className="site-shell project-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "CreativeWork", name: data.title, description: data.summary, url: new URL(`/work/${slug}`, metaData.baseUrl).href, author: { "@type": "Person", name: "Derek Papierski" } }).replace(/</g, "\u003c") }} />
    <figure className="project-cover"><ProjectArt slug={slug} priority /><figcaption>{captions[slug]}</figcaption></figure>
    <div className="project-layout">
      <aside className="project-sidebar">
        <h1>{data.title}</h1>
        <p>{data.context}</p>
      </aside>
      <div className="project-story">
        <header className="project-overview">
          <p className="project-deck">{data.summary}</p>
          <dl className="project-facts">{facts.map(([name,value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}<div className="stack-fact"><dt>stack</dt><dd>{data.stack}</dd></div></dl>
          {(data.website || data.repository) && <div className="project-links">{data.website && <a href={data.website} className="text-link" target="_blank" rel="noreferrer">{slug === "renew-app" ? "App Store" : "visit site"} <Arrow /></a>}{data.repository && <a href={data.repository} className="text-link" target="_blank" rel="noreferrer">source code <Arrow /></a>}</div>}
        </header>
        {sections.map(section => <section className="case-section" aria-labelledby={section.id} key={section.id}>
          <h2 id={section.id} className="case-section-title">{section.title}</h2>
          <div className="case-body prose prose-neutral dark:prose-invert"><CustomMDX source={section.body} /></div>
        </section>)}
      </div>
    </div>
    <nav className="project-end" aria-label="Project navigation"><Link href="/" className="text-link">← back to all work</Link><Link href={`/work/${next.slug}`} className="text-link">next: {next.metadata.shortTitle || next.metadata.title} <Arrow diagonal={false} /></Link></nav>
  </article>;
}
