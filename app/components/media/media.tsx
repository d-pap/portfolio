import Image from "next/image";
import type { CSSProperties } from "react";
import type { Hero } from "app/lib/entries";
import { mediaColor } from "app/lib/media-colors";
import { mediaSize } from "app/lib/media-sizes";
import "./media.css";

type MediaProps = { hero: Hero; sizes: string; priority?: boolean; label?: string };
type DeviceProps = { kind: "phone" | "screen"; src: string; alt: string; recording?: string; sizes: string; priority: boolean; offset?: boolean; aspectRatio?: number };

// Fills its nearest positioned ancestor (position: absolute; inset: 0), so the host
// must be position: relative with a definite size.
// A recording, when present, plays in the first device; its first frame is the poster.
export function Media({ hero, sizes, priority = false, label }: MediaProps) {
  if (hero.type === "composition") {
    const size = mediaSize(hero.frames[0]);
    return <div className="media media-composed" style={{ background: mediaColor(hero.frames[0]), "--media-aspect": size ? size[0] / size[1] : hero.aspectRatio ?? 4 / 3 } as CSSProperties}>{hero.recording ? (
      <video suppressHydrationWarning className="media-composition" src={hero.recording} poster={hero.frames[0]} width={size?.[0]} height={size?.[1]} muted loop playsInline preload={priority ? "auto" : "none"} aria-label={label || undefined} />
    ) : (
      <Image className={priority ? "media-composition" : "media-composition arrive"} suppressHydrationWarning src={hero.frames[0]} alt={label ?? ""} width={size?.[0]} height={size?.[1]} sizes={sizes} priority={priority} quality={90} />
    )}</div>;
  }
  if (hero.type === "logo") {
    // SVGs skip the image optimizer, which would otherwise reject them.
    const size = mediaSize(hero.frames[0]);
    return (
      <div className="media media-mark" style={{ "--media-aspect": size ? size[0] / size[1] : 1 } as CSSProperties}>
        <div className="media-logo" suppressHydrationWarning><Image src={hero.frames[0]} alt={label ?? ""} fill unoptimized priority={priority} /></div>
      </div>
    );
  }
  if (hero.type === "screen") {
    return (
      <div className="media" style={hero.aspectRatio ? { containerType: "inline-size" } : undefined}>
        <Device kind="screen" src={hero.frames[0]} alt={label ?? ""} recording={hero.recording} sizes={sizes} priority={priority} aspectRatio={hero.aspectRatio} />
      </div>
    );
  }
  return (
    <div className="media">
      {hero.frames.map((src, i) => (
        <Device key={src} kind="phone" offset={i === 1} src={src} alt={i === 0 ? label ?? "" : ""} recording={i === 0 ? hero.recording : undefined} sizes={sizes} priority={priority} />
      ))}
    </div>
  );
}

function Device({ kind, src, alt, recording, sizes, priority, offset, aspectRatio }: DeviceProps) {
  return (
    <div className={`device device-${kind}${offset ? " device-offset" : ""}`} style={{ background: mediaColor(src), ...(aspectRatio ? { aspectRatio, height: `min(82%, calc(90cqw / ${aspectRatio}))`, flexShrink: 0 } : {}) }}>
      {recording ? (
        <video suppressHydrationWarning className="device-video" src={recording} poster={src} muted loop playsInline preload={priority ? "auto" : "none"} aria-label={alt || undefined} />
      ) : (
        <Image className={priority ? "device-image" : "device-image arrive"} suppressHydrationWarning src={src} alt={alt} fill sizes={sizes} priority={priority} quality={90} />
      )}
    </div>
  );
}
