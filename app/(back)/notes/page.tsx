import type { Metadata } from "next";
import { NotesRoom } from "app/components/room/room-pages";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Notes", description: "Notes by Derek Papierski." };

export default function NotesPage() {
  return <NotesRoom />;
}
