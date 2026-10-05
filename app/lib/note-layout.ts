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

/** Height that fits every normal open state, so the page below never moves. */
export function reserveHeight(notes: readonly NoteMeasure[], gap = NOTE_GAP): number {
  if (notes.length === 0) return 0;
  return Math.max(...[null, ...notes.map((note) => note.n)].map((k) => layoutNotes(notes, k, gap).height));
}

/** Anchor for a note opened by hovering it: where the pointer found it, but never past the reserve. */
export function heldAnchor(notes: readonly NoteMeasure[], n: number, lastTop: number, reserve: number, gap = NOTE_GAP): number {
  const held = notes.find((note) => note.n === n);
  if (!held) throw new Error(`no note ${n}`);
  const tail = notes.filter((note) => note.n > n).reduce((sum, note) => sum + gap + note.collapsed, 0);
  return Math.min(lastTop, reserve - held.expanded - tail);
}
