import type { CSSProperties } from "react";
import { Arrow } from "app/components/arrow";
import { CustomMDX } from "app/components/mdx";
import { CaseHeroStage } from "app/components/case/case-hero-stage";
import { CaseSidebar } from "app/components/case/case-sidebar";
import { Media } from "app/components/media/media";
import { caseLinks, splitLede } from "app/lib/case";
import { listHeadings } from "app/lib/headings";
import type { Entry } from "app/lib/entries";
import "./case.css";

export function CaseLayout({
  entry,
  previous,
  next,
}: {
  entry: Entry;
  previous?: Entry;
  next?: Entry;
}) {
  const { lede, rest } = splitLede(entry.body);
  const { links, note } = caseLinks(entry);
  const sections = listHeadings(entry.body);

  return (
    <article
      className="case page ascii-case"
      style={{ "--vt": `entry-${entry.slug}` } as CSSProperties}
    >
      {entry.hero && (
        <figure className="case-hero" id="case-hero">
          <CaseHeroStage
            hasRecording={Boolean(entry.hero.recording)}
            composition={entry.hero.type === "composition"}
            aspectRatio={entry.hero.aspectRatio}
          >
            <Media
              hero={entry.hero}
              label={entry.hero.caption ?? entry.title}
              sizes="(max-width: 1600px) 96vw, 1560px"
              priority
            />
          </CaseHeroStage>
        </figure>
      )}
      <div className="case-body">
        <CaseSidebar title={entry.title} sections={sections} />
        <div className="case-main" id="overview">
          {lede && (
            <div className="case-lede">
              <CustomMDX source={lede} />
            </div>
          )}
          <dl className="case-facts">
            <div>
              <dt>Role</dt>
              <dd>{entry.role}<span className="case-period">{entry.period}</span></dd>
            </div>
            <div>
              <dt>With</dt>
              <dd>{entry.context}</dd>
            </div>
            {entry.stack && (
              <div className="case-fact-stack">
                <dt>{entry.kind === "role" ? "Tools" : "Stack"}</dt>
                <dd>{entry.stack}</dd>
              </div>
            )}
          </dl>
          {(links.length > 0 || note) && (
            <ul className="case-links">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}<Arrow />
                  </a>
                </li>
              ))}
              {note && <li className="case-links-note">{note}</li>}
            </ul>
          )}
          {rest && (
            <div className="case-flow">
              <CustomMDX source={rest} />
            </div>
          )}
          <nav className="case-pagination" aria-label="Browse projects">
            {previous && (
              <a href={`/work/${previous.slug}`}>previous: {previous.shortTitle}</a>
            )}
            {next && (
              <a href={`/work/${next.slug}`}>next: {next.shortTitle}<Arrow diagonal={false} /></a>
            )}
          </nav>
        </div>
      </div>
    </article>
  );
}
