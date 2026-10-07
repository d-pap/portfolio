"use client";

import { useRef, type CSSProperties } from "react";
import { Media } from "app/components/media/media";
import { useRecordingPlayback } from "app/components/media/use-recording-playback";
import type { Entry, Hero } from "app/lib/entries";
import "./work.css";

export type WorkItem = Pick<Entry, "slug" | "shortTitle" | "summary" | "role" | "context" | "period"> & { hero: Hero };

export function WorkFigure({ item, priority }: { item: WorkItem; priority: boolean }) {
  const root = useRef<HTMLElement>(null);
  const { playing, controls, toggle, hover } = useRecordingPlayback(root, Boolean(item.hero.recording));

  const style = { "--vt": `entry-${item.slug}` } as CSSProperties;
  const sizes = item.hero.type === "phones" ? "(max-width: 899px) 30vw, 18vw" : "(max-width: 899px) 85vw, 56vw";

  return (
    <article ref={root} className="work" style={style} {...hover}>
      {/* The button sits outside .work-figure, whose view-transition-name makes a stacking
          context that would keep it under the stretched link. */}
      <div className="work-media">
        <div className="work-figure stage">
          <Media hero={item.hero} sizes={sizes} priority={priority} />
        </div>
        {controls && (
          <button type="button" className="media-play" aria-label={playing ? `Pause ${item.shortTitle} recording` : `Play ${item.shortTitle} recording`} onClick={toggle}>
            {playing ? "pause" : "play"}
          </button>
        )}
      </div>
      <div className="work-below">
        <div>
          <h3 className="work-name"><a className="work-link" href={`/work/${item.slug}`}>{item.shortTitle}</a></h3>
          <p className="work-what">{item.summary}</p>
        </div>
        <p className="label work-meta">{item.role}<br />{item.context} · {item.period}</p>
      </div>
    </article>
  );
}
