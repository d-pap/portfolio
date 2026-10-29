import "./eval-coverage.css";

/**
 * What each development evaluation asks, with how many cases the 2026-09-21 combined run selected. Counts only: whether
 * results can be published from the ongoing study is undecided, so nothing here says what passed.
 */
const AREAS = [
  { area: "Software behavior", question: "Does each request receive the intended context?", cases: "442 tests, 5 live" },
  { area: "Retrieval and answers", question: "Does the reply stay within the retrieved evidence?", cases: "28 cases" },
  { area: "Summaries and routing", question: "Does a correction survive into a fresh conversation?", cases: "65 cases" },
  { area: "Coaching inferences", question: "Does a rejected interpretation stop shaping replies?", cases: "20 cases" },
  { area: "Safety", question: "Does the reply follow the required response behavior?", cases: "20 cases" },
];

export function EvalCoverage() {
  return (
    <figure className="fig fig-coverage">
      <figcaption className="label fig-caption">development evaluation coverage [selected cases, 2026-09-21]</figcaption>
      <dl className="coverage">
        {AREAS.map(({ area, question, cases }) => (
          <div key={area} className="coverage-row">
            <dt>{area}</dt>
            <dd className="coverage-question">{question}</dd>
            <dd className="label coverage-cases">{cases}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
