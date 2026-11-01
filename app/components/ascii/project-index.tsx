"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { IndexRow } from "app/lib/project-index";
import { mediaColor } from "app/lib/media-colors";
import { mediaSize } from "app/lib/media-sizes";
import { useMotion } from "./motion";

// Inline previews span the text column: the viewport less its gutters on phones and tablets, so 100vw errs a little large.
const INLINE_SIZES = "100vw";
// A film starts once it has been mostly on screen this long, so a fast scroll past it doesn't start a download.
const PLAY_DELAY = 150;

function Preview({
  row,
  inline = false,
  warm = false,
}: {
  row: IndexRow;
  inline?: boolean;
  warm?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const { paused } = useMotion();
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let mounted = true;
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const update = () => {
      clearTimeout(timer);
      if (visible && !document.hidden && !paused) {
        timer = setTimeout(() => {
          element
            .play()
            .then(() => {
              if (!mounted || !visible || document.hidden || paused)
                element.pause();
            })
            .catch(() => {});
        }, inline ? PLAY_DELAY : 0);
      } else element.pause();
    };
    // The film stays transparent over its poster until it has a frame to show.
    const playing = () => element.setAttribute("data-playing", "");
    element.addEventListener("playing", playing);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        update();
      },
      { threshold: [0, 0.5] },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      mounted = false;
      clearTimeout(timer);
      element.pause();
      element.removeEventListener("playing", playing);
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [row.id, paused, inline]);
  const preview = row.preview;
  const size = preview && mediaSize(preview.image);
  if (!preview) return null;
  return (
    <figure className={inline ? "index-preview is-inline" : "index-preview"}>
      {preview && (
        <a
          className="index-preview-media"
          href={row.href}
          aria-label={`View ${row.title}`}
          style={inline ? { background: mediaColor(preview.image) } : undefined}
        >
          {inline ? (
            <>
              {/* Phones get a resized image that holds its space, fades in over its edge color, and is fetched ahead
                  of the scroll once the page has loaded (warm). A film's poster is this image, so posters load
                  lazily too instead of all at once. */}
              {size && !preview.image.endsWith(".svg") ? (
                <Image
                  className="arrive"
                  suppressHydrationWarning
                  src={preview.image}
                  alt={preview.video ? "" : `${row.title} project preview`}
                  width={size[0]}
                  height={size[1]}
                  sizes={INLINE_SIZES}
                  loading={warm ? "eager" : "lazy"}
                />
              ) : (
                <img
                  src={preview.image}
                  alt={preview.video ? "" : `${row.title} project preview`}
                  width={size?.[0]}
                  height={size?.[1]}
                  decoding="async"
                  loading={warm ? "eager" : "lazy"}
                />
              )}
              {preview.video && (
                <video
                  ref={video}
                  className="index-preview-film"
                  src={preview.video}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden
                />
              )}
            </>
          ) : preview.video ? (
            <video
              ref={video}
              src={preview.video}
              poster={preview.image}
              muted
              loop
              playsInline
              preload="none"
              aria-label={`${row.title} preview`}
            />
          ) : (
            /* Native images avoid an optimizer round trip when moving quickly between rows. */
            <img
              src={preview.image}
              alt={`${row.title} project preview`}
              decoding="async"
              loading="eager"
            />
          )}
        </a>
      )}
      <figcaption>
        <p className="index-preview-description">{row.description}</p>
        {row.topics.length > 0 && (
          <ul className="index-topics" aria-label="Project topics">
            {row.topics.map((topic) => <li key={topic}>{topic}</li>)}
          </ul>
        )}
        {row.logos.length > 0 && (
          <ul className="index-stack" aria-label="Technologies">
            {row.logos.map((logo) => (
              <li key={logo.name} title={logo.name}>
                <svg viewBox="0 0 24 24" role="img" aria-label={logo.name}>
                  <title>{logo.name}</title>
                  <path d={logo.path} />
                </svg>
              </li>
            ))}
          </ul>
        )}
      </figcaption>
    </figure>
  );
}

export function ProjectIndex({ rows }: { rows: IndexRow[] }) {
  const [active, setActive] = useState<IndexRow | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  // Once the page has loaded, inline previews stop waiting for the scroll: they're small, and fetching them all
  // ahead means a fast flick down the list finds them ready.
  const [warm, setWarm] = useState(false);
  useEffect(() => {
    if (finePointer) return;
    let idle: number | undefined;
    const start = () => {
      idle = (window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 200)))(() => setWarm(true));
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle !== undefined) (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, [finePointer]);
  useEffect(() => {
    const query = matchMedia(
      "(min-width: 1000px) and (hover: hover) and (pointer: fine)",
    );
    const update = () => {
      setFinePointer(query.matches);
      setActive(null);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return (
    <section
      className="project-index"
      id="projects"
      aria-labelledby="projects-heading"
      onMouseLeave={() => {
        if (!document.activeElement?.closest(".index-row")) setActive(null);
      }}
    >
      <h2 id="projects-heading" className="index-heading">
        Projects
      </h2>
      <div
        className="index-list"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setActive(null);
        }}
      >
        <ul>
          {rows.map((row) => (
            <li
              key={row.id}
              className={
                active?.id === row.id ? "index-item is-active" : "index-item"
              }
            >
              <a
                className="index-row"
                href={row.href}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch" && finePointer)
                    setActive(row);
                }}
                onFocus={() => {
                  if (finePointer) setActive(row);
                }}
              >
                <span className="index-name">{row.title}</span>
                <span className="index-summary">{row.summary}</span>
                <span className="index-period">{row.period}</span>
              </a>
              {!finePointer && <Preview row={row} inline warm={warm} />}
            </li>
          ))}
        </ul>
      </div>
      <aside className="index-preview-column" aria-label="Project preview">
        {active && finePointer && <Preview row={active} key={active.id} />}
      </aside>
    </section>
  );
}
