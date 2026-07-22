"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    name: "Lakshmi Devi",
    role: "Mother of two, School Kits programme",
    photo: "/testimonials/lakshmi.jpg",
    rating: 5,
    quote:
      "My daughter never had a proper school bag before. Rajavasantha didn't just give supplies — they made her excited to go to school again.",
  },
  {
    name: "Dr. Ramesh Kumar",
    role: "Volunteer physician, Medical Camps",
    photo: "/testimonials/ramesh.jpg",
    rating: 5,
    quote:
      "In fifteen years of free camps I've never seen an NGO track follow-up care this closely. Patients aren't a headcount here.",
  },
  {
    name: "Ananya S.",
    role: "Self-help group member, Rajajinagar",
    photo: "/testimonials/ananya.jpg",
    rating: 5,
    quote:
      "The tailoring training gave me my first independent income. For the first time, saving felt like something I could actually do.",
  },
];

export function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const active = TESTIMONIALS[index];

  function go(dir: 1 | -1) {
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  return (
    <section className="bg-canvas py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Voices From The Ground"
          title="Told by the people we serve, not about them"
        />

        <div className="relative mx-auto mt-14 max-w-3xl">
          <Quote className="mx-auto h-9 w-9 text-secondary/40" strokeWidth={1.5} />

          <div className="relative mt-4 min-h-[220px]" role="region" aria-live="polite" aria-label="Testimonial">
            <AnimatePresence mode="wait">
              <motion.figure
                key={active.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center"
              >
                <div className="flex justify-center gap-1">
                  {Array.from({ length: active.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <blockquote className="mt-5 text-balance font-display text-xl leading-relaxed text-ink sm:text-2xl">
                  &ldquo;{active.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-center gap-3">
                  <span className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-secondary/40">
                    <Image src={active.photo} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="text-left">
                    <p className="text-sm font-semibold text-ink">{active.name}</p>
                    <p className="text-xs text-ink-soft">{active.role}</p>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-6 bg-primary" : "w-1.5 bg-line"
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
