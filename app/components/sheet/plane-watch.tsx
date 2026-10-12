"use client";

import { useEffect } from "react";

/** Toggles `at-end` on <html> while the sheet's bottom edge is on screen. One observer, no scroll listener. */
export function PlaneWatch() {
  useEffect(() => {
    const end = document.querySelector(".sheet-end");
    if (!end) return;
    const root = document.documentElement;
    const observer = new IntersectionObserver(([entry]) => {
      root.classList.toggle("at-end", entry.isIntersecting || entry.boundingClientRect.top < 0);
    });
    observer.observe(end);
    return () => {
      observer.disconnect();
      root.classList.remove("at-end");
    };
  }, []);
  return null;
}
