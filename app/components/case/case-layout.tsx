import type { CSSProperties } from "react";
import { Arrow } from "app/components/arrow";
import { CustomMDX } from "app/components/mdx";
import { CaseHeroStage } from "app/components/case/case-hero-stage";
import { ContextBar, SectionNav } from "app/components/case/section-nav";
import { Media } from "app/components/media/media";
import { caseLinks, splitLede } from "app/lib/case";
import { stackLogos } from "app/lib/stack-logos";
import { StackIcons } from "app/components/case/stack-icons";
import { listHeadings } from "app/lib/headings";
import type { Entry } from "app/lib/entries";
import "./case.css";

export function CaseLayout({ entry, next }: { entry: Entry; next?: Entry }) {
  const { lede, rest } = splitLede(entry.body);
  const { links, note } = caseLinks(entry);
  const sections = listHeadings(entry.body);
  const logos = entry.stack ? stackLogos(entry.stack) : [];
  const facts: [string, string][] = [
    ["role", entry.role],
    ["with", entry.context],
    ["when", entry.period],
  ];
  if (entry.stack) facts.push([entry.kind === "role" ? "tools" : "stack", entry.stack]);
  const style = { "--vt": `entry-${entry.slug}` } as CSSProperties;

  return (
    <article className="case page" style={style}>
      {/* Holds the first paint until the hero is parsed. On a first visit the page could otherwise paint
          before the hero exists, and the tile fades out instead of morphing into it. React hoists this to <head>;
          `blocking` isn't in React's types yet, hence the spread. */}
      <link rel="expect" href="#case-hero" {...{ blocking: "render" }} />
      <ContextBar title={entry.shortTitle} summary={entry.summary} sections={sections} />
      {entry.hero ? (
        <figure className="case-hero" id="case-hero" data-enter="" style={{ "--enter-i": 1 } as CSSProperties}>
          <CaseHeroStage hasRecording={Boolean(entry.hero.recording)} composition={entry.hero.type === "composition"} aspectRatio={entry.hero.type === "composition" ? entry.hero.aspectRatio : undefined}>
            <Media hero={entry.hero} label={entry.hero.caption ?? entry.title} sizes={entry.hero.type === "phones" ? "(max-width: 899px) 30vw, 30vh" : "(max-width: 899px) 90vw, 95vh"} priority />
          </CaseHeroStage>
        </figure>
      ) : (
        <div className="case-hero" id="case-hero" data-enter="" style={{ "--enter-i": 1 } as CSSProperties}>
          <div className="case-hero-stage case-hero-text stage" aria-hidden="true">
            <span className="case-wordmark">{entry.shortTitle}</span>
          </div>
        </div>
      )}

      <div className="case-body" data-enter="" style={{ "--enter-i": 2 } as CSSProperties}>
        <div className="case-id" data-case-id>
          <h1 className="case-title">{entry.title}</h1>
          <p className="label case-category">{entry.area}</p>
          {logos.length > 0 && <StackIcons logos={logos} />}
          {(links.length > 0 || note) && (
            <ul className="case-links">
              {links.map((link) => (
                <li key={link.href}><a className="text-link" href={link.href} target="_blank" rel="noreferrer">{link.label}<Arrow /></a></li>
              ))}
              {note && <li className="case-links-note">{note}</li>}
            </ul>
          )}
          {sections.length > 0 && <SectionNav sections={sections} />}
        </div>

        <div className="case-main" id="overview">
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
