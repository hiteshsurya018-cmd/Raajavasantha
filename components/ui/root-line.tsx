"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The trust's signature visual device. A single organic line — half root,
 * half branch — that threads down the page margin between sections,
 * echoing the banyan tree at the centre of the Rajavasantha crest.
 * It draws itself in as the reader scrolls, standing in for the idea
 * that every section is one continuous act of growth, not a series
 * of disconnected panels.
 */
export function RootLine({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  const ref = React.useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 40 600"
      preserveAspectRatio="none"
      className={cn("root-line hidden lg:block h-full w-10", flip && "-scale-x-100", className)}
    >
      <path
        d="M20 0 C 8 60, 32 110, 18 170 C 6 220, 30 260, 16 320 C 4 380, 28 420, 20 480 C 14 520, 26 560, 20 600"
        fill="none"
        stroke="#D4A437"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={cn(inView && "in-view")}
      />
      <path
        d="M20 0 C 8 60, 32 110, 18 170 C 6 220, 30 260, 16 320 C 4 380, 28 420, 20 480 C 14 520, 26 560, 20 600"
        fill="none"
        stroke="#7A1E22"
        strokeWidth="1.5"
        strokeDasharray="2 10"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* leaf nodes at growth points */}
      {[170, 320, 480].map((y) => (
        <motion.circle
          key={y}
          cx="20"
          cy={y}
          r="3.5"
          fill="#D4A437"
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.4 }}
        />
      ))}
    </svg>
  );
}
