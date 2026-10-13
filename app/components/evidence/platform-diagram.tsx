import "./evidence.css";

export function PlatformDiagram() {
  return (
    <svg
      className="diagram"
      viewBox="0 0 300 202"
      role="img"
      aria-label="RENEW's platform. The mobile app talks to a PHP API that handles sign-in and stores app data in MySQL. The API sends each participant's context to Sprout, the AI coach, and serves lesson media through a proxy."
    >
      <path className="r-line" d="M150 122V130Q150 138 142 138H58Q50 138 50 146V156" />
      <path className="r-line" d="M150 122V130Q150 138 158 138H242Q250 138 250 146V156" />
      <path className="r-acc" d="M150 46V80" />
      <path className="r-acc" d="M150 122V156" />

      <rect className="r-box" x="95" y="4" width="110" height="42" rx="7" />
      <text x="150" y="17">mobile app</text>
      <text className="r-sub" x="150" y="34">react native</text>
      <rect className="r-box r-box-acc" x="95" y="80" width="110" height="42" rx="7" />
      <text x="150" y="93">api</text>
      <text className="r-sub" x="150" y="110">php · auth</text>
      <rect className="r-box" x="5" y="156" width="90" height="42" rx="7" />
      <text x="50" y="169">mysql</text>
      <text className="r-sub" x="50" y="186">app data</text>
      <rect className="r-box r-box-acc" x="105" y="156" width="90" height="42" rx="7" />
      <text x="150" y="169">sprout</text>
      <text className="r-sub" x="150" y="186">user context</text>
      <rect className="r-box" x="205" y="156" width="90" height="42" rx="7" />
      <text x="250" y="169">media proxy</text>
      <text className="r-sub" x="250" y="186">lesson media</text>
    </svg>
  );
}
