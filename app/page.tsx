import { About } from "app/components/about";
import { WorkGrid } from "app/components/work/work-grid";
import { getGrid, getIndex } from "app/lib/content";
import "./home.css";

export default function Home() {
  const { earlier } = getIndex();
  return (
    <div className="home page">
      <About />

      <section aria-labelledby="work-heading">
        <h2 id="work-heading" className="label home-label">work</h2>
        <WorkGrid grid={getGrid()} />
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
