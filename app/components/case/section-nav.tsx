"use client";

import { useEffect, useState } from "react";
import type { Heading } from "app/lib/headings";

/** A section counts as current once its heading is within this many px of the viewport top. */
const CURRENT_LINE = 140;

export function SectionNav({ sections }: { sections: Heading[] }) {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = "overview";
      for (const { id } of sections) {
        const heading = document.getElementById(id);
        if (heading && heading.getBoundingClientRect().top <= CURRENT_LINE) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <nav className="case-sections" aria-label="sections">
      <ul>
        {[{ id: "overview", text: "overview" }, ...sections].map(({ id, text }) => (
          <li key={id}>
            <a href={`#${id}`} className={active === id ? "is-active" : undefined} aria-current={active === id ? "location" : undefined}>
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Under 900px the identity block scrolls away; this bar keeps the product on screen and returns to the overview. */
export function ContextBar({ title, summary }: { title: string; summary: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const identity = document.querySelector("[data-case-id]");
    if (!identity) return;
    const observer = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(identity);
    return () => observer.disconnect();
  }, []);

  return (
    <a className={shown ? "case-context is-shown" : "case-context"} href="#overview" aria-hidden={!shown} tabIndex={shown ? undefined : -1}>
      <span>{title}</span>
      <span className="case-context-summary">{summary}</span>
    </a>
  );
}
