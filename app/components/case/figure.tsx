import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { mediaColor } from "app/lib/media-colors";
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
  const screen = Boolean(src) && kind === "screen";
  return (
    // A screen figure is as wide as its image at the capped height (figure.css), so its caption starts at the image.
    <figure className={`fig fig-${variant}`} style={screen ? { "--fig-ratio": width! / height! } as CSSProperties : undefined}>
      <figcaption className="label fig-caption">{caption}</figcaption>
      <div className={screen ? "fig-stage" : "fig-stage stage"} style={screen ? { background: mediaColor(src!) } : undefined}>
        {src ? (
          <Image className="arrive" suppressHydrationWarning src={src} alt={alt} width={width} height={height} quality={90} sizes={kind === "phone" ? "(max-width: 599px) 260px, 320px" : "(max-width: 899px) calc(100vw - 32px), (max-width: 1199px) 75vw, 960px"} />
        ) : (
          children
        )}
      </div>
    </figure>
  );
}
