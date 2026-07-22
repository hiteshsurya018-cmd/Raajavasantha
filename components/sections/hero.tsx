"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, UserPlus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const LIVE_STATS = [
  { value: 2500, suffix: "+", label: "Lives touched" },
  { value: 120, suffix: "+", label: "Projects completed" },
  { value: 1200, suffix: "+", label: "Trees planted" },
];

export function Hero() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y: imageY }} className="absolute inset-0 -top-16 h-[calc(100%+4rem)]">
        <Image
          src="/hero/community-planting.png"
          alt="A multigenerational Indian community planting a tree together in a Bengaluru garden"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-900/35 to-primary-900/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/60 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container relative z-10 pb-20 pt-40 sm:pb-28"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="eyebrow text-secondary"
        >
          <span className="h-px w-6 bg-secondary" />
          Est. 2026 &middot; Bengaluru, Karnataka
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 max-w-3xl text-balance text-[2.6rem] font-semibold leading-[1.08] text-canvas sm:text-[3.6rem] lg:text-[4.4rem]"
        >
          Service is our duty,
          <br />
          <span className="text-secondary">society is our family.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-canvas/85"
        >
          Building a kinder, more inclusive society through education, healthcare,
          women&rsquo;s empowerment and environmental care &mdash; one household at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Button size="lg" className="gap-2">
            Donate Now <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="glass" className="gap-2">
            <UserPlus className="h-4 w-4" /> Become a Volunteer
          </Button>
        </motion.div>

        {/* Live stat ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-canvas/20 pt-6"
        >
          {LIVE_STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl font-bold text-secondary sm:text-3xl">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-xs text-canvas/70 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-canvas/70 sm:flex"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="h-4 w-4" />
      </motion.div>
    </section>
  );
}
