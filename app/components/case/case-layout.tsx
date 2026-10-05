import type { CSSProperties } from "react";
import { Arrow } from "app/components/arrow";
import { CustomMDX } from "app/components/mdx";
import { CaseHeroStage } from "app/components/case/case-hero-stage";
import { Media } from "app/components/media/media";
import { caseLinks, splitLede } from "app/lib/case";
import type { Entry } from "app/lib/entries";
import "./case.css";

export function CaseLayout({ entry, next }: { entry: Entry; next?: Entry }) {
  const { lede, rest } = splitLede(entry.body);
  const { links, note } = caseLinks(entry);
  const facts: [string, string][] = [
    ["role", entry.role],
    ["with", entry.context],
    ["when", entry.period],
  ];
  if (entry.stack) facts.push([entry.kind === "role" ? "tools" : "stack", entry.stack]);
  const style = { "--tint": entry.tint, "--tint-dark": entry.tintDark, "--vt": `entry-${entry.slug}` } as CSSProperties;

  return (
    <article className="case page" style={style}>
      {entry.hero ? (
        <figure className="case-hero">
          <CaseHeroStage hasRecording={Boolean(entry.hero.recording)} label={entry.shortTitle}>
            <Media hero={entry.hero} label={entry.hero.caption ?? entry.title} sizes={entry.hero.type === "phones" ? "(max-width: 899px) 30vw, 30vh" : "(max-width: 899px) 90vw, 95vh"} priority />
          </CaseHeroStage>
          {entry.hero.caption && <figcaption className="label case-hero-caption">{entry.hero.caption}</figcaption>}
        </figure>
      ) : (
        <div className="case-hero">
          <div className="case-hero-stage case-hero-text" aria-hidden="true">
            <span className="case-wordmark">{entry.shortTitle}</span>
          </div>
        </div>
      )}

      <div className="case-body">
        <div className="case-id">
          <h1 className="case-title">{entry.title}</h1>
          <p className="label case-subtitle">{entry.area} · {entry.context}</p>
          {(links.length > 0 || note) && (
            <ul className="case-links">
              {links.map((link) => (
                <li key={link.href}><a className="text-link" href={link.href} target="_blank" rel="noreferrer">{link.label}<Arrow /></a></li>
              ))}
              {note && <li className="case-links-note">{note}</li>}
            </ul>
          )}
        </div>

        <div className="case-main">
          {lede && <div className="case-lede"><CustomMDX source={lede} /></div>}
          <dl className="case-facts">
            {facts.map(([name, value]) => (
              <div key={name}><dt className="label">{name}</dt><dd>{value}</dd></div>
            ))}
          </dl>
          {rest && <div className="case-flow"><CustomMDX source={rest} /></div>}
          {next && (
            <a className="case-next text-link" href={`/work/${next.slug}`}>next: {next.shortTitle}<Arrow diagonal={false} /></a>
          )}
        </div>
      </div>
    </article>
  );
}
