import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { getEntries, getEntry } from "app/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getEntries().map(({ slug }) => ({ slug }));
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();
  return (
    <article className="page">
      <h1>{entry.title}</h1>
      <CustomMDX source={entry.body} />
    </article>
  );
}
