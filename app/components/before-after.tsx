"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageModal } from "./image-grid";

interface BeforeAfterImage {
  src: string;
  alt: string;
}

interface BeforeAfterProps {
  before: BeforeAfterImage;
  after: BeforeAfterImage;
  caption?: string;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  before,
  after,
  caption,
}) => {
  const [selected, setSelected] = useState<BeforeAfterImage | null>(null);

  const panels = [
    { label: "Before", image: before },
    { label: "After", image: after },
  ];

  return (
    <section className="my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {panels.map(({ label, image }) => (
          <figure key={label} className="m-0">
            <div
              className="relative aspect-[4/3] cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelected(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="rounded-lg object-contain"
              />
            </div>
            <figcaption className="mt-2 text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 text-center">
              {label}
            </figcaption>
          </figure>
        ))}
      </div>
      {caption && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          {caption}
        </p>
      )}
      <ImageModal image={selected} onClose={() => setSelected(null)} />
    </section>
  );
};
