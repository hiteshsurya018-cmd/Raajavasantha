"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "span";
  direction?: "up" | "left" | "right" | "none";
  delay?: number;
  /** Stagger children that are themselves wrapped in <Reveal.Item> */
  stagger?: boolean;
}

const offsets = {
  up: { y: 28, x: 0 },
  left: { y: 0, x: -28 },
  right: { y: 0, x: 28 },
  none: { y: 0, x: 0 },
};

export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  stagger = false,
}: RevealProps) {
  const reduce = useReducedMotion();
  const offset = offsets[direction];

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger ? 0.12 : 0, delayChildren: delay } },
  };

  const item: Variants = {
    hidden: { opacity: 0, x: reduce ? 0 : offset.x, y: reduce ? 0 : offset.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: stagger ? 0 : delay },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger ? container : item}
    >
      {stagger
        ? React.Children.map(children, (child, i) => (
            <motion.div key={i} variants={item}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
