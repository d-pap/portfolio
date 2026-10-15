import type { CSSProperties } from "react";
import { socialLinks } from "app/config";
import { getAbout } from "app/lib/content";
import "./about.css";

export function About() {
  return (
    <section className="about" aria-label="About Derek" data-enter="" style={{ "--enter-i": 1 } as CSSProperties}>
      <h1 className="visually-hidden">Derek Papierski</h1>
      <div className="about-text">
        {getAbout().map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <nav className="about-links" aria-label="Professional links">
          <a href={socialLinks.github} target="_blank" rel="noreferrer">github</a>
          <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">linkedin</a>
        </nav>
      </div>
    </section>
  );
}
