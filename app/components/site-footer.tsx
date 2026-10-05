import { socialLinks } from "app/config";
import { getReading } from "app/lib/content";
import { Arrow } from "./arrow";
import "./site-footer.css";

export function SiteFooter() {
  const hasReading = getReading().length > 0;
  const updated = new Date().toISOString().slice(0, 10);
  return (
    <footer className="colophon page">
      <div className="colophon-in">
        <div>
          <p className="colophon-ask">have something in mind?</p>
          <a className="text-link" href={socialLinks.email}>derek@derekpapierski.com</a>
        </div>
        <div className="colophon-side">
          <ul className="colophon-links">
            <li><a className="text-link" href={socialLinks.github} target="_blank" rel="noreferrer">github<Arrow /></a></li>
            <li><a className="text-link" href={socialLinks.linkedin} target="_blank" rel="noreferrer">linkedin<Arrow /></a></li>
            {hasReading && <li><a className="text-link" href="/reading">reading</a></li>}
          </ul>
          <p className="label">updated {updated}</p>
        </div>
      </div>
    </footer>
  );
}
