"use client";

import { useRef } from "react";
import { useLoopPlayback } from "app/components/media/use-loop-playback";
import "./figure.css";

export function VideoFigure({ src, poster, caption, width, height }: {
  src: string; poster: string; caption: string; width: number; height: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  useLoopPlayback(root, true);
  return <figure className="fig fig-video">
    <figcaption className="label fig-caption">{caption}</figcaption>
    <div ref={root} className={`fig-video-stage${height > width ? " is-portrait" : ""}`}>
      <video src={src} poster={poster} width={width} height={height} muted playsInline loop preload="none" aria-label={caption} />
    </div>
  </figure>;
}
