"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useCitations } from "./context";

export function Claim({ n, children }: { n: number; children: ReactNode }) {
  const api = useCitations();
  const open = api.active === n;

  function onKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      api.key(n);
    }
  }

  return (
    <span
      role="button"
      tabIndex={0}
      className={open ? "claim is-open" : "claim"}
      data-n={n}
      aria-expanded={open}
      aria-controls={`note-${n}`}
      ref={(el) => api.registerClaim(n, el)}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") api.enter(n); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") api.leave(); }}
      onPointerDown={(event) => api.pointerDown(event.pointerType)}
      onClick={() => api.press(n)}
      onFocus={(event) => api.focus(n, event.currentTarget)}
      onKeyDown={onKeyDown}
    >
      <span className="claim-phrase">{children}</span>
      <sup className="claim-marker" aria-hidden="true">{n}</sup>
    </span>
  );
}
