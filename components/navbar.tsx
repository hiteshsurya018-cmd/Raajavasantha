"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ChevronDown, Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FOCUS_AREAS = [
  { name: "Education", href: "/work/education", blurb: "Quality schooling for every child" },
  { name: "Healthcare", href: "/work/healthcare", blurb: "Free camps & clinics" },
  { name: "Women Empowerment", href: "/work/women", blurb: "Skills, credit, dignity" },
  { name: "Environment", href: "/work/environment", blurb: "Tree plantation & water" },
  { name: "Animal Welfare", href: "/work/animals", blurb: "Shelter and care" },
  { name: "Disaster Relief", href: "/work/disaster", blurb: "First response, rebuilding" },
];

const NAV_LINKS = [
  { name: "About Us", href: "/about" },
  { name: "Our Work", href: "/work", mega: true },
  { name: "Projects", href: "/projects" },
  { name: "Gallery", href: "/gallery" },
  { name: "News & Events", href: "/news" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [megaOpen, setMegaOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-editorial",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div
        className={cn(
          "container flex items-center justify-between rounded-full px-4 py-2 transition-all duration-500",
          scrolled ? "glass shadow-glass" : "bg-transparent"
        )}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="Rajavasantha Welfare Trust"
            width={52}
            height={52}
            priority
            className="h-12 w-12 rounded-full object-cover shadow-sm"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.05rem] font-bold tracking-tight text-primary">
              Rajavasantha
            </span>
            <span className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-secondary-600">
              Welfare Trust
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) =>
            link.mega ? (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button
                  className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-ink/5 hover:text-primary"
                  aria-expanded={megaOpen}
                >
                  {link.name}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="glass absolute left-1/2 top-full mt-3 w-[560px] -translate-x-1/2 rounded-3xl border border-line/60 p-5 shadow-glass"
                    >
                      <div className="grid grid-cols-2 gap-1">
                        {FOCUS_AREAS.map((area) => (
                          <Link
                            key={area.name}
                            href={area.href}
                            className="rounded-2xl p-3 transition-colors hover:bg-primary/5"
                          >
                            <p className="font-display text-[0.95rem] font-semibold text-primary">
                              {area.name}
                            </p>
                            <p className="mt-0.5 text-xs text-ink-soft">{area.blurb}</p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-ink/5 hover:text-primary"
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:+918971993133"
            className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-primary"
          >
            <Phone className="h-3.5 w-3.5" /> +91 89719 93133
          </a>
          <Button size="sm" className="gap-1.5" asChild><Link href="/donate"><Heart className="h-4 w-4" /> Donate Now</Link></Button>
        </div>

        <button
          className="rounded-full p-2 text-ink lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-primary-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="ml-auto flex h-full w-[82%] max-w-sm flex-col bg-canvas p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-primary">Menu</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-full p-2 hover:bg-ink/5">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-accent"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <Button className="mt-auto gap-1.5" asChild><Link href="/donate"><Heart className="h-4 w-4" /> Donate Now</Link></Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
