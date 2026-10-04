"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { TrustProject } from "@/data/projects";

type ProjectMedia = TrustProject["gallery"][number];

export function ProjectMediaGallery({
  media,
}: {
  media: ProjectMedia[];
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedMedia =
    selectedIndex === null ? null : media[selectedIndex] ?? null;

  function closeLightbox() {
    const previousIndex = selectedIndex;
    setSelectedIndex(null);
    window.setTimeout(() => {
      if (previousIndex !== null) triggerRefs.current[previousIndex]?.focus();
    }, 0);
  }

  function showPrevious() {
    setSelectedIndex((index) =>
      index === null ? null : (index - 1 + media.length) % media.length,
    );
  }

  function showNext() {
    setSelectedIndex((index) =>
      index === null ? null : (index + 1) % media.length,
    );
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedIndex !== null && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (selectedIndex === null && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-5">
        {media.map((item, index) => (
          <figure
            key={`${item.src}-${item.alt}`}
            className="overflow-hidden border border-forest-deep/10 bg-card"
          >
            <button
              ref={(node) => {
                triggerRefs.current[index] = node;
              }}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="group relative block aspect-square w-full overflow-hidden bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label={`Open ${item.resourceType === "video" ? "video" : "image"} ${index + 1} of ${media.length}: ${item.alt}`}
            >
              {item.resourceType === "video" ? (
                <video
                  muted
                  preload="metadata"
                  playsInline
                  aria-hidden="true"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                >
                  <source src={item.src} type={item.mimeType ?? "video/mp4"} />
                </video>
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              )}
            </button>
            {item.caption && (
              <figcaption className="p-3 text-xs leading-relaxed text-muted-foreground">
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => {
          if (selectedIndex !== null) closeLightbox();
        }}
        onCancel={(event) => {
          event.preventDefault();
          closeLightbox();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeLightbox();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" && media.length > 1) {
            event.preventDefault();
            showPrevious();
          }
          if (event.key === "ArrowRight" && media.length > 1) {
            event.preventDefault();
            showNext();
          }
        }}
        aria-label="Project media viewer"
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-black/95 p-0 text-ivory backdrop:bg-black/95"
      >
        {selectedMedia && selectedIndex !== null && (
          <div className="flex h-full flex-col">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-ivory/15 px-4 py-3 sm:px-6">
              <p className="text-sm text-ivory/70" aria-live="polite">
                {selectedIndex + 1} of {media.length}
              </p>
              <button
                type="button"
                onClick={closeLightbox}
                className="grid h-11 w-11 place-items-center border border-ivory/20 text-ivory transition-colors hover:border-gold hover:text-gold"
                aria-label="Close media viewer"
              >
                <X aria-hidden="true" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <div className="absolute inset-4 sm:inset-8">
                {selectedMedia.resourceType === "video" ? (
                  <video
                    key={selectedMedia.src}
                    controls
                    autoPlay
                    preload="metadata"
                    playsInline
                    aria-label={selectedMedia.alt}
                    className="h-full w-full object-contain"
                  >
                    <source
                      src={selectedMedia.src}
                      type={selectedMedia.mimeType ?? "video/mp4"}
                    />
                  </video>
                ) : (
                  <Image
                    src={selectedMedia.src}
                    alt={selectedMedia.alt}
                    fill
                    priority
                    unoptimized
                    sizes="100vw"
                    className="object-contain"
                  />
                )}
              </div>

              {media.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center border border-ivory/25 bg-black/55 text-ivory transition-colors hover:border-gold hover:text-gold sm:left-6"
                    aria-label="Previous image"
                  >
                    <ChevronLeft aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center border border-ivory/25 bg-black/55 text-ivory transition-colors hover:border-gold hover:text-gold sm:right-6"
                    aria-label="Next image"
                  >
                    <ChevronRight aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            {(selectedMedia.caption || selectedMedia.alt) && (
              <p className="shrink-0 border-t border-ivory/15 px-5 py-4 text-center text-sm text-ivory/75">
                {selectedMedia.caption || selectedMedia.alt}
              </p>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
