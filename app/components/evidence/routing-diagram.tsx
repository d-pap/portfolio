import "./evidence.css";

export function RoutingDiagram() {
  return (
    <svg
      className="routing"
      viewBox="0 0 300 294"
      role="img"
      aria-label="How Sprout handles a message. Each message is classified first. Messages that need evidence go through search, then reranking, and the reply cites its sources. Conversational messages are answered from the conversation."
    >
      <path className="r-line" d="M150 34V56" />
      <path className="r-line" d="M150 86V90Q150 98 158 98H217Q225 98 225 106V128" />
      <path className="r-line" d="M225 170V232Q225 240 217 240H158Q150 240 150 248" />
      <path className="r-acc" d="M150 86V90Q150 98 142 98H83Q75 98 75 106V128" />
      <path className="r-acc" d="M75 170V192" />
      <path className="r-acc" d="M75 222V232Q75 240 83 240H142Q150 240 150 248" />

      <rect className="r-box" x="95" y="4" width="110" height="30" rx="7" />
      <text x="150" y="19">message</text>
      <rect className="r-box" x="95" y="56" width="110" height="30" rx="7" />
      <text x="150" y="71">classify</text>
      <rect className="r-box r-box-acc" x="10" y="128" width="130" height="42" rx="7" />
      <text x="75" y="141">search</text>
      <text className="r-sub" x="75" y="158">vector + keyword</text>
      <rect className="r-box r-box-acc" x="10" y="192" width="130" height="30" rx="7" />
      <text x="75" y="207">rerank</text>
      <rect className="r-box" x="160" y="128" width="130" height="42" rx="7" />
      <text x="225" y="141">reply from</text>
      <text className="r-sub" x="225" y="158">conversation</text>
      <rect className="r-box r-box-acc" x="95" y="248" width="110" height="42" rx="7" />
      <text x="150" y="261">reply</text>
      <text className="r-sub" x="150" y="278">cites sources</text>
    </svg>
  );
}
