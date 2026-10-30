"use client";

import { useRef, type CSSProperties } from "react";
import { posterSrc } from "app/components/media/poster";
import { useLoopPlayback } from "app/components/media/use-loop-playback";
import "./figure.css";

export function VideoFigure({ src, poster, caption, width, height }: {
  src: string; poster: string; caption: string; width: number; height: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  useLoopPlayback(root, true);
  const portrait = height > width;
  // Portrait films keep their full-width white stage; wide ones size to the film like screen figures (figure.css).
  return <figure className={`fig fig-video${portrait ? "" : " is-wide"}`} style={portrait ? undefined : { "--fig-ratio": width / height } as CSSProperties}>
    <figcaption className="label fig-caption">{caption}</figcaption>
    <div ref={root} className={`fig-video-stage${portrait ? " is-portrait" : ""}`}>
      <video src={src} poster={posterSrc(poster, [width, height])} width={width} height={height} muted playsInline loop preload="none" aria-label={caption} />
    </div>
  </figure>;
}
