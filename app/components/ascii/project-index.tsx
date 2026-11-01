"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { IndexRow } from "app/lib/project-index";
import { mediaColor } from "app/lib/media-colors";
import { mediaSize } from "app/lib/media-sizes";
import { useMotion } from "./motion";

// Inline previews span the text column: the viewport less its gutters on phones and tablets, so 100vw errs a little large.
const INLINE_SIZES = "100vw";
// A film starts once it has been mostly on screen this long, so a fast scroll past it doesn't start a download.
const PLAY_DELAY = 150;
const PREVIEW_QUERY = "(min-width: 1000px) and (hover: hover) and (pointer: fine)";
const RETURN_PREVIEW = "portfolio-project-return";

function Preview({
  row,
  inline = false,
  warm = false,
  enabled = true,
}: {
  row: IndexRow;
  inline?: boolean;
  warm?: boolean;
  enabled?: boolean;
}) {
  const figure = useRef<HTMLElement>(null);
  const picture = useRef<HTMLImageElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const preview = row.preview;
  const { paused } = useMotion();
  // Desktop previews stay in the HTML so Back can name the returning image before hydration. Only the selected
  // preview gets a source; inactive films release their decoder. React leaves these source attributes to this effect
  // and the navigation boot script, so hydration cannot reload a film in the middle of its transition.
  useEffect(() => {
    if (inline || !preview) return;
    const film = video.current;
    if (enabled) {
      if (film) {
        if (film.getAttribute("poster") !== preview.image) film.poster = preview.image;
        if (film.getAttribute("src") !== preview.video) film.src = preview.video!;
      }
      if (picture.current?.getAttribute("src") !== preview.image && picture.current) picture.current.src = preview.image;
      figure.current?.removeAttribute("data-project-restoring");
    } else if (!figure.current?.hasAttribute("data-project-restoring")) {
      figure.current?.style.removeProperty("animation");
      if (film?.hasAttribute("src")) {
        film.pause();
        film.removeAttribute("src");
        film.load();
      }
    }
  }, [enabled, inline, preview]);
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
  }, [row.id, paused, inline, enabled]);
  const size = preview && mediaSize(preview.image);
  if (!preview) return null;
  return (
    <figure ref={figure} hidden={!inline && !enabled} suppressHydrationWarning className={inline ? "index-preview is-inline" : "index-preview"}>
      {preview && (
        <a
          className="index-preview-media"
          data-project-preview={row.hasHero ? row.id : undefined}
          href={row.href}
          aria-label={`View ${row.title}`}
          style={{ "--preview-aspect": size ? size[0] / size[1] : 4 / 3, ...(inline ? { background: mediaColor(preview.image) } : {}) } as CSSProperties}
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
                  quality={90}
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
                  suppressHydrationWarning
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
              suppressHydrationWarning
              ref={video}
              data-src={preview.video}
              data-poster={preview.image}
              width={size?.[0]}
              height={size?.[1]}
              muted
              loop
              playsInline
              preload="none"
              aria-label={`${row.title} preview`}
            />
          ) : (
            /* Native images avoid an optimizer round trip when moving quickly between rows. */
            <img
              suppressHydrationWarning
              ref={picture}
              data-src={preview.image}
              width={size?.[0]}
              height={size?.[1]}
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
  const returnSelection = useRef<string | null>(null);
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
    const query = matchMedia(PREVIEW_QUERY);
    const update = () => {
      setFinePointer(query.matches);
      setActive(null);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const restore = (slug: string | null) => {
      if (!matchMedia(PREVIEW_QUERY).matches) return;
      const row = rows.find((row) => row.id === slug);
      if (row) setActive(row);
    };
    const onReturn = (event: Event) => {
      returnSelection.current = (event as CustomEvent<string>).detail;
      restore(returnSelection.current);
      try { sessionStorage.removeItem(RETURN_PREVIEW); } catch {}
    };
    window.addEventListener("project-preview-return", onReturn);
    try {
      returnSelection.current = sessionStorage.getItem(RETURN_PREVIEW) ?? returnSelection.current;
      restore(returnSelection.current);
      sessionStorage.removeItem(RETURN_PREVIEW);
    } catch {}
    return () => window.removeEventListener("project-preview-return", onReturn);
  }, [rows]);
  return (
    <section
      className="project-index"
      id="projects"
      aria-labelledby="projects-heading"
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) setActive(null);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
      }}
    >
      <h2 id="projects-heading" className="index-heading">
        Projects
      </h2>
      <div className="index-list">
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
        {rows.map((row) => <Preview row={row} key={row.id} enabled={finePointer && active?.id === row.id} />)}
      </aside>
    </section>
  );
}
