"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "./theme-switch";
import "./site-header.css";

export function SiteHeader() {
  const pathname = usePathname();
  const away = pathname !== "/";

  // Going back (instead of loading "/") restores the home scroll position
  // and plays the view transition in reverse.
  function close(event: MouseEvent<HTMLAnchorElement>) {
    if (!document.referrer) return;
    const from = new URL(document.referrer);
    if (from.origin === window.location.origin && from.pathname === "/" && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  }

  return (
    <header className="masthead">
      <div className="masthead-in page">
        <div className="masthead-main">
          <a className="masthead-name" href="/">Derek Papierski</a>
          <span className="masthead-role">AI &amp; software engineer</span>
        </div>
        <div className="masthead-side">
          <span className="masthead-location">Michigan</span>
          <span className="masthead-controls">
            <ThemeSwitch />
            {away && (
              <a className="masthead-close" href="/" onClick={close} aria-label="Close and return home">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="m4 4 12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </a>
            )}
          </span>
        </div>
      </div>
    </header>
  );
}
