export type NoteMeasure = { n: number; anchor: number; collapsed: number; expanded: number };

export const NOTE_GAP = 22;

/** Top offset that centers a note's first text line on the claim's line box. */
export function anchorFor(line: { top: number; bottom: number }, noteLineHeight = 20): number {
  return line.top + (line.bottom - line.top - noteLineHeight) / 2;
}

/**
 * Places every note beside its claim unless the note above needs the room.
 * Heights come from the final state (only `active` expanded), never from a
 * mid-transition measurement, so switching notes can't aim at stale positions.
 */
export function layoutNotes(notes: readonly NoteMeasure[], active: number | null, gap = NOTE_GAP): { tops: Map<number, number>; height: number } {
  const tops = new Map<number, number>();
  let bottom = -Infinity;
  for (const note of [...notes].sort((a, b) => a.n - b.n)) {
    const top = Math.max(0, note.anchor, bottom + gap);
    tops.set(note.n, top);
    bottom = top + (note.n === active ? note.expanded : note.collapsed);
  }
  return { tops, height: notes.length ? bottom : 0 };
}
