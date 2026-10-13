import { notFound } from "next/navigation";
import { loadBooks, loadNotes } from "app/lib/notion/rooms";
import { bookSub, filtersFor, formatDate } from "app/lib/notion/order";
import { BOOK_STATUSES, NOTE_CATEGORIES } from "app/lib/notion/schema";
import { RoomLayout } from "./room-layout";
import { Reader } from "./reader";
import { BookView } from "./book-view";
import { NoteView } from "./note-view";

/** A room's index (the first entry open) or one entry. An unknown slug, or a room with nothing published, is a 404. */
export async function BookshelfRoom({ slug }: { slug?: string }) {
  const books = await loadBooks();
  const open = slug ? books.find((book) => book.slug === slug) : books[0];
  if (!open) notFound();
  return (
    <RoomLayout room="bookshelf">
      <Reader
        room="bookshelf" openSlug={open.slug} view={slug ? "entry" : "index"}
        filters={filtersFor(books.map((book) => book.status), BOOK_STATUSES)}
        items={books.map((book) => ({ slug: book.slug, title: book.title, sub: bookSub(book), group: book.status }))}
      >
        <BookView book={open} />
      </Reader>
    </RoomLayout>
  );
}

export async function NotesRoom({ slug }: { slug?: string }) {
  const notes = await loadNotes();
  const open = slug ? notes.find((note) => note.slug === slug) : notes[0];
  if (!open) notFound();
  return (
    <RoomLayout room="notes">
      <Reader
        room="notes" openSlug={open.slug} view={slug ? "entry" : "index"}
        filters={filtersFor(notes.map((note) => note.category), NOTE_CATEGORIES)}
        items={notes.map((note) => ({ slug: note.slug, title: note.title, sub: formatDate(note.date), group: note.category }))}
      >
        <NoteView note={open} />
      </Reader>
    </RoomLayout>
  );
}
