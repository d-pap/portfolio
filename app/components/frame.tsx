"use client";

import type { CSSProperties, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import "./frame.css";

const FRONT = /^\/($|work\/)/;

/**
 * The same small masthead on every page. Every navigation is a full page load, so it "stays put" because it
 * carries the view-transition name `frame` (frame.css): the browser sees the same box before and after.
 */
export function Frame({ plane }: { plane: "front" | "back" }) {
  const pathname = usePathname();
  const away = pathname !== "/";

  // Going back (instead of loading a new page) restores where the visitor was, so leaving a room returns to the
  // footer they came from and leaving a project returns to its place in the grid. A project reached from another
  // project's "next" link goes home instead; Back would land at the bottom of the previous one.
  function close(event: MouseEvent<HTMLAnchorElement>) {
    if (!document.referrer) return;
    const from = new URL(document.referrer);
    const cameFrom = plane === "back" ? FRONT.test(from.pathname) : from.pathname === "/";
    if (from.origin === window.location.origin && cameFrom && from.pathname !== window.location.pathname && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  }

  return (
    <header className="frame" data-plane={plane} data-enter="" style={{ "--enter-i": 0 } as CSSProperties}>
      <div className="frame-in page">
        <div className="frame-main">
          <a className="frame-name" href="/">Derek Papierski</a>
          <span className="frame-role">AI &amp; software engineer</span>
        </div>
        <div className="frame-side">
          <span className="frame-location">Michigan</span>
          {away && (
            <a className="frame-close" href="/" onClick={close} aria-label="Close and return">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="m4 4 12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
