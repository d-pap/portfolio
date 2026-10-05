"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { NoteOpenContext } from "app/components/evidence/note-open";
import { useCitations } from "./context";

const ICONS: Record<string, ReactNode> = {
  "icon:diagram": (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M10 3v4m0 0-5 4v6m5-10 5 4v6" />
    </svg>
  ),
  "icon:checks": (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="m3 6 2 2 3-3M3 14l2 2 3-3M11 6.5h6M11 14.5h6" />
    </svg>
  ),
};

function Thumb({ value }: { value: string }) {
  if (value.startsWith("/")) {
    return <span className="note-thumb"><Image src={value} alt="" width={68} height={68} /></span>;
  }
  const icon = ICONS[value];
  if (!icon) throw new Error(`content/home.mdx: note thumb "${value}" is not an image path or one of ${Object.keys(ICONS).join(", ")}`);
  return <span className="note-thumb">{icon}</span>;
}

type NoteProps = { n: number; text: string; meta: string; thumb: string; children: ReactNode };

export function Note({ n, text, meta, thumb, children }: NoteProps) {
  const api = useCitations();
  const open = api.active === n;
  return (
    <div
      id={`note-${n}`}
      role="region"
      aria-label={`Source ${n}`}
      className={open ? "note is-open" : "note"}
      data-n={n}
      ref={(el) => api.registerNote(n, el)}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") api.enterNote(n); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") api.leave(); }}
    >
      <div className="note-head">
        <Thumb value={thumb} />
        <p className="note-text">
          <span className="note-n" aria-hidden="true">{n}</span>
          {text}
          <span className="label note-meta">{meta}</span>
        </p>
      </div>
      <div className="note-body" inert={!open}>
        <div className="note-clip">
          <div className="note-inner">
            <div className="note-evidence">
              <NoteOpenContext.Provider value={open}>{children}</NoteOpenContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
