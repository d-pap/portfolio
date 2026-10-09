"use client";

import { useRef, type ReactNode } from "react";
import { useLoopPlayback } from "app/components/media/use-loop-playback";

export function CaseHeroStage({ hasRecording, children, composition = false }: { hasRecording: boolean; children: ReactNode; composition?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useLoopPlayback(root, hasRecording);
  return <div ref={root} className={`case-hero-stage stage${composition ? " is-composition" : ""}`}>{children}</div>;
}
