"use client";

import Image from "next/image";
import { useState } from "react";
import { bookKey, coverUrl, type Book } from "app/lib/reading";
import "./reading.css";

function Cover({ book, hot, onHover }: { book: Book; hot: boolean; onHover: (on: boolean) => void }) {
  const [failed, setFailed] = useState(false);
  const label = `${book.title} by ${book.author}`;
  return (
    <li className={hot ? "reading-cover is-hot" : "reading-cover"} onPointerEnter={() => onHover(true)} onPointerLeave={() => onHover(false)}>
      {book.isbn && !failed ? (
        <Image src={coverUrl(book.isbn)} alt={label} fill sizes="(max-width: 899px) 33vw, 15vw" onError={() => setFailed(true)} />
      ) : (
        <span className="reading-card" role="img" aria-label={label}>
          <span>{book.title}</span>
          <span>{book.author}</span>
        </span>
      )}
    </li>
  );
}

export function ReadingList({ books }: { books: Book[] }) {
  const [hot, setHot] = useState<string | null>(null);
  const hover = (key: string) => (on: boolean) => setHot((current) => (on ? key : current === key ? null : current));
  return (
    <div className={hot ? "reading has-hot" : "reading"}>
      <div>
        <h1 className="reading-intro">Books I’ve read.</h1>
        {/* Covers carry the same names for screen readers, so the visual list is hidden from them. */}
        <ul className="reading-titles" aria-hidden="true">
          {books.map((book) => {
            const key = bookKey(book);
            return (
              <li key={key} className={hot === key ? "reading-title is-hot" : "reading-title"} onPointerEnter={() => hover(key)(true)} onPointerLeave={() => hover(key)(false)}>
                {book.title}
              </li>
            );
          })}
        </ul>
      </div>
      <ul className="reading-covers">
        {books.map((book) => {
          const key = bookKey(book);
          return <Cover key={key} book={book} hot={hot === key} onHover={hover(key)} />;
        })}
      </ul>
    </div>
  );
}
