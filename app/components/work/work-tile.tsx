"use client";

import Image from "next/image";
import { useId, useRef, type CSSProperties } from "react";
import { DIAGRAMS_BY_NAME } from "app/components/evidence/diagrams";
import { Media } from "app/components/media/media";
import { useRecordingPlayback } from "app/components/media/use-recording-playback";
import type { Tile } from "app/lib/grid";
import { SHAPES } from "app/lib/tiles";
import "./tile.css";

const COVER_SIZES = "(max-width: 899px) 92vw, 31vw";
const STAGE_SIZES = "(max-width: 899px) 40vw, 14vw";

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
        <video className="tile-cover" src={media.recording} poster={media.src} muted loop playsInline preload="none" style={{ objectPosition: media.position }} />
      ) : (
        <Image className="tile-cover" src={media.src} alt="" fill sizes={COVER_SIZES} priority={priority} style={{ objectPosition: media.position }} />
      );
  }
}

export function WorkTile({ tile, priority = false }: { tile: Tile; priority?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const labelId = useId();
  const recording = (tile.media.kind === "cover" && tile.media.recording) || (tile.media.kind === "hero" && tile.media.hero.recording);
  const { playing, controls, toggle, hover } = useRecordingPlayback(root, Boolean(recording));
  const style = { aspectRatio: String(SHAPES[tile.shape]), ...(tile.main ? { "--vt": `entry-${tile.slug}` } : {}) } as CSSProperties;

  return (
    <article ref={root} className="tile" {...hover}>
      {/* The button sits outside .tile-media, whose view-transition-name makes a stacking
          context that would keep it under the stretched link. */}
      <div className="tile-frame">
        <div className={tile.main ? "tile-media stage is-main" : "tile-media stage"} style={style}>
          <TileMediaView media={tile.media} priority={priority} />
        </div>
        {controls && (
          <button type="button" className="media-play" aria-label={playing ? `Pause ${tile.title} recording` : `Play ${tile.title} recording`} onClick={toggle}>
            {playing ? "pause" : "play"}
          </button>
        )}
      </div>
      <h3 className="tile-title">
        <a className="tile-link" href={tile.href} aria-describedby={labelId}>{tile.title}</a>
      </h3>
      <p id={labelId} className="label tile-label">{tile.label}</p>
    </article>
  );
}
