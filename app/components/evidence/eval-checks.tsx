import "./evidence.css";

const CHECKS = [
  ["retrieval", "Did the system retrieve useful sources?"],
  ["answer", "Does the reply answer the question?"],
  ["summaries", "Did a summary invent or lose a fact?"],
  ["memory", "Does a correction survive into the next conversation?"],
] as const;

export function EvalChecks() {
  return (
    <ul className="checks">
      {CHECKS.map(([key, question]) => (
        <li key={key} className="check">
          <span className="label">{key}</span>
          <span className="check-question">{question}</span>
        </li>
      ))}
    </ul>
  );
}
