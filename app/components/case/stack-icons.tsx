"use client";

import { useState } from "react";

/** The stack as a row of logos. Pointing at one names it in the line below; the facts row lists every tool in words. */
export function StackIcons({ logos }: { logos: { name: string; path: string }[] }) {
  const [name, setName] = useState("");
  return (
    <div className="case-stack">
      <ul className="case-stack-row" aria-label="stack">
        {logos.map((logo) => (
          <li key={logo.name} onMouseEnter={() => setName(logo.name)} onMouseLeave={() => setName("")}>
            <svg viewBox="0 0 24 24" role="img" aria-label={logo.name}><path d={logo.path} /></svg>
          </li>
        ))}
      </ul>
      <p className="label case-stack-name" aria-hidden="true">{name.toLowerCase()}</p>
    </div>
  );
}
