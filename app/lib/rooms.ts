/** Rooms live behind the work, in this order. A doorway shows only when its room has something published. */
export const ROOMS = ["bookshelf", "notes"] as const;
export type Room = (typeof ROOMS)[number];

export function visibleRooms(has: { books: boolean; notes: boolean }): Room[] {
  return ROOMS.filter((room) => (room === "bookshelf" ? has.books : has.notes));
}
