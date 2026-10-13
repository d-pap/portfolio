import type { Metadata } from "next";
import { NotesRoom } from "app/components/room/room-pages";
import { loadNotes } from "app/lib/notion/rooms";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await loadNotes()).map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = (await loadNotes()).find((n) => n.slug === slug);
  return note ? { title: note.title } : {};
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  return <NotesRoom slug={slug} />;
}
