import Image from "next/image";
import type { ReactNode } from "react";
import "./figure.css";

type FigureProps = {
  caption: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  kind?: "screen" | "phone";
  children?: ReactNode;
};

export function Figure({ caption, src, alt = "", width, height, kind = "screen", children }: FigureProps) {
  if (src && (!width || !height)) throw new Error(`<Figure src="${src}">: width and height are required`);
  if (!src && !children) throw new Error(`<Figure caption="${caption}">: needs src or children`);
  const variant = src ? kind : "custom";
  return (
    <figure className={`fig fig-${variant}`}>
      <figcaption className="label fig-caption">{caption}</figcaption>
      <div className={src && kind === "screen" ? "fig-stage" : "fig-stage stage"}>
        {src ? (
          <Image src={src} alt={alt} width={width} height={height} sizes={kind === "phone" ? "(max-width: 899px) 70vw, 360px" : "(max-width: 899px) 100vw, 66vw"} />
        ) : (
          children
        )}
      </div>
    </figure>
  );
}
