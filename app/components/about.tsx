import { socialLinks } from "app/config";
import { getHomeSource, getReading } from "app/lib/content";
import { Arrow } from "./arrow";
import { CustomMDX } from "./mdx";
import "./about.css";

export function About() {
  const hasReading = getReading().length > 0;
  return (
    <section className="about" aria-labelledby="about-heading">
      <h1 className="visually-hidden">Derek Papierski</h1>
      <div className="about-text">
        <h2 id="about-heading" className="label about-label">about</h2>
        <CustomMDX source={getHomeSource()} />
      </div>
      <div className="about-links">
        <h2 className="label about-label">links</h2>
        <ul>
          {hasReading && <li><a href="/reading">reading</a></li>}
          <li><a href={socialLinks.email}>email<Arrow /></a></li>
          <li><a href={socialLinks.linkedin} target="_blank" rel="noreferrer">linkedin<Arrow /></a></li>
          <li><a href={socialLinks.github} target="_blank" rel="noreferrer">github<Arrow /></a></li>
        </ul>
      </div>
    </section>
  );
}
