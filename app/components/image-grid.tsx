"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ImageGridProps {
  images: {
    src: string;
    alt: string;
    href?: string;
  }[];
  columns?: 2 | 3 | 4; // Accepts 2, 3, or 4 columns
}

interface ImageModalProps {
  image: { src: string; alt: string } | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (image) {
      // Reset zoom and position when new image opens
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [image]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (image) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [image, onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(5, scale + delta));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      e.target === imageRef.current ||
      imageRef.current?.contains(e.target as Node)
    ) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Double click to zoom
    if (e.detail === 2) {
      if (scale === 1) {
        setScale(2);
      } else {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  if (!image) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-blackbg bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={resetZoom}
          className="bg-whitebg bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-md text-sm transition-colors"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="bg-whitebg bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-md text-sm transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-4 left-4 bg-whitebg bg-opacity-20 text-white px-3 py-2 rounded-md text-sm">
        {Math.round(scale * 100)}%
      </div>

      {/* Image container */}
      <div
        ref={imageRef}
        className="relative max-w-full max-h-full cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onClick={handleImageClick}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={1200}
          height={800}
          className="object-contain max-w-[90vw] max-h-[90vh] select-none"
          sizes="90vw"
          priority
          draggable={false}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-whitebg bg-opacity-20 text-white px-4 py-2 rounded-md text-sm text-center">
        <div>Scroll to zoom • Double-click to toggle zoom • Drag to pan</div>
      </div>
    </div>
  );
};

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  columns = 3,
}) => {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const gridClass = {
    2: "grid-cols-2 sm:grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns];

  return (
    <section>
      <div className={`grid ${gridClass} gap-4 my-8`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              alt={image.alt}
              src={image.src}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              priority
              className="rounded-lg object-contain"
            />
          </div>
        ))}
      </div>
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
};
