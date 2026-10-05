"use client";

import { createContext, useContext } from "react";

export const NoteOpenContext = createContext(false);

export function useNoteOpen(): boolean {
  return useContext(NoteOpenContext);
}
