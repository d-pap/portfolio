import type { Metadata } from "next";
import { BookshelfRoom } from "app/components/room/room-pages";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Bookshelf", description: "Books Derek has read." };

export default function BookshelfPage() {
  return <BookshelfRoom />;
}
