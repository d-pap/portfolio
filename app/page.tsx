import { About } from "app/components/about";
import { WorkFigure, type WorkItem } from "app/components/work/work-figure";
import { getIndex } from "app/lib/content";
import type { Entry } from "app/lib/entries";
import "./home.css";

function toWorkItem(entry: Entry): WorkItem[] {
  if (!entry.hero) return [];
  const { slug, shortTitle, summary, role, context, period, hero } = entry;
  return [{ slug, shortTitle, summary, role, context, period, hero }];
}

export default function Home() {
  const { main, earlier } = getIndex();
  return (
    <div className="home page">
      <About />

      <section aria-labelledby="work-heading">
        <h2 id="work-heading" className="label home-label">work</h2>
        <div className="home-work-list">
          {main.flatMap(toWorkItem).map((item, i) => <WorkFigure key={item.slug} item={item} priority={i === 0} />)}
        </div>
      </section>

      {earlier.length > 0 && (
        <section className="home-earlier" aria-labelledby="earlier-heading">
          <h2 id="earlier-heading" className="label home-label">earlier</h2>
          <ul className="home-earlier-list">
            {earlier.map((entry) => (
              <li key={entry.slug}>
                <a className="home-earlier-row" href={`/work/${entry.slug}`}>
                  <span className="home-earlier-name">{entry.shortTitle}</span>
                  <span className="label">{entry.kind} · {entry.period}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
