"use client";

import { useEffect, useState } from "react";
import { currentSection } from "app/lib/current-section";
import type { Heading } from "app/lib/headings";

/** A section becomes current as its heading approaches the top of the reading area. */
const CURRENT_LINE = 140;

/** The id of the section being read: the last heading above the current line, or overview before the first. */
function useCurrentSection(sections: Heading[]): string {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const headings = sections.flatMap(({ id }) => {
        const heading = document.getElementById(id);
        return heading ? [{ id, top: heading.getBoundingClientRect().top }] : [];
      });
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActive(currentSection(headings, { line: CURRENT_LINE, height: window.innerHeight, atBottom, hash: window.location.hash }));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      cancelAnimationFrame(frame);
    };
  }, [sections]);

  return active;
}

export function SectionNav({ sections }: { sections: Heading[] }) {
  const active = useCurrentSection(sections);

  return (
    <nav className="case-sections" aria-label="Project sections">
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
