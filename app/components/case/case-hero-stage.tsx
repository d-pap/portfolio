"use client";

import { useRef, type ReactNode } from "react";
import { useRecordingPlayback } from "app/components/media/use-recording-playback";

export function CaseHeroStage({ hasRecording, label, children }: { hasRecording: boolean; label: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { playing, controls, toggle, hover } = useRecordingPlayback(root, hasRecording, false);
  return (
    <div ref={root} className="case-hero-stage stage" {...hover}>
      {children}
      {controls && (
        <button type="button" className="media-play" aria-label={playing ? `Pause ${label} recording` : `Play ${label} recording`} onClick={toggle}>
          {playing ? "pause" : "play"}
        </button>
      )}
    </div>
  );
}
