import { getImageProps } from "next/image";

/**
 * A film's poster through the image optimizer, so it arrives as AVIF and never wider than the file itself. Only project
 * images go through it: the optimizer rejects SVGs and any host outside next.config.ts, and a poster of unknown size
 * stays as it is.
 */
export function posterSrc(src: string, size: [number, number] | undefined): string {
  if (!src.startsWith("/projects/") || src.endsWith(".svg") || !size) return src;
  return getImageProps({ src, width: size[0], height: size[1], alt: "" }).props.src;
}
