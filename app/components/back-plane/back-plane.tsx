import type { CSSProperties } from "react";
import { roomsContent } from "app/lib/notion/rooms";
import { visibleRooms } from "app/lib/rooms";
import { laterDate, lastUpdated } from "app/lib/updated";
import "./back-plane.css";

/** The lime plane under every front page: the doorways to the person behind the work, revealed after the work. */
export async function BackPlane() {
  const content = await roomsContent();
  const rooms = visibleRooms({ books: content.books, notes: content.notes });
  const updated = laterDate(lastUpdated(), content.latestEdit);
  return (
    <footer id="back" className="back-plane" suppressHydrationWarning>
      <div className="back-in page">
        <div className="back-main">
          <ul className="back-doors">
            {rooms.map((room) => (
              <li key={room}>
                <a className="door" data-room={room} href={`/${room}`} style={{ "--door": `door-${room}` } as CSSProperties}>
                  {/* trip.js marks the words that stay put (view-transition-name: none) as the page is revealed, which can
                      be before React hydrates. */}
                  <span className="door-word door-type" suppressHydrationWarning>{room}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="back-side">
          {updated && <p className="label back-updated">updated {updated}</p>}
        </div>
      </div>
    </footer>
  );
}
