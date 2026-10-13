import type { CSSProperties, ReactNode } from "react";
import type { Room } from "app/lib/rooms";
import "./room.css";

/** A page behind the work. Its title is the doorway word the visitor clicked, carried here by the trip. */
export function RoomLayout({ room, children }: { room: Room; children: ReactNode }) {
  return (
    <div className="room-page page" style={{ "--door": `door-${room}` } as CSSProperties}>
      {/* Holds the first paint until the title exists, so the flying word always has somewhere to land.
          `blocking` isn't in React's types yet, hence the spread (same as case-layout.tsx). */}
      <link rel="expect" href="#room-title" {...{ blocking: "render" }} />
      <h1 id="room-title" className="room-title door-type" data-enter="" style={{ "--enter-i": 1 } as CSSProperties}>{room}</h1>
      <div className="room-body" data-enter="" style={{ "--enter-i": 2 } as CSSProperties}>{children}</div>
    </div>
  );
}
