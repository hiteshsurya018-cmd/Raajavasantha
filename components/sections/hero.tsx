"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, UserPlus, ChevronDown, Building2, CalendarCheck2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MissionPreview } from "@/components/sections/MissionPreview";

const TRUST_CARDS = [
  {
    icon: Building2,
    label: "Registered Trust",
    value: "Bengaluru, Karnataka",
  },
  {
    icon: CalendarCheck2,
    label: "Established",
    value: "2026",
  },
  {
    icon: Sparkles,
    label: "Focus Areas",
    value: "Education, Healthcare, Women Empowerment, Environment",
  },
];

export function Hero() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [showArrivalBrand, setShowArrivalBrand] = React.useState(true);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  React.useEffect(() => {
    if (!showArrivalBrand) return;

    function beginArrival() {
      window.dispatchEvent(new Event("rajavasantha-brand-arrival-start"));
      setShowArrivalBrand(false);
    }

    const events = ["mousemove", "wheel", "scroll", "click", "touchstart", "keydown"] as const;
    const options: AddEventListenerOptions = { once: true, passive: true };

    events.forEach((event) => window.addEventListener(event, beginArrival, options));
    return () => events.forEach((event) => window.removeEventListener(event, beginArrival));
  }, [showArrivalBrand]);

  return (
    <>
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y: imageY }}
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{ duration: 18, ease: "easeOut" }}
        className="absolute inset-0 -top-16 h-[calc(100%+4rem)]"
      >
        <Image
          src="/hero/community-planting.png"
          alt="A multigenerational Indian community planting a tree together in a Bengaluru garden"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/48 to-primary-900/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/72 via-primary-900/20 to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container relative z-10 flex flex-col items-center pb-24 pt-44 text-center sm:pb-28 lg:pb-32"
      >
        <AnimatePresence>
          {showArrivalBrand && (
            <motion.div
              layoutId="rajavasantha-brand-block"
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{
                opacity: 1,
                y: shouldReduceMotion ? 0 : [0, -8, 0],
                scale: 1,
                rotate: 0,
                filter: "drop-shadow(0 0 34px rgba(212,160,23,0.42))",
              }}
              exit={{
                opacity: 0,
                scale: 0.34,
                rotate: 4,
                filter: "drop-shadow(0 0 0 rgba(212,160,23,0))",
              }}
              transition={{
                layout: { type: "spring", stiffness: 92, damping: 19, duration: 1.45 },
                opacity: { duration: shouldReduceMotion ? 0.15 : 0.5 },
                y: {
                  duration: 4.8,
                  repeat: shouldReduceMotion ? 0 : Infinity,
                  ease: "easeInOut",
                },
                scale: { type: "spring", stiffness: 95, damping: 18, duration: 1.45 },
                rotate: { type: "spring", stiffness: 105, damping: 18 },
                filter: { duration: 1.2 },
              }}
              className="mb-10 flex flex-col items-center text-canvas sm:mb-12"
              aria-label="Rajavasantha Welfare Trust established 2026"
            >
              <motion.span
                layoutId="rajavasantha-brand-logo"
                className="rounded-full bg-canvas/14 p-3 shadow-glass ring-1 ring-secondary/45 backdrop-blur-md"
              >
                <Image
                  src="/logo.jpeg"
                  alt="Rajavasantha Welfare Trust"
                  width={132}
                  height={132}
                  priority
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-secondary/60 sm:h-32 sm:w-32"
                />
              </motion.span>
              <div className="mt-5 flex flex-col items-center leading-none">
                <span className="font-display text-3xl font-bold uppercase sm:text-4xl">
                  RAJAVASANTHA
                </span>
                <span className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-secondary sm:text-xs">
                  WELFARE TRUST (R)
                </span>
                <span className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-canvas/78">
                  EST. 2026
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="eyebrow text-secondary"
        >
          <span className="h-px w-8 bg-secondary" />
          Rajavasantha Welfare Trust (R)
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-7 max-w-5xl text-balance font-display text-[2.9rem] font-semibold leading-[1.02] text-canvas sm:text-[4.25rem] lg:text-[5.7rem]"
        >
          Serving Humanity,
          <br />
          Building Hope,
          <br />
          <span className="text-secondary">Creating Lasting Change.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-7 max-w-3xl text-balance text-lg leading-8 text-canvas/88 sm:text-xl"
        >
          Rajavasantha Welfare Trust is committed to creating meaningful change through
          education, healthcare, women empowerment, environmental sustainability and
          community development across Karnataka.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
        >
          <Button
            size="lg"
            className="h-14 gap-2 bg-[#7A1F1F] px-8 text-canvas hover:scale-[1.02] hover:bg-secondary hover:text-primary-700"
            asChild
          >
            <Link href="/donate">
              Donate Now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="glass"
            className="h-14 gap-2 border-canvas/45 bg-canvas/12 px-8 text-canvas hover:scale-[1.02] hover:bg-canvas/20"
            asChild
          >
            <Link href="/volunteer">
              <UserPlus className="h-4 w-4" /> Become a Volunteer
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-16 grid w-full max-w-5xl gap-4 border-t border-canvas/20 pt-6 sm:grid-cols-3"
        >
          {TRUST_CARDS.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-canvas/20 bg-canvas/10 p-5 text-canvas shadow-glass backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/95 text-primary-700">
                  <card.icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    {card.label}
                  </p>
                  <p className="mt-1 text-sm font-medium leading-6 text-canvas/88">{card.value}</p>
                </div>
              </div>
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
    <MissionPreview />
    </>
  );
}
