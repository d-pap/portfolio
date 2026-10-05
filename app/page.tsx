import { getIndex } from "app/lib/content";

export default function Home() {
  const { main, earlier } = getIndex();
  return (
    <div className="page">
      <ul>
        {[...main, ...earlier].map((entry) => (
          <li key={entry.slug}><a className="text-link" href={`/work/${entry.slug}`}>{entry.shortTitle}</a> · {entry.summary}</li>
        ))}
      </ul>
    </div>
  );
}
