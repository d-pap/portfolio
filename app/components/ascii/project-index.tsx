"use client";

import { useEffect, useRef, useState } from "react";
import type { IndexGroup, IndexRow } from "app/lib/project-index";
import { useMotion } from "./motion";

function Preview({ row, inline = false }: { row: IndexRow; inline?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const { paused } = useMotion();
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let mounted = true;
    let visible = false;
    const update = () => {
      if (visible && !document.hidden && !paused) {
        element
          .play()
          .then(() => {
            if (!mounted || !visible || document.hidden || paused)
              element.pause();
          })
          .catch(() => {});
      } else element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      mounted = false;
      element.pause();
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [row.id, paused]);
  return (
    <figure className={inline ? "index-preview is-inline" : "index-preview"}>
      {row.preview && (
        <a
          className="index-preview-media"
          href={row.href}
          aria-label={`View ${row.title}`}
        >
          {row.preview.video ? (
            <video
              ref={video}
              src={row.preview.video}
              poster={row.preview.image}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden={inline ? true : undefined}
              aria-label={`${row.title} preview`}
            />
          ) : (
            /* Native images avoid an optimizer round trip when moving quickly between rows. */
            <img
              src={row.preview.image}
              alt={`${row.title} project preview`}
              decoding="async"
              loading={inline ? "lazy" : "eager"}
            />
          )}
        </a>
      )}
      <figcaption>{row.summary}</figcaption>
    </figure>
  );
}

export function ProjectIndex({ groups }: { groups: IndexGroup[] }) {
  const [active, setActive] = useState<IndexRow | null>(null);
  const [finePointer, setFinePointer] = useState(false);
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
      <h2 id="projects-heading" className="visually-hidden">
        Projects
      </h2>
      <div
        className="index-groups"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setActive(null);
        }}
      >
        {groups.map((group) => (
          <section
            className="index-group"
            key={group.title}
            aria-label={group.title}
          >
            <h3>{group.title}</h3>
            <ul>
              {group.rows.map((row) => (
                <li
                  key={row.id}
                  className={
                    active?.id === row.id
                      ? "index-item is-active"
                      : "index-item"
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
                    <span className="index-name">
                      {row.title}
                    </span>
                    <span className="index-period"><span className="visually-hidden">Project started </span>{row.period}</span>
                    <span className="index-area">{row.area}</span>
                    <span className="index-role">{row.role}</span>
                  </a>
                  {!finePointer && <Preview row={row} inline />}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <aside className="index-preview-column" aria-label="Project preview">
        {active && finePointer && <Preview row={active} key={active.id} />}
      </aside>
    </section>
  );
}
