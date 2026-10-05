import Image from "next/image";
import type { Hero } from "app/lib/entries";
import "./media.css";

type MediaProps = { hero: Hero; sizes: string; priority?: boolean; label?: string };
type DeviceProps = { kind: "phone" | "screen"; src: string; alt: string; recording?: string; sizes: string; priority: boolean; offset?: boolean };

// A recording, when present, plays in the first device; its first frame is the poster.
export function Media({ hero, sizes, priority = false, label }: MediaProps) {
  if (hero.type === "screen") {
    return (
      <div className="media">
        <Device kind="screen" src={hero.frames[0]} alt={label ?? ""} recording={hero.recording} sizes={sizes} priority={priority} />
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

function Device({ kind, src, alt, recording, sizes, priority, offset }: DeviceProps) {
  return (
    <div className={`device device-${kind}${offset ? " device-offset" : ""}`}>
      {recording ? (
        <video className="device-video" src={recording} poster={src} muted loop playsInline preload="none" aria-label={alt || undefined} />
      ) : (
        <Image className="device-image" src={src} alt={alt} fill sizes={sizes} priority={priority} />
      )}
    </div>
  );
}
