import type { BookStatus, NoteCategory } from "./schema.ts";

/** A validated Notion page, before anything is looked up or mirrored. `cover` is the Cover file's URL as Notion gives it. */
export type BookRecord = {
  id: string; url: string; title: string; author: string; isbn: string | null; status: BookStatus;
  date: string | null; createdTime: string; lastEditedTime: string;
  year: number | null; description: string | null; cover: string | null; slug: string | null;
};
export type NoteRecord = {
  id: string; url: string; title: string; category: NoteCategory | null; date: string | null;
  createdTime: string; lastEditedTime: string; slug: string | null;
};

/** What the rooms render. */
export type BookEntry = {
  id: string; slug: string; title: string; author: string; isbn: string | null; status: BookStatus;
  date: string | null; createdTime: string; lastEditedTime: string;
  year: number | null; cover: string | null;
  description: { text: string; source: "notion" | "google books" | "open library" } | null;
};
export type NoteEntry = {
  id: string; slug: string; title: string; category: NoteCategory | null; date: string;
  createdTime: string; lastEditedTime: string;
};
