import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingList } from "app/components/reading/reading-list";
import { RoomLayout } from "app/components/room/room-layout";
import { getReading } from "app/lib/content";

export const metadata: Metadata = { title: "Bookshelf", description: "Books Derek has read." };

export default function BookshelfPage() {
  const books = getReading();
  if (books.length === 0) notFound();
  return (
    <RoomLayout room="bookshelf">
      <ReadingList books={books} />
    </RoomLayout>
  );
}
