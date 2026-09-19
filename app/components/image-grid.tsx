"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import "./image-grid.css";

interface GalleryImage {
  src: string;
  alt: string;
  href?: string;
}

interface ImageGridProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
}

interface ImageModalProps {
  image: GalleryImage | null;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  position?: string;
}

function ImageViewer({ image, onClose, onPrevious, onNext, position }: ImageModalProps & { image: GalleryImage }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const captionId = useId();
  const callbacks = useRef({ onClose, onPrevious, onNext });
  callbacks.current = { onClose, onPrevious, onNext };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    function keyboard(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" && callbacks.current.onPrevious) {
        event.preventDefault();
        callbacks.current.onPrevious();
      }
      if (event.key === "ArrowRight" && callbacks.current.onNext) {
        event.preventDefault();
        callbacks.current.onNext();
      }
    }
    dialog.addEventListener("keydown", keyboard);
    return () => {
      dialog.removeEventListener("keydown", keyboard);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="project-image-dialog not-prose"
      aria-label="Project image viewer"
      aria-describedby={captionId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="project-image-viewer">
        <div className="project-image-toolbar">
          <span className="project-image-position" aria-live="polite">{position ?? "image detail"}</span>
          <button type="button" autoFocus onClick={onClose} aria-label="Close image viewer">close <span aria-hidden="true">×</span></button>
        </div>
        <figure>
          <Image src={image.src} alt={image.alt} width={1600} height={1000} sizes="(max-width: 768px) 94vw, 90vw" priority className="project-image-expanded" />
          <figcaption id={captionId}>{image.alt}</figcaption>
          <a className="image-original-link" href={image.src} target="_blank" rel="noreferrer">open full size <span aria-hidden="true">↗</span></a>
        </figure>
        {(onPrevious || onNext) && (
          <div className="project-image-navigation">
            <button type="button" onClick={onPrevious} disabled={!onPrevious} aria-label="Previous image"><span aria-hidden="true">←</span> previous</button>
            <button type="button" onClick={onNext} disabled={!onNext} aria-label="Next image">next <span aria-hidden="true">→</span></button>
          </div>
        )}
      </div>
    </dialog>
  );
}

export function ImageModal(props: ImageModalProps) {
  return props.image ? <ImageViewer {...props} image={props.image} /> : null;
}

export function ImageGrid({ images, columns = 3 }: ImageGridProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const selectedImage = selected === null ? null : images[selected];

  return (
    <div className="project-gallery not-prose">
      <div className="project-image-grid" style={{ "--image-columns": columns } as CSSProperties}>
        {images.map((image, index) => (
          <button key={`${image.src}-${index}`} type="button" className="project-image-thumbnail" onClick={() => setSelected(index)} aria-label={`Enlarge image: ${image.alt}`} aria-haspopup="dialog">
            <Image alt={image.alt} src={image.src} fill sizes={`(max-width: 640px) 50vw, ${Math.round(70 / columns)}vw`} className="project-image-preview" />
            <span className="project-image-expand" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <ImageModal
        image={selectedImage ?? null}
        onClose={() => setSelected(null)}
        onPrevious={selected !== null && selected > 0 ? () => setSelected(selected - 1) : undefined}
        onNext={selected !== null && selected < images.length - 1 ? () => setSelected(selected + 1) : undefined}
        position={selected !== null ? `${selected + 1} / ${images.length}` : undefined}
      />
    </div>
  );
}
