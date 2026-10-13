/**
 * One saved development case, shown on the Sprout page as a question traveling through the system. Q01 is a public
 * question from the evaluation set, run as a fresh synthetic user (sprout-api evaluations, 2026-10-05_154010_060619
 * _retrieval). No scores or relevance grades are carried here.
 */
export type QuestionTrace = {
  id: string;
  date: string;
  question: string;
  intent: string;
  search: string;
  /** How many passages hybrid search returned, and from how many documents. */
  candidates: number;
  candidateDocuments: number;
  /** The passages reranking kept, in rank order: their place among the candidates and the supplied document they're from. */
  passages: { candidate: number; source: number; chunk: number; heading: string }[];
  sources: string[];
  /** Source numbers the reply cites. */
  cited: number[];
  replyWords: number;
};

export const Q01: QuestionTrace = {
  id: "Q01",
  date: "2026-10-05",
  question: "Can you have scleroderma antibodies before developing symptoms, and how long before symptoms typically appear?",
  intent: "health_query",
  search: "presence of scleroderma (systemic sclerosis) antibodies before symptom onset and typical time interval before clinical symptoms appear",
  candidates: 20,
  candidateDocuments: 5,
  passages: [
    { candidate: 1, source: 1, chunk: 62, heading: "Autoantibody tests" },
    { candidate: 4, source: 2, chunk: 10, heading: "Disease subsets" },
    { candidate: 8, source: 3, chunk: 15, heading: "Autoantibody patterns" },
    { candidate: 17, source: 1, chunk: 32, heading: "Raynaud phenomenon" },
  ],
  sources: ["Systemic Sclerosis (Scleroderma)", "Drug Treatment of Scleroderma, Springer Nature", "Advances in pathogenesis and treatment of systemic sclerosis"],
  cited: [1, 2],
  replyWords: 96,
};

/** What the figure states: candidates searched, passages kept, the documents they came from, and how many the reply cites. */
export function traceCounts(trace: QuestionTrace) {
  return {
    candidates: trace.candidates,
    passages: trace.passages.length,
    documents: new Set(trace.passages.map((passage) => passage.source)).size,
    cited: trace.cited.length,
  };
}
