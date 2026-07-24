"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Education", "Healthcare", "Environment", "Community"] as const;

const IMAGES: { src: string; alt: string; category: (typeof FILTERS)[number]; tall?: boolean }[] = [
  { src: "/gallery/1.jpg", alt: "Children receiving school kits", category: "Education", tall: true },
  { src: "/gallery/2.jpg", alt: "Doctor examining an elderly patient at a free camp", category: "Healthcare" },
  { src: "/gallery/3.jpg", alt: "Volunteers planting saplings", category: "Environment" },
  { src: "/gallery/4.jpg", alt: "Community food distribution", category: "Community", tall: true },
  { src: "/gallery/5.jpg", alt: "Women in a tailoring skills workshop", category: "Education" },
  { src: "/gallery/6.jpg", alt: "Medical camp queue in a village", category: "Healthcare" },
  { src: "/gallery/7.jpg", alt: "Sapling being watered by a volunteer", category: "Environment", tall: true },
  { src: "/gallery/8.jpg", alt: "Senior citizens gathered at a welfare event", category: "Community" },
];

export function Gallery() {
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>("All");
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const filtered = filter === "All" ? IMAGES : IMAGES.filter((i) => i.category === filter);

  const close = React.useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const step = React.useCallback((dir: 1 | -1) => {
    setLightboxIndex((current) =>
      current === null ? current : (current + dir + filtered.length) % filtered.length
    );
  }, [filtered.length]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, lightboxIndex, step]);

  return (
    <section className="bg-canvas py-24">
      <div className="container">
        <SectionHeading eyebrow="Gallery" title="Moments from the field" />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                filter === f
                  ? "border-primary bg-primary text-canvas"
                  : "border-line text-ink-soft hover:border-primary/50 hover:text-primary"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {filtered.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setLightboxIndex(i)}
              className={cn(
                "group relative block w-full overflow-hidden rounded-2xl",
                img.tall ? "aspect-[3/4]" : "aspect-square"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-primary-900/0 transition-colors group-hover:bg-primary-900/20" />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-900/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Close viewer"
              className="absolute right-5 top-5 rounded-full bg-canvas/10 p-2 text-canvas hover:bg-canvas/20"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous image"
              className="absolute left-4 rounded-full bg-canvas/10 p-2 text-canvas hover:bg-canvas/20 sm:left-8"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <motion.div
              key={filtered[lightboxIndex].src}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative aspect-[4/3] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].alt}
                fill
                sizes="90vw"
                className="rounded-2xl object-contain"
              />
            </motion.div>
            <button
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next image"
              className="absolute right-4 rounded-full bg-canvas/10 p-2 text-canvas hover:bg-canvas/20 sm:right-8"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
