import { loadBody } from "app/lib/notion/rooms";
import { formatDate } from "app/lib/notion/order";
import type { NoteEntry } from "app/lib/notion/model";
import { Blocks } from "./blocks";
import "app/components/media/media.css";

export async function NoteView({ note }: { note: NoteEntry }) {
  const body = await loadBody(note.id, note.lastEditedTime);
  return (
    <article className="entry">
      <h1 className="entry-title">{note.title}</h1>
      <p className="entry-sub">{formatDate(note.date)}</p>
      <div className="entry-body"><Blocks blocks={body} /></div>
    </article>
  );
}
