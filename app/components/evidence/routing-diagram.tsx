"use client";

import type { CSSProperties } from "react";
import { useNoteOpen } from "./note-open";
import "./evidence.css";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

export function RoutingDiagram({ animate = false }: { animate?: boolean }) {
  const open = useNoteOpen();
  const draw = !animate ? "static" : open ? "on" : "off";
  return (
    <svg
      className="routing"
      data-draw={draw}
      viewBox="0 0 300 346"
      role="img"
      aria-label="How Sprout handles a message. Each message is classified first. Messages that need evidence go through search, then reranking, and the reply cites its sources. Conversational messages are answered from the conversation."
    >
      <path className="r-line" d="M150 38V66" />
      <path className="r-line" d="M150 100V112Q150 120 158 120H217Q225 120 225 128V152" />
      <path className="r-line" d="M225 198V274Q225 282 217 282H158Q150 282 150 290V296" />
      <path className="r-acc" style={step(0)} pathLength={1} d="M150 100V112Q150 120 142 120H83Q75 120 75 128V152" />
      <path className="r-acc" style={step(1)} pathLength={1} d="M75 198V226" />
      <path className="r-acc" style={step(2)} pathLength={1} d="M75 260V274Q75 282 83 282H142Q150 282 150 290V296" />

      <rect className="r-box" x="95" y="4" width="110" height="34" rx="7" />
      <text x="150" y="21">message</text>
      <rect className="r-box" x="95" y="66" width="110" height="34" rx="7" />
      <text x="150" y="83">classify</text>
      <rect className="r-box r-box-acc" style={step(0)} x="10" y="152" width="130" height="46" rx="7" />
      <text x="75" y="167">search</text>
      <text className="r-sub" x="75" y="185">vector + keyword</text>
      <rect className="r-box r-box-acc" style={step(1)} x="10" y="226" width="130" height="34" rx="7" />
      <text x="75" y="243">rerank</text>
      <rect className="r-box" x="160" y="152" width="130" height="46" rx="7" />
      <text x="225" y="167">reply from</text>
      <text className="r-sub" x="225" y="185">conversation</text>
      <rect className="r-box r-box-acc" style={step(2)} x="95" y="296" width="110" height="46" rx="7" />
      <text x="150" y="311">reply</text>
      <text className="r-sub" x="150" y="329">cites sources</text>
    </svg>
  );
}
