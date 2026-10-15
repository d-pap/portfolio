"use client";

import Image from "next/image";
import { useId, useRef, type CSSProperties } from "react";
import { DIAGRAMS_BY_NAME } from "app/components/evidence/diagrams";
import { Media } from "app/components/media/media";
import { useLoopPlayback } from "app/components/media/use-loop-playback";
import type { Tile } from "app/lib/grid";
import { mediaColor } from "app/lib/media-colors";
import { SHAPES } from "app/lib/tiles";
import "./tile.css";

const COVER_SIZES = "(max-width: 650px) 90vw, (max-width: 1600px) 50vw, 760px";
const STAGE_SIZES = "(max-width: 650px) 40vw, 24vw";

function TileMediaView({ media, priority }: { media: Tile["media"]; priority: boolean }) {
  switch (media.kind) {
    case "hero":
      return <Media hero={media.hero} sizes={media.hero.type === "screen" ? COVER_SIZES : STAGE_SIZES} priority={priority} />;
    case "phones":
      return <Media hero={{ type: "phones", frames: media.frames }} sizes={STAGE_SIZES} priority={priority} />;
    case "logo":
      return <Media hero={{ type: "logo", frames: [media.src] }} sizes={STAGE_SIZES} priority={priority} />;
    case "diagram": {
      const Diagram = DIAGRAMS_BY_NAME[media.name];
      return (
        <div className="tile-diagram" aria-hidden="true">
          <Diagram />
        </div>
      );
    }
    case "cover":
      return media.recording ? (
        <video className="tile-cover" src={media.recording} poster={media.src} muted loop playsInline preload="none" style={{ objectPosition: media.position, objectFit: media.fit }} />
      ) : (
        <Image className={priority ? "tile-cover" : "tile-cover arrive"} suppressHydrationWarning src={media.src} alt="" fill sizes={COVER_SIZES} priority={priority} style={{ objectPosition: media.position, objectFit: media.fit }} />
      );
  }
}

export function WorkTile({ tile, priority = false, enter }: { tile: Tile; priority?: boolean; enter?: number }) {
  const root = useRef<HTMLElement>(null);
  const labelId = useId();
  const recording = (tile.media.kind === "cover" && tile.media.recording) || (tile.media.kind === "hero" && tile.media.hero.recording);
  useLoopPlayback(root, Boolean(recording));
  const color = tile.media.kind === "cover" ? mediaColor(tile.media.src) : undefined;
  const style = {
    aspectRatio: String(SHAPES[tile.shape]),
    ...(color ? { background: color } : {}),
    ...(tile.main ? { "--vt": `entry-${tile.slug}` } : {}),
  } as CSSProperties;

  const entrance = enter === undefined ? {} : { "data-enter": "", style: { "--enter-i": enter } as CSSProperties };

  return (
    <article ref={root} className="tile" {...entrance}>
      <div className="tile-frame">
        <div className={tile.main ? "tile-media stage is-main" : "tile-media stage"} style={style}>
          <TileMediaView media={tile.media} priority={priority} />
        </div>
      </div>
      <div className="tile-caption">
        <h3 className="tile-title">
          <a className="tile-link" href={tile.href} aria-describedby={labelId}>{tile.title}</a>
        </h3>
        <p id={labelId} className="tile-label">{tile.label}</p>
      </div>
    </article>
  );
}
