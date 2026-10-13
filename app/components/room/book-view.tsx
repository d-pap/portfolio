import Image from "next/image";
import { loadBody } from "app/lib/notion/rooms";
import { bookSub } from "app/lib/notion/order";
import { optimizable } from "app/lib/notion/images";
import type { BookEntry } from "app/lib/notion/model";
import { Blocks } from "./blocks";
import "app/components/media/media.css";

export async function BookView({ book }: { book: BookEntry }) {
  const body = await loadBody(book.id, book.lastEditedTime);
  return (
    <article className="entry">
      <div className="book-head">
        <div className="book-cover">
          {book.cover ? (
            <Image className="arrive" suppressHydrationWarning src={book.cover} alt={`${book.title} by ${book.author}`} fill sizes="176px" unoptimized={!optimizable(book.cover)} />
          ) : (
            <span className="book-card"><span>{book.title}</span><span>{book.author}</span></span>
          )}
        </div>
        <div>
          <h1 className="entry-title">{book.title}</h1>
          <p className="entry-sub">{bookSub(book)}</p>
        </div>
      </div>
      {body.length > 0 ? (
        <>
          <p className="label entry-label">notes</p>
          <Blocks blocks={body} />
        </>
      ) : book.description ? (
        <>
          <p className="label entry-label">about this book</p>
          <div className="prose">{book.description.text.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
          {book.description.source !== "notion" && <p className="label entry-source">description from {book.description.source}</p>}
        </>
      ) : null}
    </article>
  );
}
