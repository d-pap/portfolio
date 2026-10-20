import { socialLinks } from "app/config";

export function PortfolioFooter() {
  return (
    <footer className="portfolio-footer">
      <div className="footer-bottom">
        <nav aria-label="Social links">
          <a href={socialLinks.github} target="_blank" rel="noreferrer">
            (github)
          </a>
          <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
            (linkedin)
          </a>
        </nav>
      </div>
    </footer>
  );
}
