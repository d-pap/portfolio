import { notFound, permanentRedirect } from "next/navigation";
import { getEntries } from "app/lib/content";

export function generateStaticParams() {
  return getEntries().map(({ slug }) => ({ slug }));
}

export default async function LegacyProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getEntries().some((entry) => entry.slug === slug)) notFound();
  permanentRedirect(`/work/${slug}`);
}
