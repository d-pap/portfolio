import type { CSSProperties } from "react";
import { socialLinks } from "app/config";
import { Arrow } from "app/components/arrow";
import { roomsContent } from "app/lib/notion/rooms";
import { visibleRooms } from "app/lib/rooms";
import { laterDate, lastUpdated } from "app/lib/updated";
import { CopyEmail } from "./copy-email";
import "./back-plane.css";

/** The lime plane under every front page: the doorways to the person behind the work, and how to reach him. */
export async function BackPlane() {
  const content = await roomsContent();
  const rooms = visibleRooms({ books: content.books, notes: content.notes });
  const updated = laterDate(lastUpdated(), content.latestEdit);
  return (
    <footer id="back" className="back-plane">
      <div className="back-in page">
        <div className="back-main">
          <ul className="back-doors">
            {rooms.map((room) => (
              <li key={room}>
                <a className="door" data-room={room} href={`/${room}`} style={{ "--door": `door-${room}` } as CSSProperties}>
                  <span className="door-word door-type">{room}</span>
                </a>
              </li>
            ))}
          </ul>
          <ul className="back-links">
            <li><a href={socialLinks.github} target="_blank" rel="noreferrer">github<Arrow /></a></li>
            <li><a href={socialLinks.linkedin} target="_blank" rel="noreferrer">linkedin<Arrow /></a></li>
          </ul>
        </div>
        <div className="back-side">
          <div>
            <p className="label back-ask">have something in mind?</p>
            <CopyEmail href={socialLinks.email} address="hello@derekpap.com" />
          </div>
          {updated && <p className="label back-updated">updated {updated}</p>}
        </div>
      </div>
    </footer>
  );
}
