import type { Metadata } from "next";
import { BookshelfRoom } from "app/components/room/room-pages";
import { loadBooks } from "app/lib/notion/rooms";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await loadBooks()).map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = (await loadBooks()).find((b) => b.slug === slug);
  return book ? { title: book.title, description: `${book.title} by ${book.author}` } : {};
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  return <BookshelfRoom slug={slug} />;
}
