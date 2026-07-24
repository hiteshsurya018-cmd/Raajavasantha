"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Eye, HandHeart, Landmark, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const CARDS: {
  title: string;
  copy: string;
  icon: LucideIcon;
  href?: string;
  cta?: string;
}[] = [
  {
    title: "Mission",
    copy: "To create equitable pathways to education, health, livelihoods and a healthier environment for families across Karnataka.",
    icon: HandHeart,
  },
  {
    title: "Vision",
    copy: "A society where opportunity, care and belonging are shared with dignity, transparency and long-term commitment.",
    icon: Eye,
  },
  {
    title: "Core Values",
    copy: "Compassion, accountability, cultural respect and community partnership guide every programme we build.",
    icon: ShieldCheck,
  },
  {
    title: "Call to Action",
    copy: "Partner with Rajavasantha Welfare Trust to support focused, community-led change from the ground up.",
    icon: Landmark,
    href: "/contact",
    cta: "Partner with us",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MissionPreview() {
  return (
    <section className="bg-canvas py-20 sm:py-24 lg:py-28" aria-labelledby="mission-preview-title">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">Purpose in action</p>
          <h2
            id="mission-preview-title"
            className="mt-5 text-balance font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl"
          >
            A trust built for service, clarity and lasting community impact.
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {CARDS.map((item) => (
            <motion.article
              key={item.title}
              variants={card}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="group flex min-h-[292px] flex-col rounded-3xl border border-line bg-gradient-to-br from-canvas via-accent to-canvas p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-secondary shadow-soft transition-transform duration-300 group-hover:scale-105">
                <item.icon className="h-6 w-6" strokeWidth={1.7} />
              </span>
              <h3 className="mt-7 font-display text-2xl font-semibold text-primary">{item.title}</h3>
              <p className="mt-4 flex-1 leading-7 text-ink-soft">{item.copy}</p>
              {item.href && item.cta ? (
                <Button
                  variant="outline"
                  className="mt-7 w-fit border-primary/25 text-primary hover:border-secondary hover:bg-secondary/10"
                  asChild
                >
                  <Link href={item.href}>
                    {item.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <span className="mt-7 h-px w-16 bg-secondary transition-all duration-300 group-hover:w-24" />
              )}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
