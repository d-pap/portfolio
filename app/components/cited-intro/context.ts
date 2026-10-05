"use client";

import { createContext, useContext } from "react";

export type CitationApi = {
  active: number | null;
  enter(n: number): void;
  enterNote(n: number): void;
  leave(): void;
  pointerDown(type: string): void;
  focus(n: number, el: HTMLElement): void;
  press(n: number): void;
  key(n: number): void;
  registerClaim(n: number, el: HTMLElement | null): void;
  registerNote(n: number, el: HTMLElement | null): void;
};

export const CitationContext = createContext<CitationApi | null>(null);

export function useCitations(): CitationApi {
  const api = useContext(CitationContext);
  if (!api) throw new Error("<Claim> and <Note> must be rendered inside <CitedIntro>");
  return api;
}
