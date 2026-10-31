"use client";

import { useRef } from "react";
import { useLoopPlayback } from "app/components/media/use-loop-playback";

/** A linked video in a note: plays silently while on screen, like the project films, with controls for sound and scrubbing. */
export function NoteVideo({ src, label }: { src: string; label: string }) {
  const root = useRef<HTMLDivElement>(null);
  useLoopPlayback(root, true);
  return (
    <div ref={root}>
      <video src={src} muted playsInline loop controls preload="metadata" aria-label={label || undefined} />
    </div>
  );
}
