"use client";

import { useRef, type ReactNode } from "react";
import { useRecordingPlayback } from "app/components/media/use-recording-playback";

export function CaseHeroStage({ hasRecording, children }: { hasRecording: boolean; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { mode, playing, setPlaying, hover } = useRecordingPlayback(root, hasRecording, false);
  return (
    <div ref={root} className="case-hero-stage" {...hover}>
      {children}
      {mode === "tap" && (
        <button type="button" className="media-play" aria-pressed={playing} onClick={() => setPlaying((value) => !value)}>
          {playing ? "pause" : "play"}
        </button>
      )}
    </div>
  );
}
