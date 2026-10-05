import { socialLinks } from "app/config";
import { Arrow } from "./arrow";
import "./site-footer.css";

export function SiteFooter() {
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
          </ul>
          <p className="label">updated {updated}</p>
        </div>
      </div>
    </footer>
  );
}
