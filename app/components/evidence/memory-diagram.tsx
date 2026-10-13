import "./evidence.css";

export function MemoryDiagram() {
  return (
    <svg
      className="diagram"
      viewBox="0 0 300 246"
      role="img"
      aria-label="How Sprout remembers. Each conversation is condensed into a dated summary. Patterns inferred from those summaries are kept with a confidence and an age. The clinical summary sits beside them as the baseline, and both shape the next reply."
    >
      <path className="r-line" d="M225 170V178Q225 186 217 186H158Q150 186 150 194V200" />
      <path className="r-acc" d="M150 34V56" />
      <path className="r-acc" d="M150 98V106Q150 114 142 114H83Q75 114 75 122V128" />
      <path className="r-acc" d="M75 170V178Q75 186 83 186H142Q150 186 150 194V200" />

      <rect className="r-box" x="95" y="4" width="110" height="30" rx="7" />
      <text x="150" y="19">conversation</text>
      <rect className="r-box r-box-acc" x="95" y="56" width="110" height="42" rx="7" />
      <text x="150" y="69">summary</text>
      <text className="r-sub" x="150" y="86">dated</text>
      <rect className="r-box r-box-acc" x="10" y="128" width="130" height="42" rx="7" />
      <text x="75" y="141">patterns</text>
      <text className="r-sub" x="75" y="158">confidence · age</text>
      <rect className="r-box" x="160" y="128" width="130" height="42" rx="7" />
      <text x="225" y="141">clinical summary</text>
      <text className="r-sub" x="225" y="158">baseline</text>
      <rect className="r-box r-box-acc" x="95" y="200" width="110" height="42" rx="7" />
      <text x="150" y="213">reply</text>
      <text className="r-sub" x="150" y="230">with context</text>
    </svg>
  );
}
