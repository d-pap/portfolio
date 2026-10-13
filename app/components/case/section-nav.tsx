"use client";

import { useEffect, useState } from "react";
import { currentSection } from "app/lib/current-section";
import type { Heading } from "app/lib/headings";

/** A section counts as current once its heading is within this many px of the viewport top. Phones start lower: the
 * header and the context bar already cover the first 96px there. */
const CURRENT_LINE = 140;
const PHONE_CURRENT_LINE = 200;

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
      const line = window.innerWidth < 900 ? PHONE_CURRENT_LINE : CURRENT_LINE;
      setActive(currentSection(headings, { line, height: window.innerHeight, atBottom, hash: window.location.hash }));
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
export function ContextBar({ title, summary, sections }: { title: string; summary: string; sections: Heading[] }) {
  const [shown, setShown] = useState(false);
  const active = useCurrentSection(sections);
  const section = sections.find(({ id }) => id === active)?.text ?? "overview";

  // The browser's jump to a #section on load stays instant; smooth scrolling starts with the next click.
  useEffect(() => {
    const frame = requestAnimationFrame(() => document.documentElement.classList.add("smooth-scroll"));
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("smooth-scroll");
    };
  }, []);

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
      <span className="label case-context-section">{section}</span>
    </a>
  );
}
