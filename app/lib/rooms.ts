/** Rooms live behind the work, in this order. A doorway shows only when its room has content. */
export const ROOMS = ["bookshelf", "desk"] as const;
export type Room = (typeof ROOMS)[number];

export function visibleRooms(has: { books: boolean; desk: boolean }): Room[] {
  return ROOMS.filter((room) => (room === "bookshelf" ? has.books : has.desk));
}
