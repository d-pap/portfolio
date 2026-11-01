"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useLoopPlayback } from "app/components/media/use-loop-playback";

export function CaseHeroStage({ slug, hasRecording, children, composition = false, aspectRatio }: { slug: string; hasRecording: boolean; children: ReactNode; composition?: boolean; aspectRatio?: number }) {
  const root = useRef<HTMLDivElement>(null);
  useLoopPlayback(root, hasRecording);
  const style = aspectRatio ? { "--hero-aspect": aspectRatio } as CSSProperties : undefined;
  return <div ref={root} data-project-hero={slug} className={`case-hero-stage stage${composition ? " is-composition" : ""}${aspectRatio ? " has-aspect-ratio" : ""}`} style={style}>{children}</div>;
}
