"use client";

import { useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { metaData, socialLinks } from "app/config";
import "./frame.css";

export function Frame({ plane }: { plane: "front" | "back" }) {
  const pathname = usePathname();
  const [infoOpen, setInfoOpen] = useState(false);
  const away = pathname !== "/";
  function close(event: MouseEvent<HTMLAnchorElement>) {
    if (!document.referrer) return;
    const from = new URL(document.referrer);
    if (
      from.origin === location.origin &&
      from.pathname === "/" &&
      history.length > 1
    ) {
      event.preventDefault();
      history.back();
    }
  }
  return (
    <>
      <header className="frame" data-plane={plane}>
        <nav className="frame-main" aria-label="Main navigation">
          <a className="frame-name" href="/">
            Derek Papierski
          </a>
          <button
            type="button"
            popoverTarget="info-panel"
            popoverTargetAction="toggle"
            aria-expanded={infoOpen}
            aria-controls="info-panel"
          >
            (info)
          </button>
          <a href={away ? "/#projects" : "#projects"}>(projects)</a>
        </nav>
        <div className="frame-side">
          {away && (
            <a href="/#projects" onClick={close}>
              (back)
            </a>
          )}
          <a href={socialLinks.email}>(email me)</a>
        </div>
      </header>
      <div
        id="info-panel"
        popover="auto"
        className="info-panel"
        onToggle={(event) =>
          setInfoOpen(event.currentTarget.matches(":popover-open"))
        }
        aria-labelledby="info-title"
        onClick={(event) => {
          // The translucent area outside the copy is a dismissal surface.
          if (event.target === event.currentTarget) event.currentTarget.hidePopover();
        }}
      >
        <button
          type="button"
          className="info-close"
          popoverTarget="info-panel"
          popoverTargetAction="hide"
        >
          (close)
        </button>
        <div className="info-content">
          <h2 id="info-title" className="visually-hidden">
            About Derek
          </h2>
          <p>{metaData.description}</p>
          <p>
            Outside of work, I carve and build things out of wood, mostly by
            hand. I read a lot, usually more than one book at a time.
          </p>
          <nav className="info-pages" aria-label="Personal pages">
            <a href="/notes">(notes)</a>
            <a href="/bookshelf">(bookshelf)</a>
          </nav>
          <div className="info-links">
            <a href={socialLinks.email}>hello@derekpap.com</a>
            <a href={socialLinks.github} target="_blank" rel="noreferrer">
              github ↗
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
              linkedin ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
