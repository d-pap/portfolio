import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingList } from "app/components/reading/reading-list";
import { getReading } from "app/lib/content";

export const metadata: Metadata = { title: "Reading", description: "Books Derek has read." };

export default function ReadingPage() {
  const books = getReading();
  if (books.length === 0) notFound();
  return (
    <div className="page">
      <ReadingList books={books} />
    </div>
  );
}
