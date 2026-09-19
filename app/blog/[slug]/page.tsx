import { notFound, permanentRedirect } from "next/navigation";
import { getBlogPosts } from "app/lib/posts";
export function generateStaticParams() { return getBlogPosts().map(({slug}) => ({slug})); }
export default async function LegacyProject({ params }: { params: Promise<{ slug: string }> }) {
  const {slug} = await params;
  if (!getBlogPosts().some(post => post.slug === slug)) notFound();
  permanentRedirect(`/work/${slug}`);
}
