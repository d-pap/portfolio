"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageModal } from "./image-grid";

type ProjectFigureProps = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  kind?: "screen" | "phone" | "chart";
};

export function ProjectFigure({ src, alt, caption, width, height, kind = "screen" }: ProjectFigureProps) {
  const [expanded, setExpanded] = useState(false);
  return <figure className={`case-figure not-prose case-figure-${kind}`}>
    <button type="button" className="figure-stage" onClick={() => setExpanded(true)} aria-label={`Enlarge image: ${alt}`} aria-haspopup="dialog">
      <Image src={src} alt={alt} width={width} height={height} sizes={kind === "phone" ? "(max-width: 700px) 65vw, 360px" : "(max-width: 700px) 100vw, 66vw"} />
      <span className="figure-expand" aria-hidden="true">↗</span>
    </button>
    <figcaption>{caption || alt}</figcaption>
    <ImageModal image={expanded ? {src, alt} : null} onClose={() => setExpanded(false)} />
  </figure>;
}
